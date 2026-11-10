# Setup Supabase: Transbara Wahyu

Panduan menyiapkan database, Storage, dan login admin. Semua SQL bersifat **idempotent** (aman dijalankan ulang, tidak menghapus data, tidak ada DROP TABLE/COLUMN).

> Status: SQL di repo ini sudah diuji pada PostgreSQL lokal (skema, RLS untuk anon / user biasa / admin, idempotency), tetapi **belum dijalankan di project Supabase Anda**. Langkah 2 dan seterusnya harus Anda lakukan sendiri.

## 1. Membuka SQL Editor

1. Buka https://supabase.com/dashboard dan pilih project **Transbara Wahyu**.
2. Menu kiri: **SQL Editor** > **New query**.

## 2. File SQL yang dijalankan (berurutan)

| Urutan | File | Isi |
| --- | --- | --- |
| 1 | `supabase/migrations/20261102000000_initial_schema.sql` | 12 tabel, relasi, constraint, index, trigger `updated_at`, fungsi `is_admin()`, hak akses, **RLS + semua policy** |
| 2 | `supabase/migrations/20261102000100_storage.sql` | Bucket `media` + policy Storage |
| 3 | `supabase/seed.sql` | Pengaturan situs bawaan (opsional, tidak menimpa data) |
| 4 | `supabase/migrations/20261110000000_ebooks_and_project_poster.sql` | Tabel `ebooks` (+RLS, trigger) dan kolom `projects.poster_url` (tab E-Book & poster Proyek Lainnya) |

Untuk tiap file: buka isinya, tempel ke SQL Editor, klik **Run**, pastikan hasilnya `Success`. Jika ada error, jangan lanjut ke file berikutnya; file dijalankan dalam satu transaksi sehingga tidak ada perubahan setengah jalan.

**Bila database sudah berisi tabel/data lama** (kasus project ini): migrasi hanya menambah kolom/index/constraint yang belum ada. `CHECK` ditambahkan dengan `NOT VALID` sehingga data lama tidak ditolak. Perhatikan: **semua policy lama pada tabel aplikasi dihapus lalu dibuat ulang** sesuai desain di bawah. Foreign key tidak ditambahkan pada tabel yang sudah ada, supaya tidak muncul relasi ganda yang membingungkan PostgREST; verifikasinya ada di langkah 9.

## 3. Storage

Migrasi kedua sudah membuat bucket `media` (satu-satunya bucket yang dipakai kode, lihat `MEDIA_BUCKET` di `src/admin/sb.ts`):

- **Publik**: gambar tampil lewat URL publik tanpa login. Pengunjung tidak punya policy `SELECT`, jadi tidak bisa menelusuri isi bucket.
- Batas 10 MB; tipe: JPEG, PNG, WebP, GIF, AVIF (SVG sengaja ditolak karena bisa memuat skrip).
- Hanya admin (`is_admin()`) yang boleh upload, ubah, hapus.

Verifikasi: **Storage** > bucket `media` ada dan berlabel *Public*.

## 4. Authentication

Di **Authentication**:

1. **Sign In / Providers** > Email: aktif; **Confirm email** aktif.
2. **Sign In / Providers** > matikan **Allow new users to sign up**. Admin hanya dibuat manual (langkah 5), jadi pendaftaran publik tidak perlu.
3. Tidak perlu provider lain.

Catatan keamanan: akses admin ditentukan database (`public.is_admin()`), bukan tampilan di browser. Akun yang berhasil login tetapi tidak terdaftar di `admin_users` tidak bisa membaca/menulis data admin sama sekali.

## 5. Membuat admin pertama

Admin = akun Supabase Auth dengan email **terkonfirmasi** yang emailnya tercatat di tabel `admin_users`. Tabel itu tidak punya policy tulis, jadi tidak ada user (termasuk admin) yang bisa menambah admin lewat aplikasi. Hanya pemilik project lewat dashboard.

1. **Authentication** > **Users** > **Add user** > **Create new user**: isi email dan password kuat, **centang Auto Confirm User**.
2. Di SQL Editor:
   ```sql
   insert into public.admin_users (email) values ('email-anda@domain.com');
   ```
   Email harus sama dengan akun di langkah 1 (huruf besar/kecil tidak berpengaruh).
3. Admin tambahan: ulangi langkah 1-2. Mencabut akses: `delete from public.admin_users where email = '...';`.

## 6. Redirect URL

**Authentication** > **URL Configuration**:

- **Site URL**: `https://DOMAIN-ANDA/admin`
- **Redirect URLs**: tambahkan `https://DOMAIN-ANDA/admin` dan `http://localhost:4321/admin`

Tautan "Lupa password" dan undangan akan mengarah ke sini.

## 7. Variabel lingkungan

Salin `.env.example` menjadi `.env` di server/mesin build:

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Nilai di **Project Settings** > **API**. Hal penting:

