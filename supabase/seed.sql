-- ============================================================================
-- Seed aman: hanya pengaturan situs bawaan. Tidak menimpa data yang sudah ada.
-- Nilainya sama dengan DEFAULTS di src/lib/content.ts (situs tetap jalan tanpa seed ini).
-- Tidak ada akun admin, artikel, atau konten pribadi di sini.
-- Jalankan setelah kedua file migrasi.
-- ============================================================================

insert into public.site_settings (key, value, is_public) values
  ('site', jsonb_build_object(
      'name', 'Transbara Wahyu',
      'tagline', 'Founder & CEO SIDIGS',
      'description', 'Transbara Wahyu Firmansyah, Founder & CEO SIDIGS. Membantu 100+ sekolah bekerja lebih rapi lewat ekosistem digital terintegrasi.',
      'og_image', ''), true),
  ('contact', jsonb_build_object('email', 'transbarawahyu@gmail.com'), true),
  ('social', jsonb_build_object('instagram', 'https://www.instagram.com/transbara.alfatih/', 'linkedin', 'https://www.linkedin.com/in/transbara-wahyu-firmansyah', 'youtube', '', 'x', '', 'threads', ''), true)
on conflict (key) do nothing;
