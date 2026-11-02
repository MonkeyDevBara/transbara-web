# Website Transbara Wahyu

Situs personal branding (authority building) Transbara Wahyu Firmansyah. Brief lengkap ada di `prompt-website-transbara-wahyu.md` (folder Downloads).

## Stack

- **Astro 5** (SSR dengan adapter Node, dijalankan di VPS lewat PM2 + Nginx)
- **Argon Design System** (Bootstrap 4 SCSS) sebagai fondasi gaya, warna di-override sesuai brief, ada di `src/styles/argon/`
- **Supabase** project `Transbara Wahyu` (ref `odewmxiklbcmrpwqvwbj`, region Singapore, organisasi SIDIGS)

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:4321. Saat `dev`, data diambil langsung dari Supabase di setiap request, jadi perubahan di database langsung terlihat.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda |
| `/tentang` | Cerita founder (placeholder "Isi cerita asli" untuk bagian yang perlu cerita nyata) |
| `/artikel` | Indeks artikel dengan filter kategori, pencarian, dan muat lebih banyak |
| `/artikel/[slug]` | Detail artikel: daftar isi sticky, pull quote, figure, bagikan, artikel terkait, sebelumnya/berikutnya |
| `/proyek` | SIDIGS + Sedang Dieksplorasi |
| `/kontak` | Form kontak → tabel `contact_messages` |
| `/design-system` | Referensi komponen (noindex, tidak ada di navigasi) |

## Database (Supabase)

Skema, RLS, Storage, dan cara membuat admin pertama: lihat **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** (SQL di `supabase/migrations/`).

Tabel: `articles`, `categories`, `tags`, `article_tags`, `article_related`, `media`, `projects`, `speaking_topics`, `site_settings`, `contact_messages`, `newsletter_subscribers`. Semua memakai RLS:

- Publik hanya bisa membaca artikel berstatus `published` yang `published_at`-nya sudah lewat, serta proyek yang `is_published`.
- Publik hanya bisa **menambah** pesan kontak dan email newsletter, tidak bisa membacanya.

Hal yang bisa diatur langsung dari Supabase (Table Editor):

- **Email & sosmed**: tabel `site_settings`, key `contact` dan `social`. Selama masih `null`, situs menampilkan placeholder "belum diatur".
- **Logo & tautan SIDIGS**: tabel `projects`, kolom `logo_url` dan `url`.
- **Artikel**: semua artikel saat ini `is_sample = true` dan diberi label "Contoh konten". Ganti dengan tulisan asli lalu set `is_sample = false`.

## Ringkasan keputusan desain

- **Warna**: Putih #FFFFFF dominan, off-white #F6F8FB untuk seksi selang-seling, navy #16325C (heading, tombol, seksi gelap), biru tua #0D2140 (hover, footer), biru lembut #E8EFF8 (badge, area potret), charcoal #1F2733 (body), abu #6B7380 (meta).
- **List emas #C5A46D**: hanya garis 1–2px. Dipakai di garis bawah header, garis atas footer, garis pendek di atas judul seksi, garis bawah menu aktif, border kiri pull quote, bingkai potret, garis atas artikel unggulan, dan sisi topik andalan. Teks emas hanya di atas navy.
- **Tipografi**: DM Serif Display untuk heading, Inter untuk body/UI. Body 16px (artikel 18px, line-height 1.8). Kolom artikel maks. 720px.
- **Spacing**: seksi `clamp(4rem, 8vw, 7.5rem)`, container 1200px, gutter 16px di mobile.
- **Komponen**: kartu artikel dalam 4 varian (feature, row, compact, text) agar grid tidak seragam; sampul artikel tipografis dengan satu motif bintang delapan bergaris tipis sebagai ornamen Islami yang halus; tombol tanpa uppercase dan tanpa shadow (mengganti gaya bawaan Argon).
- **Potret**: foto asli dipakai di panel #E8EFF8 dengan `mix-blend-mode: multiply`, jadi latar terangnya menyatu dengan biru lembut. Untuk hasil terbaik, hapus latar foto lalu ganti file `public/images/transbara-wahyu.jpg`.

## Admin (`/admin`)

Tidak ada tautan ke admin dari situs publik; buka langsung `http://localhost:4321/admin`. Halaman ini `noindex` dan diblokir di `robots.txt`.

Modul: Ringkasan, Halaman Beranda (header sampai footer), Pengaturan Website (identitas, SEO, email, sosmed), Artikel (draft, terbit, jadwal, sampul, gambar inline, tag, artikel terkait, SEO + pratinjau Google), Kategori & Tag, Proyek, Topik Bicara, Pustaka Media, Pesan Masuk, Newsletter.

**Akses admin** butuh dua hal:
1. Akun di Supabase → Authentication → Users → *Add user* → *Create new user* (centang *Auto confirm*).
2. Email yang sama terdaftar di tabel `admin_users`:
   ```sql
   insert into public.admin_users (email) values ('email-anda@domain.com');
   ```

**Menambah konten baru di landing page**: tambahkan field di `SECTIONS` dan `DEFAULTS` pada `src/lib/content.ts`, lalu baca lewat `getContent()`. Form admin otomatis ikut muncul.

## Hosting (VPS: Node + PM2 + Nginx)

- Adapter `@astrojs/node` mode standalone, Node.js 22+. Server mendengarkan di `127.0.0.1:4321`; Nginx di depan sebagai reverse proxy.
- Mode SSR: halaman publik dibuat saat diakses, jadi perubahan dari admin langsung tampil tanpa build ulang. `/admin` tetap file statis.
- Deploy di server:
  ```bash
  git pull
  cp .env.example .env   # pertama kali saja, lalu isi nilainya (jangan di-commit)
  npm ci
  npm run build          # variabel PUBLIC_* dibaca saat build; ubah .env = build ulang
  pm2 start deploy/ecosystem.config.cjs   # pertama kali; selanjutnya: pm2 reload transbara-web
  pm2 save
  ```
- Nginx: contoh di `deploy/nginx.conf.example` (header keamanan, `noindex` untuk `/admin`, cache aset). Lalu `certbot --nginx` untuk HTTPS.
- Supabase → Authentication → URL Configuration: isi **Site URL** dengan `https://DOMAIN-ANDA/admin` dan tambahkan URL itu (plus `http://localhost:4321/admin`) ke **Redirect URLs**, supaya tautan "Lupa password" mengarah ke admin.
