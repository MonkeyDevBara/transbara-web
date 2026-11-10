# Website Transbara Wahyu

Situs personal branding (authority building) Transbara Wahyu Firmansyah. Brief lengkap ada di `prompt-website-transbara-wahyu.md` (folder Downloads).

## Stack

- **Astro 5** (SSR dengan adapter Node, dijalankan di VPS lewat PM2 + Nginx)
- **SCSS** modular di `src/styles/v2/` (token, base, components, sections, pages). Tema gelap navy + hitam, font self-hosted (Anton, Manrope, Caveat), animasi mikro vanilla TS di `src/scripts/` (hormati `prefers-reduced-motion` + tombol Motion on/off)
- **Supabase** project `Transbara Wahyu` (ref `odewmxiklbcmrpwqvwbj`, region Singapore, organisasi SIDIGS)

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:4321. Saat `dev`, data diambil langsung dari Supabase di setiap request, jadi perubahan di database langsung terlihat.

Di mode `npm run dev`, bila database tidak terjangkau (atau tabel `ebooks` belum dimigrasi), tab **E-Book** dan **Proyek Lainnya** memakai 2 data contoh masing-masing (bertanda "Pratinjau lokal"; gambar di `public/v2/img/preview/`). Di produksi selalu data CMS.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda |
| `/tentang` | Profil Founder & CEO SIDIGS: cerita, timeline LinkedIn, nilai, topik bicara |
| `/artikel` | Indeks artikel dengan filter kategori, pencarian, dan muat lebih banyak |
| `/artikel/[slug]` | Detail artikel: daftar isi sticky, pull quote, figure, bagikan, artikel terkait, sebelumnya/berikutnya |
| `/proyek` | Studi kasus SIDIGS, mitra/partner, penghargaan, galeri, proyek dari CMS |
| `/kontak` | Form kontak → tabel `contact_messages` |
| `/design-system` | Referensi komponen (noindex, tidak ada di navigasi) |

## Database (Supabase)

Skema, RLS, Storage, dan cara membuat admin pertama: lihat **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** (SQL di `supabase/migrations/`).

Tabel: `articles`, `categories`, `tags`, `article_tags`, `article_related`, `media`, `projects`, `ebooks`, `speaking_topics`, `site_settings`, `contact_messages`, `newsletter_subscribers`. Semua memakai RLS:

- Publik hanya bisa membaca artikel berstatus `published` yang `published_at`-nya sudah lewat, serta proyek yang `is_published`.
- Publik hanya bisa **menambah** pesan kontak dan email newsletter, tidak bisa membacanya.

Hal yang bisa diatur langsung dari Supabase (Table Editor):

- **Email & sosmed**: tabel `site_settings`, key `contact` dan `social`. Selama masih `null`, situs menampilkan placeholder "belum diatur".
- **Logo & tautan SIDIGS**: tabel `projects`, kolom `logo_url` dan `url`.
- **Artikel**: semua artikel saat ini `is_sample = true` dan diberi label "Contoh konten". Ganti dengan tulisan asli lalu set `is_sample = false`.

## Ringkasan keputusan desain

- **Warna** (token di `src/styles/v2/_tokens.scss`): latar `#05070B`, permukaan `#0A0F1A` / `#0F1626`, garis `#18223A`, navy `#0A1D4A` / `#123C8F`, aksen biru `#2F6BFF` (tombol `#2559E0`, teks kecil `#7FA6FF`), teks `#EEF2F8`, redup `#8A94A8`.
- **Tipografi**: Anton untuk judul display, Manrope untuk body, Caveat untuk aksen tulisan tangan. Semua di `public/fonts/`, tanpa Google Fonts.
- **Gerak**: reveal saat scroll, count-up statistik, marquee logo, parallax, tombol magnetik. Semua mati otomatis bila `prefers-reduced-motion`; pengunjung bisa mematikan lewat tombol Motion (disimpan di `localStorage`).
- **Konten**: teks Beranda (`home_*`) dan halaman lain (`page_*`) disimpan di `site_settings`, default ada di `src/lib/home-defaults.ts` dan `src/lib/page-defaults.ts`, dan dapat diubah dari admin (Beranda / Halaman Lain / Global).
- **SEO**: canonical, Open Graph + Twitter card, JSON-LD (Person, Organization, WebSite, BreadcrumbList, Article), `sitemap.xml` dinamis, `robots.txt`, favicon set. Gambar OG default `public/v2/img/og-default.jpg`.
- **Referensi komponen**: `/design-system` (noindex). Dokumen perencanaan lengkap: `docs/PRD-redesign-2026.md`.

## Admin (`/admin`)

Tidak ada tautan ke admin dari situs publik; buka langsung `http://localhost:4321/admin`. Halaman ini `noindex` dan diblokir di `robots.txt`.

Modul: Ringkasan, Halaman Beranda (header sampai footer), Halaman Lain (Proyek, Tentang, Artikel, Kontak, 404), Pengaturan Website (identitas, SEO, email, sosmed), Artikel (draft, terbit, jadwal, sampul, gambar inline, tag, artikel terkait, SEO + pratinjau Google), Kategori & Tag, Proyek (logo + poster potret), E-Book (sampul potret, label, tautan), Topik Bicara, Pustaka Media, Pesan Masuk, Newsletter.

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
