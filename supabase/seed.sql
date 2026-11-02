-- ============================================================================
-- Seed aman: hanya pengaturan situs bawaan. Tidak menimpa data yang sudah ada.
-- Nilainya sama dengan DEFAULTS di src/lib/content.ts (situs tetap jalan tanpa seed ini).
-- Tidak ada akun admin, artikel, atau konten pribadi di sini.
-- Jalankan setelah kedua file migrasi.
-- ============================================================================

insert into public.site_settings (key, value, is_public) values
  ('site', jsonb_build_object(
      'name', 'Transbara Wahyu',
      'tagline', 'Slowliving Muslimpreneur',
      'description', 'Catatan perjalanan tentang membangun bisnis, mentransformasi pendidikan, dan bertumbuh sebagai Muslimpreneur.',
      'og_image', ''), true),
  ('contact', jsonb_build_object('email', ''), true),
  ('social', jsonb_build_object('instagram', '', 'linkedin', '', 'youtube', '', 'x', '', 'threads', ''), true)
on conflict (key) do nothing;
