-- ============================================================================
-- Transbara Wahyu: Storage bucket "media" + policy
-- ============================================================================
-- Jalankan SETELAH 20261102000000_initial_schema.sql (memakai public.is_admin()).
-- Idempotent. Satu-satunya bucket yang dipakai kode adalah "media"
-- (src/admin/sb.ts: MEDIA_BUCKET). Path unggahan: YYYY-MM/nama-file-xxxx.ext
-- ============================================================================

begin;

-- Bucket publik: gambar artikel, sampul, dan foto ditampilkan ke pengunjung lewat
-- URL publik (/storage/v1/object/public/media/...). Pengunjung TIDAK perlu policy
-- SELECT, sehingga mereka tidak bisa menelusuri / me-list isi bucket.
-- SVG sengaja tidak diizinkan (bisa memuat skrip).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,  -- 10 MB, sama dengan batas di sb.ts
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_admin_select" on storage.objects;
drop policy if exists "media_admin_insert" on storage.objects;
drop policy if exists "media_admin_update" on storage.objects;
drop policy if exists "media_admin_delete" on storage.objects;

create policy "media_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

commit;
