import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_PUBLISHABLE_KEY kosong saat build. Isi .env lalu jalankan npm run build ulang.');
}

// Klien khusus admin: sesi login disimpan di browser dan diperbarui otomatis.
// Hanya memakai publishable key; hak akses ditentukan RLS (public.is_admin()), bukan UI ini.
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'tw-admin-auth', detectSessionInUrl: true },
});

export const MEDIA_BUCKET = 'media';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export { slugify };

/** Unggah gambar ke Storage, catat di tabel media, kembalikan URL publik. */
export async function uploadImage(file: File, alt = ''): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar (JPG, PNG, WebP, atau GIF).');
  if (file.size > 10 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 10 MB.');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'gambar';
  const path = `${new Date().toISOString().slice(0, 7)}/${base}-${Date.now().toString(36)}.${ext}`;
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const url = sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  const dims = await imageSize(file).catch(() => null);
  const { error: dbError } = await sb.from('media').insert({ url, alt: alt || null, width: dims?.w ?? null, height: dims?.h ?? null });
  if (dbError) {
    // Jangan biarkan file yatim di Storage bila pencatatan gagal.
    await sb.storage.from(MEDIA_BUCKET).remove([path]);
    throw dbError;
  }
  return url;
}

function imageSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { resolve({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(img.src); };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** Path di bucket dari URL publik (untuk hapus file). */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

export const errMsg = (e: unknown) => {
  const m = (e as any)?.message ?? String(e);
  if (/row-level security|permission denied/i.test(m)) return 'Akses ditolak. Pastikan akun Anda terdaftar sebagai admin.';
  if (/duplicate key.*slug/i.test(m)) return 'Slug sudah dipakai. Gunakan slug lain.';
  if (/duplicate key/i.test(m)) return 'Data dengan nilai yang sama sudah ada.';
  return m;
};
