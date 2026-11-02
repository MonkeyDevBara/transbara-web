-- ============================================================================
-- Isi pengaturan profil untuk redesign beranda v2.  Jalankan di SQL Editor Supabase (Run).
-- Aman dijalankan ulang. Tidak menghapus apa pun dan tidak mengubah skema (data saja).
--
--  site    : nama, tagline, dan deskripsi SEO diperbarui ke positioning baru "Founder & CEO SIDIGS" (menimpa nilai lama).
--            og_image yang sudah Anda isi TIDAK diubah.
--  contact : email diisi hanya bila masih kosong.
--  social  : Instagram & LinkedIn diisi hanya bila masih kosong; YouTube/X/Threads tidak disentuh.
-- ============================================================================
begin;

insert into public.site_settings (key, value, is_public) values
  ('site', jsonb_build_object(
      'name', 'Transbara Wahyu',
      'tagline', 'Founder & CEO SIDIGS',
      'description', 'Transbara Wahyu Firmansyah, Founder & CEO SIDIGS. Membantu 100+ sekolah bekerja lebih rapi lewat ekosistem digital terintegrasi.',
      'og_image', ''), true)
on conflict (key) do update
  set value = public.site_settings.value || jsonb_build_object(
        'name', 'Transbara Wahyu',
        'tagline', 'Founder & CEO SIDIGS',
        'description', 'Transbara Wahyu Firmansyah, Founder & CEO SIDIGS. Membantu 100+ sekolah bekerja lebih rapi lewat ekosistem digital terintegrasi.');

insert into public.site_settings (key, value, is_public) values
  ('contact', jsonb_build_object('email', 'transbarawahyu@gmail.com'), true)
on conflict (key) do update
  set value = public.site_settings.value
    || case when coalesce(nullif(public.site_settings.value ->> 'email', ''), '') = ''
            then jsonb_build_object('email', 'transbarawahyu@gmail.com') else '{}'::jsonb end;

insert into public.site_settings (key, value, is_public) values
  ('social', jsonb_build_object(
      'instagram', 'https://www.instagram.com/transbara.alfatih/',
      'linkedin', 'https://www.linkedin.com/in/transbara-wahyu-firmansyah'), true)
on conflict (key) do update
  set value = public.site_settings.value
    || case when coalesce(nullif(public.site_settings.value ->> 'instagram', ''), '') = ''
            then jsonb_build_object('instagram', 'https://www.instagram.com/transbara.alfatih/') else '{}'::jsonb end
    || case when coalesce(nullif(public.site_settings.value ->> 'linkedin', ''), '') = ''
            then jsonb_build_object('linkedin', 'https://www.linkedin.com/in/transbara-wahyu-firmansyah') else '{}'::jsonb end;

commit;

-- Verifikasi (opsional):
-- select key, value from public.site_settings where key in ('site', 'contact', 'social');
