// Pencatat kunjungan halaman publik. Dipanggil oleh src/scripts/track.ts.
// Tidak menyimpan IP / user-agent mentah: hanya hash harian (lihat migrasi page_views).
import type { APIRoute } from 'astro';
import { createHash, randomUUID } from 'node:crypto';
import { supabase } from '../../lib/supabase';

// Garam hash. Atur ANALYTICS_SALT di server agar hitungan unik stabil antar restart;
// tanpa itu dipakai garam acak per proses (hitungan unik hari berjalan bisa terpecah saat restart).
const SALT = process.env.ANALYTICS_SALT || randomUUID();

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|httpclient|axios|go-http|java\//i;

// Batas laju sederhana per pengunjung (anti banjir data).
const LIMIT = 60;
const WINDOW_MS = 60_000;
const hits = new Map<string, { n: number; reset: number }>();

const noContent = () => new Response(null, { status: 204 });

function limited(key: string) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + WINDOW_MS }); return false; }
  return ++h.n > LIMIT;
}

const hostOf = (v: string | null | undefined) => {
  try { return v ? new URL(v).hostname.toLowerCase() : null; } catch { return null; }
};

function deviceOf(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (/ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return 'tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ua = request.headers.get('user-agent') ?? '';
  if (!ua || BOT.test(ua)) return noContent();

  // Hanya dari situs sendiri (Origin bila ada). Perbandingan per hostname karena TLS diakhiri di Nginx.
  const host = hostOf(`http://${request.headers.get('host') ?? ''}`);
  const origin = hostOf(request.headers.get('origin'));
  if (origin && host && origin !== host) return noContent();

  let body: { path?: unknown; referrer?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 2000) return noContent();
    body = JSON.parse(raw);
  } catch { return noContent(); }

  // Path: hanya pathname, tanpa slash akhir (kecuali beranda), bukan admin/api.
  if (typeof body.path !== 'string' || !body.path.startsWith('/') || body.path.length > 300) return noContent();
  const path = body.path.length > 1 ? body.path.replace(/\/+$/, '') || '/' : body.path;
  if (/^\/(admin|api)(\/|$)/.test(path)) return noContent();

  // Sumber: hanya situs lain. Navigasi internal dan kunjungan langsung sama-sama disimpan null.
  let refHost = typeof body.referrer === 'string' ? hostOf(body.referrer) : null;
  if (refHost === host) refHost = null;

  // Nginx menambahkan IP klien di entri TERAKHIR X-Forwarded-For; entri sebelumnya bisa dipalsukan klien.
  const xff = request.headers.get('x-forwarded-for')?.split(',').pop()?.trim();
  let ip = xff || request.headers.get('x-real-ip') || '';
  if (!ip) { try { ip = clientAddress; } catch { ip = ''; } }

  const day = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10); // hari WIB
  const visitor = createHash('sha256').update(`${SALT}|${day}|${ip}|${ua}`).digest('hex').slice(0, 32);
  if (limited(visitor)) return noContent();

  const { error } = await supabase.from('page_views').insert({
    path,
    referrer_host: refHost,
    visitor_hash: visitor,
    device: deviceOf(ua),
  });
  if (error) console.error('[hit] gagal mencatat kunjungan:', error.message);
  return noContent();
};
