// Endpoint penerbit artikel otomatis (dipakai AI agent Telegram).
// Auth: header "Authorization: Bearer <ARTICLE_API_KEY>". Menulis ke Supabase dengan service role
// yang hanya ada di environment SERVER (tanpa awalan PUBLIC_, tidak pernah dikirim ke browser).
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createHash, timingSafeEqual } from 'node:crypto';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const sha = (s: string) => createHash('sha256').update(s).digest();
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const readingMinutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 200));

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const httpUrl = (v: unknown) => {
  const s = str(v, 2000);
  if (!s) return null;
  try { return /^https?:$/.test(new URL(s).protocol) ? s : null; } catch { return null; }
};

const MAX_IMAGE = 10 * 1024 * 1024;
// Tipe gambar dideteksi dari isi file (magic bytes), bukan dari klaim pengirim. SVG sengaja ditolak.
function sniffImage(b: Buffer): { type: string; ext: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { type: 'image/jpeg', ext: 'jpg' };
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { type: 'image/png', ext: 'png' };
  if (b.subarray(0, 4).toString('latin1') === 'GIF8') return { type: 'image/gif', ext: 'gif' };
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return { type: 'image/webp', ext: 'webp' };
  return null;
}

// Batas laju kasar per proses (anti brute-force key / banjir).
const hits: number[] = [];
const limited = () => {
  const now = Date.now();
  while (hits.length && hits[0] < now - 60_000) hits.shift();
  hits.push(now);
  return hits.length > 30;
};

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.ARTICLE_API_KEY;
  const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey || apiKey.length < 32 || !serviceKey || !url) return json({ error: 'Endpoint belum dikonfigurasi di server.' }, 503);

  if (limited()) return json({ error: 'Terlalu banyak permintaan.' }, 429);
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!given || !timingSafeEqual(sha(given), sha(apiKey))) return json({ error: 'Unauthorized.' }, 401);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 14_500_000) return json({ error: 'Body terlalu besar (maks ~14 MB).' }, 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
  } catch { return json({ error: 'Body harus JSON object.' }, 400); }

  const title = str(body.title, 300);
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!title) return json({ error: 'Field "title" wajib.' }, 400);
  if (!content) return json({ error: 'Field "content" (Markdown) wajib.' }, 400);

  const status = body.status === 'draft' ? 'draft' : 'published';
  let baseSlug = slugify(str(body.slug, 200) ?? title).slice(0, 120).replace(/-+$/, '');
  if (!baseSlug) return json({ error: 'Slug tidak valid.' }, 400);

  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const warnings: string[] = [];

  // Slug unik: bila terpakai, tambahkan -2, -3, ...
  let slug = baseSlug;
  for (let i = 2; ; i++) {
    const { data, error } = await db.from('articles').select('id').eq('slug', slug).maybeSingle();
    if (error) return json({ error: 'Gagal memeriksa slug: ' + error.message }, 502);
    if (!data) break;
    if (i > 50) return json({ error: 'Slug terlalu sering bentrok.' }, 409);
    slug = `${baseSlug}-${i}`;
  }

  // Sampul: unggah ke Storage bucket "media" dari base64 atau dari URL https; hasilnya jadi cover_url.
  let cover_url = httpUrl(body.cover_url);
  let uploadedPath: string | null = null;
  const b64 = typeof body.cover_image_base64 === 'string' ? body.cover_image_base64.replace(/^data:[^,]*,/, '').replace(/\s/g, '') : '';
  const srcUrl = httpUrl(body.cover_image_url);
  if (b64 || srcUrl) {
    let buf: Buffer | null = null;
    if (b64) buf = Buffer.from(b64, 'base64');
    else if (srcUrl!.startsWith('https://')) {
      try {
        const r = await fetch(srcUrl!, { redirect: 'error', signal: AbortSignal.timeout(15_000) });
        const len = Number(r.headers.get('content-length') ?? 0);
        if (r.ok && len <= MAX_IMAGE) buf = Buffer.from(await r.arrayBuffer());
      } catch { /* ditangani di bawah */ }
    }
    const kind = buf && buf.length <= MAX_IMAGE ? sniffImage(buf) : null;
    if (!buf || !kind) return json({ error: 'Gambar sampul tidak valid: harus JPG/PNG/WebP/GIF, maks 10 MB (URL harus https).' }, 400);
    uploadedPath = `${new Date().toISOString().slice(0, 7)}/${slug}-${Date.now().toString(36)}.${kind.ext}`;
    const { error: upErr } = await db.storage.from('media').upload(uploadedPath, buf, { contentType: kind.type, upsert: false });
    if (upErr) return json({ error: 'Gagal mengunggah sampul: ' + upErr.message }, 502);
    cover_url = db.storage.from('media').getPublicUrl(uploadedPath).data.publicUrl;
    const { error: mErr } = await db.from('media').insert({ url: cover_url, alt: str(body.cover_alt, 300) });
    if (mErr) warnings.push('Sampul terunggah tapi tidak tercatat di Pustaka Media: ' + mErr.message);
  }

  // Kategori: cocokkan slug/nama yang sudah ada; bila tak ketemu, artikel tanpa kategori.
  let category_id: string | null = null;
  const cat = str(body.category, 100);
  if (cat) {
    const { data } = await db.from('categories').select('id').or(`slug.eq.${slugify(cat)},name.ilike.${cat.replace(/[,()%]/g, ' ')}`).limit(1);
    if (data?.[0]) category_id = data[0].id; else warnings.push(`Kategori "${cat}" tidak ditemukan; artikel tanpa kategori.`);
  }

  const { data: art, error } = await db
    .from('articles')
    .insert({
      title,
      slug,
      subtitle: str(body.subtitle, 300),
      excerpt: str(body.excerpt, 500),
      content,
      cover_url,
      cover_alt: str(body.cover_alt, 300),
      cover_credit: str(body.cover_credit, 300),
      category_id,
      status,
      is_sample: false,
      reading_minutes: readingMinutes(content),
      published_at: status === 'published' ? new Date().toISOString() : null,
      seo_title: str(body.seo_title, 120),
      seo_description: str(body.seo_description, 320),
    })
    .select('id, slug, status')
    .single();
  if (error || !art) {
    if (uploadedPath) await db.storage.from('media').remove([uploadedPath]);
    return json({ error: 'Gagal menyimpan artikel: ' + (error?.message ?? 'unknown') }, 502);
  }

  // Tag: dibuat bila belum ada.
  const tagNames = Array.isArray(body.tags) ? [...new Set(body.tags.map((t) => str(t, 60)).filter((t): t is string => !!t))].slice(0, 10) : [];
  if (tagNames.length) {
    const rows = tagNames.map((name) => ({ name, slug: slugify(name) })).filter((t) => t.slug);
    const { data: tags, error: tErr } = await db.from('tags').upsert(rows, { onConflict: 'slug' }).select('id');
    if (tErr || !tags) warnings.push('Tag gagal disimpan: ' + (tErr?.message ?? ''));
    else {
      const { error: lErr } = await db.from('article_tags').insert(tags.map((t) => ({ article_id: art.id, tag_id: t.id })));
      if (lErr) warnings.push('Tag gagal dikaitkan: ' + lErr.message);
    }
  }

  const origin = (process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
  return json({ ok: true, id: art.id, slug: art.slug, status: art.status, url: `${origin}/artikel/${art.slug}`, warnings }, 201);
};