- Variabel `PUBLIC_*` **dibaca saat build** dan tertanam di JavaScript browser. Ubah nilai = jalankan `npm run build` ulang.
- Hanya pakai *publishable/anon key*. **Jangan pernah** memakai `service_role`/secret key di proyek ini; tidak ada kode yang membutuhkannya.
- `.env` sudah masuk `.gitignore`. Jangan di-commit.
- Aplikasi sekarang gagal dengan pesan jelas bila kedua variabel kosong.

## 8. Menguji situs publik

1. `npm run dev`, buka http://localhost:4321.
2. Beranda, `/artikel`, `/proyek`, `/tentang` tampil tanpa error. Hanya artikel terbit, proyek aktif/eksplorasi yang `is_published`, dan topik `is_published` yang muncul.
3. `/kontak`: kirim pesan uji, harus sukses. `/` (footer): daftar newsletter dengan email uji; mendaftar ulang dengan email sama tetap tampil sukses (kode 23505 ditangani).
4. Di Table Editor, pesan dan email uji itu muncul di `contact_messages` dan `newsletter_subscribers`.

## 9. Menguji login admin dan CRUD

1. Buka `/admin`, login dengan akun langkah 5. Akun yang valid tetapi belum ada di `admin_users` melihat "Akses ditolak". Jika muncul "Tidak dapat memeriksa akses", migrasi belum dijalankan.
2. Uji: buat artikel (draft > terbitkan > cek di `/artikel`), kategori, tag, proyek, topik, ubah Pengaturan Website, unggah gambar di Pustaka Media (cek file muncul di Storage bucket `media` dan baris di tabel `media`), tandai pesan dibaca, hapus pelanggan uji.
3. Logout, muat ulang `/admin`: harus kembali ke layar login. Tutup tab lalu buka lagi: sesi tetap (refresh token otomatis).

## 10. Memverifikasi RLS

**a. Semua tabel ber-RLS** (hasil harus kosong):
```sql
select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
```

**b. Daftar policy**:
```sql
select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public' order by 1, 2;
```
Tidak boleh ada policy untuk `contact_messages`, `newsletter_subscribers`, `media`, `admin_users` yang memberi `SELECT` ke `anon`.

**c. Foreign key** (tiap pasangan tabel/kolom muncul **sekali**; ganda berarti PostgREST error "more than one relationship"):
```sql
select conrelid::regclass as tabel, conname, pg_get_constraintdef(oid) from pg_constraint
where contype = 'f' and connamespace = 'public'::regnamespace order by 1, 2;
```
Harus ada: `articles.category_id`, `article_tags.article_id/tag_id`, `article_related.article_id/related_id`.

**d. Uji dari luar sebagai pengunjung** (ganti URL dan key):
```bash
URL=https://xxxx.supabase.co; KEY=sb_publishable_...
curl -s "$URL/rest/v1/contact_messages?select=*"        -H "apikey: $KEY" -H "Authorization: Bearer $KEY"   # harus error 42501 (permission denied)
curl -s "$URL/rest/v1/newsletter_subscribers?select=*"  -H "apikey: $KEY" -H "Authorization: Bearer $KEY"   # harus error 42501
curl -s "$URL/rest/v1/admin_users?select=*"             -H "apikey: $KEY" -H "Authorization: Bearer $KEY"   # harus error 42501
curl -s "$URL/rest/v1/articles?select=slug,status"      -H "apikey: $KEY" -H "Authorization: Bearer $KEY"   # hanya yang terbit
curl -s -X POST "$URL/rest/v1/articles" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"title":"x","slug":"x"}'  # harus ditolak
```

**e. Data lama melanggar constraint?** Setelah data bersih, aktifkan constraint penuh:
```sql
select conrelid::regclass, conname from pg_constraint where connamespace = 'public'::regnamespace and not convalidated;
-- lalu per constraint: alter table public.<tabel> validate constraint <nama>;
```

## Ringkasan model akses

| Data | Pengunjung (anon) | Admin |
| --- | --- | --- |
| Artikel | baca bila `status` terbit/terjadwal **dan** `published_at <= now()` | CRUD (termasuk draft) |
| Tag & artikel terkait | hanya milik artikel yang terlihat | CRUD |
| Kategori, tag | baca | CRUD |
| Proyek | baca bila `is_published` dan status `active`/`exploring` | CRUD |
| E-Book | baca bila `is_published` | CRUD |
| Topik bicara | baca bila `is_published` | CRUD |
| `site_settings` | baca bila `is_public` (default true) | CRUD |
| `contact_messages` | **hanya kirim** (tidak bisa baca) | baca, tandai dibaca, hapus |
| `newsletter_subscribers` | **hanya daftar** (tidak bisa baca; email unik tanpa beda huruf) | baca, ekspor, hapus |
| `media` + Storage `media` | file publik via URL; tidak bisa list/upload | CRUD + upload |
| `admin_users` | tidak ada akses | baca; tulis hanya via SQL Editor |

Pengaturan internal yang tidak boleh terbaca publik: simpan di `site_settings` dengan `is_public = false`.
