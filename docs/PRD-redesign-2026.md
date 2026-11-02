# PRD: Redesign Website Portofolio transbara.my.id

| | |
|---|---|
| **Versi** | 0.2 (lengkap, siap dieksekusi setelah disetujui) |
| **Tanggal** | 2026-11-02 |
| **Pemilik** | Transbara Wahyu Firmansyah |
| **Referensi gaya** | https://renando.duingzcreative.site/ |
| **Situs saat ini** | https://transbara.my.id/ (repo `MonkeyDevBara/transbara-web`) |
| **Riwayat** | v0.1 draft awal → v0.2 keputusan, data LinkedIn, copy, spesifikasi teknis |

---

## 0. Ringkasan Keputusan
| # | Topik | Keputusan |
|---|---|---|
| K1 | Gaya | Mengikuti struktur & gaya Renando (dark editorial), warna **biru tua + hitam** |
| K2 | Positioning | **Founder & CEO SIDIGS** sebagai identitas utama. Nilai Muslimpreneur tetap ada di seksi Tentang & kutipan |
| K3 | Foto hero | Foto batik biru dengan latar dihapus → `docs/assets/transbara-wahyu-cutout.{png,webp}` |
| K4 | Statistik | **100+** sekolah mitra · **15** produk ekosistem · **5** penghargaan startup |
| K5 | Tahun penghargaan | Ditampilkan **tanpa tahun** (data tidak tersedia). Kolom kanan memakai peringkat (1ST / TOP 10) |
| K6 | CV | Tombol Download CV memakai PDF LinkedIn dulu |
| K7 | Stack | Tetap Astro 5 SSR + Supabase + Admin. Tanpa tabel baru; seksi baru lewat skema `SECTIONS` (lihat §11) |
| K8 | Wordmark | **TRANSBARA.** (titik biru). Simbol ® dari referensi **tidak** dipakai karena merek belum terdaftar |

Keputusan yang masih terbuka ada di §19.

---

## 1. Ringkasan
Merombak tampilan transbara.my.id agar memakai gaya situs Renando: gelap, editorial, tipografi display besar, angka besar, grid karya, marquee logo, daftar penghargaan, dan timeline. Palet diganti menjadi biru tua + hitam, dan seluruh halaman diberi micro-animation yang halus.

Situs diposisikan sebagai portofolio **Founder & CEO SIDIGS**, dengan SIDIGS sebagai "karya" utama.

## 2. Tujuan, Non-Tujuan, Metrik
**Tujuan**
1. Kredibilitas terlihat dalam < 5 detik: jabatan, angka, logo mitra, dan penghargaan sudah ada di layar pertama dan kedua.
2. SIDIGS tampil sebagai karya nyata: produk, mitra, penghargaan, dampak, dan dokumentasi.
3. Mengarahkan ke 3 aksi: **undang bicara**, **kolaborasi / digitalisasi sekolah**, **hubungi**.
4. Micro-animation halus yang tetap ringan dan aksesibel.
5. Konten penting bisa diubah dari `/admin` tanpa menyentuh kode.

**Non-Tujuan**
- Mengganti stack atau database.
- Membuat situs SIDIGS terpisah.
- Mendesain ulang tampilan Admin (fungsinya ditambah, gayanya tetap).
- Multi-bahasa penuh. Situs berbahasa Indonesia, dengan label kecil berbahasa Inggris sebagai aksen gaya.

**Metrik keberhasilan (30 hari setelah rilis)**
| Metrik | Target |
|---|---|
| Lighthouse mobile: Performance / Accessibility / SEO | ≥ 90 / ≥ 95 / ≥ 95 |
| Pesan masuk dari form kontak | ≥ 3 per bulan |
| Klik "Let's talk" / "Mulai percakapan" | Terukur (event sederhana tanpa tracker pihak ketiga, opsional) |
| Teks placeholder di halaman publik | 0 |

## 3. Audiens & Pesan Kunci
| Audiens | Yang dicari | Pesan yang harus mereka tangkap |
|---|---|---|
| Kepala sekolah / yayasan | Apakah orang ini paham sekolah & bisa dipercaya? | "Mantan kepala sekolah yang membangun SIDIGS, dipakai 100+ sekolah" |
| Penyelenggara acara / seminar | Topik, kredibilitas, cara mengundang | "Pembicara transformasi digital sekolah, AI untuk guru, dari sekolah ke startup" |
| Partner, investor, pemerintah | Traksi, penghargaan, ekosistem | "1st Winner Indigo Betalist, 4× Top 10 program startup, 13 partner" |
| Media / umum | Siapa dia, ceritanya | "Dari ruang kepala sekolah ke edutech" |

**Kalimat inti (one-liner):** *"Membantu sekolah bekerja lebih rapi lewat teknologi yang sederhana dan benar-benar dipakai."*

## 4. Kondisi Saat Ini (audit)
| Aspek | Temuan |
|---|---|
| Stack | Astro 5 SSR (`@astrojs/node`), Preact untuk admin, Supabase (DB + Auth + Storage `media`), SCSS di atas Argon (Bootstrap 4) |
| Deploy | VPS 43.173.9.126, PM2 (`transbara-web`, port 4321) di belakang Nginx + Certbot |
| Gaya | Terang: putih, navy #16325C, aksen emas #C5A46D, DM Serif Display + Inter |
| Halaman | `/`, `/tentang`, `/artikel`, `/artikel/[slug]`, `/proyek`, `/kontak`, `/admin`, `/design-system`, 404 |
| Admin | Ringkasan, Halaman Beranda, Pengaturan, Artikel, Kategori & Tag, Proyek, Topik Bicara, Media, Pesan Masuk, Newsletter |
| Konten | Email & sosmed "belum diatur", placeholder "Isi cerita asli" di /tentang, "Belum ada proyek", semua artikel masih contoh (`is_sample = true`) |
| Catatan teknis | Folder `public/images/` read-only; Storage menolak SVG (logo harus PNG/WebP, atau SVG statis di `public/`); migrasi SQL dijalankan manual di SQL Editor Supabase |

---

## 5. Sistem Desain

### 5.1 Prinsip
1. **Gelap & tenang:** hitam kebiruan sebagai kanvas, satu warna aksen biru.
2. **Tipografi sebagai visual:** judul Anton raksasa, uppercase, dengan titik aksen biru di akhir ("KARYA YANG BICARA**.**").
3. **Struktur editorial:** label seksi bernomor (`01 / KARYA`), garis 1px, grid 12 kolom, ruang kosong lega.
4. **Bukti, bukan klaim:** angka, logo, penghargaan, dan foto lapangan.
5. **Gerak yang bermakna:** animasi membantu membaca urutan, bukan sekadar hiasan.

### 5.2 Warna
| Token | Hex | Pemakaian | Kontras di `--bg` / `--bg-2` |
|---|---|---|---|
| `--bg` | `#05070B` | Latar utama | n/a |
| `--bg-2` | `#0A0F1A` | Seksi selang-seling, kartu | n/a |
| `--bg-3` | `#0F1626` | Hover kartu, input | n/a |
| `--line` | `#18223A` | Garis pemisah, border | n/a |
| `--navy-900` | `#0A1D4A` | Panel biru tua (kartu kutipan, kartu SIDIGS) | n/a |
| `--navy-700` | `#123C8F` | Gradien kata raksasa, hover tombol | n/a |
| `--accent` | `#2F6BFF` | Titik judul, angka besar, progress bar (bukan teks kecil) | 4.5:1 / 4.3:1 |
| `--accent-strong` | `#2559E0` | Latar tombol dengan teks putih (5.9:1) | 3.4:1 (bukan untuk teks) |
| `--accent-soft` | `#7FA6FF` | Semua teks aksen kecil: label, tahun, link, peringkat | 8.4:1 / 8.0:1 |
| `--text` | `#EEF2F8` | Teks utama | 17.9:1 / 17.1:1 |
| `--muted` | `#8A94A8` | Teks sekunder | 6.6:1 / 6.3:1 |
| `--focus` | `#7FA6FF` | Outline fokus keyboard (2px + offset 3px) | n/a |

- **Gradien kata raksasa:** `linear-gradient(180deg, #1A4FC4 0%, #123C8F 45%, #0A1D4A 80%, transparent 100%)`, dengan efek glow biru tipis di belakang foto.
- **Tekstur:** grain/noise halus 3% di atas `--bg`, seperti referensi (SVG feTurbulence statis, tanpa gambar).
- **Aturan kontras:** `--accent` hanya untuk elemen besar (≥ 24px atau tebal ≥ 19px) dan latar tombol dengan teks putih besar; teks kecil berwarna aksen selalu memakai `--accent-soft`. Angka kontras di atas sudah dihitung (WCAG).
- Aksen dipakai hemat (±5% area layar). Selain biru, tidak ada warna lain kecuali logo mitra.

### 5.3 Tipografi
| Peran | Font | Ukuran (mobile → desktop) | Catatan |
|---|---|---|---|
| Kata raksasa hero | Anton | `clamp(120px, 24vw, 340px)` | uppercase, line-height 0.8 |
| Nama hero | Anton | `clamp(56px, 8vw, 104px)` | letter-spacing −2% |
| Judul seksi (H2) | Anton | `clamp(40px, 5.5vw, 76px)` | uppercase, titik aksen |
| Subjudul (H3) | Manrope 700 | 20 → 24px | |
| Body | Manrope 400 | 16px / 1.65 | artikel 18px / 1.8 |
| Label / eyebrow | Manrope 600 | 11–12px | uppercase, letter-spacing 0.12em |
| Angka statistik | Anton | `clamp(48px, 6vw, 84px)` | "+" kecil berwarna aksen |
| Aksen tangan | Caveat 500 | 28 → 44px | "Hello, I'm", tanda tangan |

- Font di-**self-host** (woff2, subset Latin, `font-display: swap`). Total ±120 KB. Lisensi ketiganya OFL (aman).
- Anton hanya untuk judul pendek. Paragraf selalu Manrope.

### 5.4 Layout & Spacing
- Container 1240px, padding sisi 16px (mobile) / 40px (desktop), grid 12 kolom gap 24px.
- Jarak antar seksi `clamp(96px, 12vw, 160px)`. Header seksi: label → judul → tautan kanan (pola referensi).
- Radius kecil (0–4px) agar tegas. Kartu dan tombol bersudut hampir siku seperti referensi.
- Breakpoint: 480 / 768 / 1024 / 1280.

### 5.5 Komponen
| Komponen | Spesifikasi singkat |
|---|---|
| `Nav` | Sticky, latar blur `rgba(5,7,11,.7)`, border bawah 1px. Wordmark kiri, menu tengah (titik aktif), kanan: toggle Motion + "Let's talk ↗". Mobile: tombol menu → overlay layar penuh, link besar Anton |
| `SectionHeader` | Label `NN / NAMA` + judul Anton + tautan opsional di kanan |
| `Button` | Primary: latar `--accent`, teks putih, ikon panah. Ghost: border `--line`, teks `--text`. Link: teks + ↗ |
| `StatItem` | Angka Anton + "+" aksen + label 2 baris kecil, dipisah garis horizontal |
| `WorkCard` | Gambar 16:10 + tag kiri atas (mis. `MOBILE APP`) + nomor besar aksen + judul + meta + ↗ |
| `FilterTabs` | Tab teks dengan garis bawah aksen yang bergeser |
| `LogoMarquee` | Dua baris berlawanan arah (mitra & partner), logo grayscale 60% → warna saat hover |
| `AwardRow` | Nomor kecil · judul + penyelenggara · peringkat besar Anton di kanan |
| `BeforeAfter` | Dua gambar bertumpuk + pegangan bulat aksen, bisa drag, panah keyboard, dan swipe |
| `Accordion` | Baris timeline: periode kiri, peran + organisasi, ikon +/− kanan |
| `QuoteCard` | Panel `--navy-900` + gradien, tanda kutip besar, teks besar, tanda tangan Caveat |
| `ContactRow` | Ikon lingkaran + label kecil + nilai + ↗ |
| `Tag/Chip` | Border 1px, uppercase 11px |
| `Badge ✳` | Asterisk dalam lingkaran, berputar pelan |

### 5.6 Ikon & Gambar
- Ikon garis 1.5px (set kecil inline SVG, ±20 ikon), warna mengikuti teks.
- **Foto potret:** cutout di depan kata raksasa, dengan glow biru di belakang dan gradien hitam di bagian bawah agar menyatu dengan latar.
- **Mockup produk:** dari company profile. Latar mockup diberi duotone navy agar seragam di tema gelap.
- **Foto dokumentasi:** desaturasi 30% + overlay navy 20%, kembali normal saat hover.

---

## 6. Micro-animation

**Token gerak**
- Easing: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`
- Durasi: cepat 150ms (hover), sedang 300ms (UI), lambat 700–900ms (reveal/intro)

| ID | Animasi | Pemicu | Detail | Saat Motion off / reduced-motion |
|---|---|---|---|---|
| A1 | Intro hero | Load halaman | Kata raksasa naik dari mask (900ms), nama per huruf stagger 30ms, foto fade + scale 1.04→1 (1s), statistik muncul berurutan | Tampil langsung |
| A2 | Scroll reveal | Elemen masuk viewport (IntersectionObserver, threshold 0.15) | Opacity 0→1 + translateY 16px→0 (700ms), stagger 60ms untuk list | Tampil langsung |
| A3 | Count-up | Angka terlihat pertama kali | 0 → nilai dalam 1.2s, easing out | Angka final langsung |
| A4 | Marquee logo | Selalu | Gerak 40s/putaran, baris 2 berlawanan arah, pause saat hover/focus | Diam (bisa digeser manual) |
| A5 | Progress bar | Scroll | Garis 2px `--accent` di atas viewport (`transform: scaleX`) | Tetap (bukan gerak dekoratif) |
| A6 | Scrollspy | Seksi aktif berubah | Titik aksen pindah ke menu aktif (300ms) | Tanpa transisi |
| A7 | Hover kartu karya | Hover/focus | Gambar scale 1.05 (500ms), ↗ geser (3px,−3px), nomor → aksen | Hanya warna |
| A8 | Underline link | Hover/focus | Garis tumbuh dari kiri (`scaleX` 0→1, 300ms) | Garis langsung |
| A9 | Tombol magnetik | Kursor dekat tombol (desktop, pointer: fine) | Tombol mengikuti kursor maks 6px | Nonaktif |
| A10 | Badge ✳ berputar | Selalu | 360° per 20s | Diam |
| A11 | Before/after | Drag/swipe/panah | Pegangan mengikuti input, label Before/After fade | Tetap berfungsi |
| A12 | Accordion | Klik/Enter | Tinggi via `grid-template-rows 0fr→1fr` + opacity (300ms), + berputar 45° | Tanpa transisi |
| A13 | Parallax foto | Scroll (desktop) | Foto bergeser maks 24px | Nonaktif |
| A14 | Toggle Motion | Klik "Motion on/off" | Simpan di `localStorage`, set `data-motion="off"` di `<html>`. Default off bila `prefers-reduced-motion` | n/a |
| A15 | Menu mobile | Buka menu | Overlay fade, link naik stagger 50ms | Langsung |
| A16 | Filter karya | Ganti tab | Kartu keluar fade 150ms → masuk stagger | Langsung |

**Aturan teknis**
- Hanya `transform` & `opacity`. Tanpa animasi properti layout.
- **Progressive enhancement:** konten tetap terlihat tanpa JS. Kelas `.reveal` hanya menyembunyikan elemen bila `<html class="js">` dan motion on.
- Satu modul `src/scripts/motion.ts` (target < 8 KB min+gzip), tanpa GSAP atau library lain.
- Tidak ada animasi yang berkedip > 3x per detik.

---

## 7. Arsitektur Informasi
```
/                 Beranda (one-page, anchor: #karya #pencapaian #tentang #perjalanan #artikel #kontak)
/proyek           Studi kasus SIDIGS lengkap
/tentang          Cerita lengkap + perjalanan + pendidikan + topik bicara
/artikel          Indeks artikel (filter, cari)
/artikel/[slug]   Detail artikel
/kontak           Form kontak + info kontak
/admin            CMS (noindex)
/design-system    Referensi komponen (noindex)
404
```
**Menu utama:** Karya · Pencapaian · Tentang · Perjalanan · Artikel · Kontak. Di beranda, menu menjadi anchor; di halaman lain, menu menuju `/#anchor`.
**CTA global:** "Let's talk ↗" → `/kontak`.

---

## 8. Spesifikasi Beranda per Seksi
Copy di bawah adalah **draft final** yang bisa langsung dipakai. Semua bisa diubah lewat admin (§11).

### S0. Navigasi
- Kiri: **TRANSBARA.** (Anton 22px, titik `--accent`)
- Tengah: Karya · Pencapaian · Tentang · Perjalanan · Artikel · Kontak
- Kanan: `▮▮ Motion on` · `Let's talk ↗`
- **Selesai bila:** sticky, scrollspy berjalan, menu mobile bisa dibuka/ditutup dengan keyboard (Esc), dan fokus terkunci di overlay.

### S1. Hero
| Elemen | Copy |
|---|---|
| Eyebrow kiri | `FOUNDER & CEO / SIDIGS` (aksen) · `EDUTECH ENTREPRENEUR` |
| Eyebrow kanan | `● TERBUKA UNTUK KOLABORASI & SPEAKING` (titik berdenyut) |
| Kata raksasa | **FOUNDER** |
| Sapaan | *Hello, I'm* (Caveat) |
| Nama | **TRANSBARA.** |
| Peran | **FOUNDER & CEO SIDIGS** (aksen) |
| Tagline | Membantu sekolah bekerja lebih rapi lewat teknologi yang sederhana dan benar-benar dipakai. |
| Tombol | `Lihat karya saya ↓` → `#karya` |
| Lokasi | 📍 MALANG, INDONESIA |
| Badge | ✳ *Sekolah.* / *Jadi mudah.* |
| Statistik | **100+** Sekolah mitra di Indonesia · **15** Produk dalam ekosistem SIDIGS · **5** Penghargaan & Top 10 startup |
| Tautan statistik | `⬇ DOWNLOAD CV` (PDF LinkedIn) |
| Bar bawah | `▶ COMPANY PROFILE SIDIGS` (buka PDF) · `SCROLL TO DISCOVER ↓` · `SELECTED WORK / 2020–2026` |

- **Desktop:** 3 kolom (teks kiri · foto tengah di depan kata raksasa · statistik kanan).
- **Mobile:** kata raksasa di belakang foto (lebih kecil), lalu nama, tagline, tombol, dan statistik sebagai baris 3 kolom.
- **Selesai bila:** LCP (foto) < 2,5 dtk di 4G, teks terbaca di atas foto (kontras ≥ 4.5:1), A1/A3/A10/A13 berjalan.

### S2. 01 / Karya
| Elemen | Copy |
|---|---|
| Label | `01 / KARYA` |
| Judul | **KARYA YANG BICARA.** |
| Tautan kanan | `STUDI KASUS SIDIGS →` (/proyek) |
| Tab | Semua · Aplikasi Mobile · Web Platform · Modul Tambahan |

**Daftar karya (produk SIDIGS).** Deskripsi masih draft; mohon cek kesesuaian fiturnya.
| No | Produk | Tag | Deskripsi singkat |
|---|---|---|---|
| 01 | Aplikasi Murid | MOBILE APP | Jadwal, materi, tugas, nilai, dan pengumuman dalam satu genggaman |
| 02 | Aplikasi Wali Murid | MOBILE APP | Pantau presensi, nilai, tagihan, dan perkembangan anak secara real-time |
| 03 | Aplikasi Guru | MOBILE APP | Jadwal mengajar, presensi, penilaian, dan poin tata tertib siswa |
| 04 | Aplikasi CBT | MOBILE & WEB | Ujian berbasis komputer/HP yang aman, terjadwal, dan terkoreksi otomatis |
| 05 | School Management System | WEB PLATFORM | Pusat kendali administrasi, data, keuangan, dan presensi sekolah |
| 06 | Learning Management System | WEB PLATFORM | Kelas digital: materi, kuis, dan ujian terpusat |
| 07–15 | Yayasan · HRD · BK · Klinik · Sarpra · Perpustakaan · Kantin · Laundry · Pesantren | MODUL TAMBAHAN | Ditampilkan sebagai grid ikon ringkas (bukan kartu besar) |

Default tab "Semua" menampilkan 6 produk utama (3×2), lalu baris grid ikon 9 modul tambahan.

**Sub-seksi logo**
- Kiri: `DIPERCAYA OLEH` / **100+ SEKOLAH & 13 PARTNER.**
- Kanan: `LIHAT SEMUA MITRA (43) +` membuka panel grid semua logo.
- Marquee 1: logo sekolah mitra (30). Marquee 2: partner (Syabab Studio, Next Edu, ZKTeco, FIVO Studio, Winpay, Dea Artvertising, Bank Muamalat, BSI, BCA, BNI, DSG, Smartlink, OPG).
- **Selesai bila:** filter bekerja tanpa reload, kartu bisa diakses keyboard, dan marquee berhenti saat hover/focus.

### S3. Pencapaian
| Elemen | Copy |
|---|---|
| Label | `PENCAPAIAN & PENGAKUAN` |
| Judul | **THE WORK.** / **THE RECOGNITION.** (baris 2 berwarna aksen) |
| Angka | **5** dengan ornamen daun laurel, label `PENGHARGAAN STARTUP` |
| Teks | Penghargaan bukan tujuan. Tapi tanda bahwa sekolah-sekolah merasakan manfaatnya. |
| Tautan | `SERTIFIKAT DI LINKEDIN ↗` |

| No | Judul | Penyelenggara | Kolom kanan |
|---|---|---|---|
| 01 | 1st Winner | Indigo Betalist | **1ST** |
| 02 | Top 10 Startup | Hetero for Startup | **TOP 10** |
| 03 | Top 10 Startup | Techibition | **TOP 10** |
| 04 | Top 10 Startup | F+ | **TOP 10** |
| 05 | Top 10 Startup | Hatch by 1000 Startup Digital | **TOP 10** |

Kolom tahun disiapkan di admin. Bila diisi, tahun tampil kecil di bawah peringkat.

### S4. Dari Manual ke Digital
| Elemen | Copy |
|---|---|
| Label | `SEBELUM & SESUDAH` |
| Judul | **DARI MANUAL.** / **KE DIGITAL.** |
| Teks | Satu sekolah. Dua cara kerja. Geser untuk melihat bedanya. |
| Slider | Kiri `MANUAL`: kantor penuh kertas (dari company profile hal. 3). Kanan `SIDIGS`: dashboard SMS & aplikasi |
| Petunjuk | `GESER UNTUK MEMBANDINGKAN` · `DRAG / SWIPE` |

**Tantangan → solusi** (6 baris, 2 kolom):
| Tantangan sekolah | Dengan SIDIGS |
|---|---|
| Anggaran habis untuk kertas & printer | Administrasi tanpa kertas |
| Data akademik berantakan, sulit dirangkum | Data terpusat & rapi |
| Proses manual menyita waktu guru & staf | Alur kerja otomatis |
| Data keputusan tidak real-time | Dashboard pimpinan real-time |
| Banyak aplikasi terpisah | Satu ekosistem terintegrasi |
| Komunikasi dengan wali murid terhambat | Aplikasi wali murid & notifikasi |

### S5. 02 / Tentang
| Elemen | Copy |
|---|---|
| Label | `02 / TENTANG` |
| Judul | **BUKAN SEKADAR APLIKASI.** / **TAPI CARA MEMUDAHKAN SEKOLAH.** (kata terakhir aksen) |
| Paragraf kanan | Saya Transbara, Founder & CEO SIDIGS dari Malang. Sebelum membangun startup, saya adalah kepala sekolah, dan dari ruang itulah saya belajar bahwa transformasi digital tidak dimulai dari teknologi, tetapi dari memahami proses yang ingin diperbaiki. |

**Kolom 1: Pendidikan & Keahlian**
- Universitas Bina Nusantara: Sistem Informasi Manajemen (2016–2020)
- Mahad Cordoba: Bahasa & Sastra Arab (2018–2019)
- Telkom Schools Malang: Teknik Komputer & Jaringan (2012–2015)
- Keahlian (chip): Startup Development · Full-Stack Development · School Management · Digital Marketing · Brand Strategy · Public Speaking
- Bahasa: Indonesia · English · العربية
- Sertifikasi: Indigo Betalist 1st Winner · Business Mentor Wira Cipta · PHP Laravel Engineer

**Kolom 2: Cara Saya Bekerja** (timeline vertikal bernomor)
| No | Langkah | Teks |
|---|---|---|
| 01 | MEMAHAMI PROSES | Mendengar sekolah dulu: alur kerja, kendala, dan orang-orangnya. |
| 02 | MERANCANG SISTEM | Menyusun alur digital yang sederhana dan sesuai kebutuhan, bukan sekadar menambah fitur. |
| 03 | MEMBANGUN | Mengembangkan produk yang saling terhubung dalam satu ekosistem. |
| 04 | MENDAMPINGI | Pelatihan dan pendampingan di lapangan sampai guru dan staf benar-benar terbiasa. |
| 05 | BERTUMBUH BERSAMA | Evaluasi rutin, perbaikan berkelanjutan, dan dampak yang terukur. |

**Kolom 3: Kartu kutipan** (`--navy-900`)
> "Keberhasilan digitalisasi bukan diukur dari banyaknya fitur, tetapi dari seberapa besar teknologi membantu guru bekerja lebih efektif."

Tanda tangan *Transbara* (Caveat). Bawah kartu: `LET'S MAKE SCHOOLS SIMPLER. ✳`

### S6. 03 / Perjalanan
| Elemen | Copy |
|---|---|
| Label | `03 / PERJALANAN` |
| Judul | **TERUS BERTUMBUH. TERUS BERDAMPAK.** |
| Tautan | `RESUME ⬇` (PDF LinkedIn) |

**Timeline (accordion, item pertama terbuka)**
| Periode | Peran | Organisasi | Deskripsi (saat dibuka) |
|---|---|---|---|
| 2020 · SEKARANG | Founder & CEO | SIDIGS | Membangun ekosistem aplikasi sekolah terintegrasi yang kini dipakai 100+ sekolah, dari administrasi, pembelajaran, hingga tata kelola. |
| 2019 · SEKARANG | Managing Director | CV. Pendekar Pendidikan Digital | Badan usaha di balik SIDIGS: strategi, kemitraan, dan operasional. |
| 2022 – 2025 | Founder | Syabab Studio | Studio kreatif dan digital, kini menjadi partner ekosistem SIDIGS. |
| 2023 | Curriculum Director | Averroes Digital Islamic School | Merancang kurikulum sekolah Islam berbasis digital. |
| 2017 – 2019 | Kepala Sekolah | Khalifah Islamic Boarding School | Memimpin sekolah dan melihat langsung beban administrasi yang menjadi alasan lahirnya SIDIGS. Sebelumnya Entrepreneur Teacher (2016–2017). |
| 2014 – 2020 | Digital Marketing & Brand | Berbagai brand & perusahaan | Strategi digital, media sosial, dan pengembangan brand untuk berbagai bisnis. |

**Kolom kanan:** `PRESTASI SEKOLAH MITRA` / **SEKOLAH MITRA. PRESTASI NYATA.**
| No | Prestasi | Siapa |
|---|---|---|
| 01 | Top 10 World's Best School Prize 2024, Aksi Lingkungan | Sekolah Alam Pacitan |
| 02 | Southeast Asian Waste Hero Awards 2023 | Sekolah Alam Pacitan |
| 03 | Digital Transformation Radar Madiun Education Award 2025 | Sekolah Alam Pacitan |
| 04 | Special Prize SEAMEO-Japan ESD Award 2022 | Sekolah Alam Pacitan |
| 05 | Juara 1 Inotek Website & Aplikasi, Kota Malang | SMP Negeri 16 Malang |
| 06 | Juara 1 Jambore GTK Hebat 2024, Provinsi | Mastini, M.Pd. |

Catatan: di company profile tertulis "SEAMEO - Japan **EDS** Award". Nama resmi penghargaannya kemungkinan **ESD** (Education for Sustainable Development), mohon dikonfirmasi.

### S7. Artikel
| Elemen | Copy |
|---|---|
| Label | `PIKIRAN YANG SAYA BAGIKAN` |
| Judul | **CATATAN DARI LAPANGAN.** |
| Tautan | `SEMUA ARTIKEL →` |

- 3 artikel terbaru dengan `is_sample = false`. **Seksi disembunyikan bila belum ada artikel asli.**

### S8. 04 / Kontak
| Elemen | Copy |
|---|---|
| Label | `04 / KONTAK` |
| Judul | **LET'S WORK** / **TOGETHER.** |
| Teks | Punya sekolah yang ingin bertransformasi, acara yang butuh pembicara, atau ide kolaborasi? Mari ngobrol. |
| Tombol | `MULAI PERCAKAPAN ↗` |
| Baris kontak | EMAIL transbarawahyu@gmail.com · INSTAGRAM @transbara.alfatih · LINKEDIN transbara-wahyu-firmansyah · BASED IN Malang, Indonesia |
| Kartu kanan (miring 4°) | **SIDIGS.** / **SEKOLAH JADI MUDAH.** · `KUNJUNGI SIDIGS.COM ↗` |
| Accordion | `Ceritakan kebutuhan Anda +` → form: Nama, Email, Keperluan (Undangan berbicara / Digitalisasi sekolah / Kolaborasi / Lainnya), Pesan → tabel `contact_messages` |

### S9. Footer
**TRANSBARA.** · `© 2026 TRANSBARA WAHYU FIRMANSYAH. MEMBANGUN DENGAN MAKNA.` · ikon Instagram, LinkedIn · `KEMBALI KE ATAS ↑`

---

## 9. Halaman Lain
| Halaman | Isi | Catatan |
|---|---|---|
| `/proyek` | Studi kasus SIDIGS: hero (logo + tagline), masalah (S4), ekosistem lengkap 15 produk, nilai utama (4 efisiensi), mitra & partner (grid penuh), penghargaan, prestasi mitra, galeri dokumentasi (12 foto), CTA demo ke sidigs.com | Data dari tabel `projects` + seksi admin |
| `/tentang` | Versi panjang: cerita (kepala sekolah → founder), nilai (4 nilai lama tetap dipakai), perjalanan lengkap, pendidikan, **topik bicara** (data `speaking_topics`), CTA undang bicara | Semua placeholder "Isi cerita asli" diganti |
| `/artikel` | Header seksi gelap, filter tab gaya referensi, kartu artikel gelap | Fitur filter/cari/muat lebih tetap |
| `/artikel/[slug]` | Tipografi baca nyaman di tema gelap: 18px, line-height 1.8, kolom 720px, teks `#D9DFEA` | Daftar isi sticky, share, terkait tetap |
| `/kontak` | Judul besar + baris kontak + form penuh. Query `?keperluan=` tetap didukung | |
| 404 | **HALAMAN INI BELUM DIBUAT.** + tombol ke beranda | |
| `/design-system` | Diperbarui dengan semua token & komponen baru | noindex |

---

## 10. Konten & Aset
| Aset | Status | Sumber / tindakan |
|---|---|---|
| Foto hero cutout | ✅ Siap | `docs/assets/transbara-wahyu-cutout.webp` (996×1736, 287 KB). Dibuat versi responsif 480/768/1200 |
| Mockup produk (6 utama) | ⚠️ Cadangan | Dipotong dari company profile hal. 7–8. Lebih baik bila ada screenshot asli resolusi tinggi |
| Ikon 9 modul tambahan | ⚠️ Cadangan | Dari company profile hal. 9 |
| Logo 30 sekolah mitra + 13 partner | ⚠️ Cadangan | Dipotong dari hal. 11–12 (kualitas sedang). Lebih baik bila ada file asli PNG/SVG |
| Gambar "manual vs digital" | ⚠️ Cadangan | Company profile hal. 3 + mockup dashboard |
| Foto dokumentasi (12) | ⚠️ Cadangan | Company profile hal. 16–18 |
| PDF company profile | ✅ Ada | Dikompres dari 5,4 MB ke ±2 MB → `public/files/company-profile-sidigs.pdf` |
| CV | ✅ Sementara | PDF LinkedIn → `public/files/cv-transbara-wahyu.pdf` (**nomor HP pribadi dihapus dulu** dari PDF, atau pakai versi tanpa halaman kontak) |
| Gambar OG (1200×630) | ❌ Dibuat | Desain gelap: nama + jabatan + foto |
| Favicon | ❌ Dibuat | "T." putih dengan titik biru di latar hitam |
| Font Anton, Manrope, Caveat | ❌ Diunduh | Self-host woff2 di `public/fonts/` |

**Pemotongan dari company profile:** gambar halaman diekstrak dalam resolusi asli PDF. Logo kecil hasilnya ±120px, cukup untuk marquee (tinggi 40px). Untuk kualitas terbaik tetap disarankan file logo asli.

---

## 11. Data & Admin

### 11.1 Strategi
Editor "Halaman Beranda" di admin sudah dibangun dari skema `SECTIONS` (`src/lib/content.ts`) dan mendukung field `text`, `textarea`, `url`, `image`, `number`, `strings`, serta `list` (termasuk gambar di dalam list). Karena itu:
- **Seksi beranda baru cukup ditambahkan di `SECTIONS`.** Admin otomatis bisa mengeditnya, dan data tersimpan di `site_settings`.
- **Tidak ada tabel baru.** Satu migrasi kecil hanya menambah kolom di `projects`.
- `DEFAULTS` di `content.ts` diisi copy dari §8, sehingga situs langsung tampil benar meski admin belum mengisi apa pun.

### 11.2 Skema seksi (`site_settings`)
| Key | Field | Ganti / baru |
|---|---|---|
| `header` | wordmark, cta_label, cta_href | ubah |
| `hero` | eyebrow_1, eyebrow_2, availability, big_word, greeting, name, role, tagline, cta_label, location, badge_1, badge_2, portrait (image), **stats** (list: value, suffix, label), cv_url, profile_pdf_url | ubah |
| `work` | label, title, link_label, filters (strings) | baru |
| `logos` | title_1, title_2, **items** (list: name, image, type `mitra`/`partner`, url) | baru |
| `awards` | label, title_1, title_2, counter, counter_label, text, link_label, link_url, **items** (list: title, organizer, rank, year) | baru |
| `transform` | label, title_1, title_2, text, before_image, after_image, before_label, after_label, **challenges** (list: problem, solution) | baru |
| `about` | label, title_1, title_2, text, **education** (list: school, program, years), skills (strings), languages (strings), certifications (strings), **steps** (list: title, text), quote, signature | ubah |
| `journey` | label, title, resume_url, **items** (list: period, role, org, text), milestones_label, milestones_title, **milestones** (list: title, who) | ubah |
| `articles` | label, title, link_label | ubah |
| `cta` → kontak | label, title_1, title_2, text, button_label, card_title, card_subtitle, card_url | ubah |
| `footer` | copyright, tagline | ubah |
| `focus`, `topics` (beranda) | n/a | **dipensiunkan dari beranda**. Data `speaking_topics` tetap dipakai di /tentang |
| `contact`, `social`, `site` | isi email, Instagram, LinkedIn, tagline baru | diisi |

### 11.3 Migrasi `projects`
File baru `supabase/migrations/20261103000000_projects_portfolio.sql`, idempotent seperti migrasi lama:
```sql
alter table public.projects
  add column if not exists category  text,            -- 'mobile' | 'web' | 'addon' | 'company'
  add column if not exists tag_label text,            -- mis. 'MOBILE APP'
  add column if not exists cover_url text,            -- mockup
  add column if not exists year_label text,           -- mis. '2020–2026'
  add column if not exists parent_slug text;          -- produk milik SIDIGS
```
- Seed 15 produk + 1 proyek induk "SIDIGS" (`on conflict (slug) do nothing`).
- Modul admin **Proyek** ditambah field kategori, tag, cover, dan tahun.
- **Dijalankan manual oleh kamu** di SQL Editor Supabase (sesuai `SUPABASE_SETUP.md`). Saya siapkan file dan langkahnya.

### 11.4 Pengaturan yang diisi
- `contact.email` = transbarawahyu@gmail.com
- `social.instagram` = https://www.instagram.com/transbara.alfatih/
- `social.linkedin` = https://www.linkedin.com/in/transbara-wahyu-firmansyah
- `site.tagline` = "Founder & CEO SIDIGS"
- `site.description` = "Transbara Wahyu Firmansyah, Founder & CEO SIDIGS. Membantu 100+ sekolah bekerja lebih rapi lewat ekosistem digital terintegrasi." (±150 karakter)
- YouTube, X, Threads dikosongkan. **Ikon untuk akun yang kosong disembunyikan**, tidak lagi ditulis "belum diatur".

---

## 12. SEO & Metadata
| Halaman | Title | Description |
|---|---|---|
| `/` | Transbara Wahyu: Founder & CEO SIDIGS | (site.description) |
| `/proyek` | SIDIGS: Ekosistem Digital Sekolah · Transbara Wahyu | 15 produk, 100+ sekolah mitra, dari administrasi hingga pembelajaran. |
| `/tentang` | Tentang Transbara Wahyu: Dari Kepala Sekolah ke Founder Edutech | … |
| `/artikel` | Artikel · Transbara Wahyu | Catatan tentang transformasi digital sekolah, kepemimpinan, dan membangun startup. |
| `/kontak` | Kontak & Undangan Berbicara · Transbara Wahyu | … |

- **JSON-LD `Person`:** name, jobTitle "Founder & CEO", worksFor SIDIGS, alumniOf Universitas Bina Nusantara, address Malang ID, knowsLanguage [id, en, ar], sameAs [LinkedIn, Instagram].
- **JSON-LD `Organization`** (SIDIGS): url sidigs.com, slogan "Sekolah Jadi Mudah", founder → Person.
- **Open Graph:** gambar 1200×630 baru, `og:type=profile` di beranda.
- **Sitemap:** endpoint `/sitemap.xml` sederhana (halaman statis + artikel terbit), tanpa dependensi baru.
- `robots.txt` tetap (Disallow /admin) + tautan sitemap.

---

## 13. Persyaratan Non-Fungsional
| Area | Target |
|---|---|
| Performa | LCP < 2,5 dtk (4G), CLS < 0,1, INP < 200ms. JS publik < 30 KB gzip (tanpa admin). CSS < 50 KB gzip. Font 3 file woff2 ±120 KB |
| Gambar | WebP/AVIF, `srcset` responsif, `loading="lazy"` kecuali foto hero (`fetchpriority="high"`) |
| Aksesibilitas | WCAG 2.2 AA: kontras, fokus terlihat, navigasi keyboard penuh (tab filter, accordion, slider, menu), `aria-*` benar, skip link, alt text semua gambar, motion bisa dimatikan |
| Browser | Chrome, Safari (iOS 16+), Firefox, Edge: 2 versi terakhir. Samsung Internet |
| Responsif | 360px sampai 1920px, tanpa scroll horizontal |
| Keamanan | Header keamanan Nginx tetap, tidak ada secret di client, form kontak tetap lewat RLS insert-only |
| Privasi | Tanpa tracker pihak ketiga. Nomor HP pribadi tidak dipublikasikan |

---

## 14. Rencana Teknis
- **Branch:** `redesign-2026`, digabung ke `main` setelah Fase 5 disetujui.
- **Gaya:** SCSS baru `src/styles/v2/` (tokens, base, components, sections). **Argon dilepas dari halaman publik**; diperiksa dulu apakah admin masih bergantung pada Argon (admin punya `admin.css` sendiri).
- **Komponen baru** di `src/components/v2/`: Nav, SectionHeader, Button, StatItem, WorkCard, FilterTabs, LogoMarquee, AwardRow, BeforeAfter, Accordion, QuoteCard, ContactRow, Badge, Footer.
- **Script:** `src/scripts/motion.ts` (A1–A16), `src/scripts/filters.ts`, `src/scripts/before-after.ts`. Semua vanilla TypeScript, dimuat `type="module"` dan `defer`.
- **Data:** `src/lib/content.ts` (SECTIONS + DEFAULTS baru), `src/lib/data.ts` (query projects dengan kolom baru).
- **Aset:** `public/images/v2/`, `public/fonts/`, `public/files/`.
- Komponen lama dihapus setelah semua halaman dipindah (Fase 4), bukan sebelumnya.

---

## 15. Rencana Fase
| Fase | Pekerjaan | Hasil yang direview | Butuh dari kamu |
|---|---|---|---|
| **1. Fondasi** | Branch, token, font, komponen dasar, Nav + Footer, toggle Motion, `/design-system` v2, aset (cutout responsif, logo, mockup) | `/design-system` gelap di localhost | Izin membuka folder `public/images/` |
| **2. Beranda** | S0–S9 lengkap dengan DEFAULTS dari §8, animasi A1–A16 | Beranda lengkap di localhost (desktop + HP) | Review copy & tampilan |
| **3. Data & Admin** | SECTIONS baru, migrasi projects + seed, field admin Proyek, isi kontak & sosmed | Edit beranda dari `/admin` | Jalankan migrasi di SQL Editor Supabase |
| **4. Halaman lain** | /proyek, /tentang, /artikel, /artikel/[slug], /kontak, 404, SEO, sitemap, OG | Seluruh situs konsisten | Review |
| **5. QA & rilis** | Uji §16, perbaikan, merge, deploy (§17) | transbara.my.id versi baru | Persetujuan deploy |

Setiap fase berakhir di localhost untuk dicek manual. Fase berikutnya baru jalan setelah kamu oke.

---

## 16. Rencana Pengujian
| Jenis | Cakupan |
|---|---|
| Visual | iPhone (Safari) 390px, Android (Chrome) 360/412px, iPad 768px, laptop 1280/1440px, monitor 1920px |
| Fungsional | Filter karya, marquee, slider (mouse/touch/keyboard), accordion, menu mobile, toggle Motion (tersimpan setelah reload), count-up, form kontak (sukses & gagal), tautan PDF |
| Aksesibilitas | Navigasi keyboard penuh, audit axe/Lighthouse, `prefers-reduced-motion`, zoom 200% |
| Tanpa JS | Semua konten terlihat, menu tetap bisa dipakai (fallback `<details>`) |
| Performa | Lighthouse mobile 3x rata-rata, WebPageTest 4G |
| Regresi admin | Login, edit Halaman Beranda (seksi baru), Artikel CRUD, Proyek, Media upload, Pesan Masuk |
| SEO | Validator JSON-LD, pratinjau OG (LinkedIn/WhatsApp), sitemap valid |

---

## 17. Deploy & Rollback
1. `git pull` di server → `npm ci` → `npm run build` → `pm2 reload transbara-web`.
2. Sebelum deploy: simpan `dist/` lama sebagai `dist.bak-YYYYMMDD` dan beri tag git `pre-redesign`.
3. **Rollback:** `git checkout pre-redesign && npm run build && pm2 reload transbara-web` (±2 menit). Migrasi DB hanya menambah kolom, jadi aman untuk versi lama.
4. Nginx tidak perlu diubah (proxy ke port 4321 tetap). Situs lain di server tidak tersentuh.
5. Setelah deploy: cek semua halaman, form kontak, admin, dan header keamanan.

---

## 18. Risiko & Mitigasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Logo/mockup dari PDF buram | Kesan kurang profesional | Pakai ukuran kecil, grayscale. Minta file asli ke tim SIDIGS |
| Klaim angka/penghargaan kurang akurat | Kredibilitas | Semua angka dari company profile & LinkedIn. Nama penghargaan dikonfirmasi (lihat catatan ESD) |
| Tema gelap melelahkan untuk artikel panjang | Keterbacaan | Teks artikel `#D9DFEA`, 18px, kolom sempit, kontras terukur |
| Animasi berlebihan / motion sickness | Aksesibilitas | Semua animasi bisa dimatikan; default off bila reduced-motion |
| Melepas Argon merusak admin | Admin rusak | Audit dependensi admin di Fase 1; regresi admin di Fase 5 |
| Folder `public/images/` read-only | Aset tidak bisa ditambah | Minta izin di Fase 1, atau pakai `public/images/v2/` |
| Logo sekolah mitra dipublikasikan | Izin | Logo sudah dipakai di company profile publik. Bila ada mitra yang keberatan, hapus dari admin |
| Nomor HP pribadi di PDF LinkedIn | Privasi | CV disanitasi sebelum diunggah |

---

## 19. Pertanyaan yang Masih Terbuka
| # | Pertanyaan | Rekomendasi saya |
|---|---|---|
| Q1 | ✅ **Selesai (2026-11-02):** izin `src/` dan `public/images/` dibuka (`chmod u+w`) atas persetujuan pemilik. Aset baru ada di `public/v2/` dan `public/fonts/` | n/a |
| Q2 | Tampilkan **WhatsApp** di kontak? Nomor pribadi atau SIDIGS (0821 3330 0195)? | Tidak dulu, cukup email + form |
| Q3 | **Newsletter** ditampilkan? | Sembunyikan sampai ada artikel asli |
| Q4 | Kata raksasa hero: **FOUNDER** / PORTFOLIO / TRANSBARA? | FOUNDER |
| Q5 | Nama penghargaan "SEAMEO-Japan **EDS** Award" di company profile: apakah seharusnya **ESD**? | Konfirmasi |
| Q6 | Deskripsi 15 produk di §8 S2 sudah sesuai fitur sebenarnya? | Review |
| Q7 | Ada file logo asli mitra/partner & screenshot produk resolusi tinggi? | Bila ada, kirim; bila tidak, pakai potongan PDF |
| Q8 | Label menu & judul: campuran Inggris (THE RECOGNITION, LET'S WORK TOGETHER) atau Indonesia penuh? | Campuran, seperti referensi |
| Q9 | Topik bicara apa saja yang mau ditampilkan di /tentang? | Digitalisasi sekolah · AI untuk guru · Dari sekolah ke startup · Bisnis yang bermakna (dari situs lama) |

---

## Lampiran A: Data Profil (LinkedIn)
**Headline:** Founder & CEO SIDIGS · Managing Director, CV. Pendekar Pendidikan Digital · Malang, Jawa Timur
**Ringkasan:** transformasi digital sekolah dimulai dari pemahaman proses, bukan teknologi. Keberhasilan digitalisasi diukur dari seberapa besar teknologi membantu guru, tendik, dan pimpinan sekolah bekerja lebih efektif.
**Keahlian utama:** Full-Stack Development · Startup Development · Startups
**Bahasa:** Indonesia · English · Arabic
**Sertifikasi:** Indigo Betalist 1st Winner · Business Mentor Wira Cipta · PHP Laravel Engineer

| Periode | Peran | Organisasi |
|---|---|---|
| Jun 2020 – sekarang | Founder & CEO | SIDIGS |
| Okt 2019 – sekarang | Managing Director | CV. Pendekar Pendidikan Digital |
| Jul 2022 – Des 2025 | Founder | syababstudio.id |
| Mar – Des 2023 | Curriculum Director | Averroes Digital Islamic School |
| Agu 2019 – Mei 2020 | Sales & Marketing Specialist | Indonesia Interactive Standard School |
| Agu 2017 – Mei 2019 | Headmaster | Khalifah Islamic Boarding School |
| Jun 2016 – Agu 2017 | Entrepreneur Teacher | Khalifah Islamic Boarding School |
| Jan 2014 – Feb 2020 | Digital Marketing Manager (self-employed) | n/a |
| Jan 2017 – Des 2018 | Marketing | Batu Flower Garden |
| Feb – Mei 2018 | Digital Marketing Intern | Illiyin Studio |
| Sep 2017 – Jan 2018 | Brand Development Manager | Ganto Minang Padang Pamudo |
| Jan 2016 – Des 2017 | Digital Marketing Manager | CV. Revolution Indonesia |
| Jun 2015 – Des 2016 | Network Engineer | PT. Sinergy Informasi Pratama |
| Jan 2015 – Jun 2016 | Social Media Specialist | CV. Uno Ice Cream Indonesia |

**Pendidikan:** Binus, BTech Management Information Systems (2016–2020) · Mahad Cordoba, Arabic Language & Literature (2018–2019) · Next Edu, Education Consultant / School Counseling (2018–2019) · Telkom Schools Malang, Computer Systems Networking (2012–2015)

## Lampiran B: Ringkasan Company Profile SIDIGS
- **Entitas:** CV. Pendekar Pendidikan Digital · www.sidigs.com · IG sidigs.id · YouTube Sidigs Indonesia · tagline **"Sekolah Jadi Mudah"**
- **Definisi:** aplikasi sekolah dengan sistem digital terintegrasi berbasis web & mobile untuk manajemen sekolah menyeluruh dalam satu ekosistem.
- **Produk utama (6):** Aplikasi Murid, Aplikasi Wali Murid, Aplikasi Guru, Aplikasi CBT, School Management System, Learning Management System
- **Produk tambahan (9):** Yayasan, HRD, BK, Klinik, Sarpra, Perpustakaan, Kantin, Laundry, Pesantren
- **Nilai utama:** Efisiensi Waktu · Efisiensi Tenaga · Efisiensi Biaya · Keamanan & Akses Data
- **Mitra:** 30 logo ditampilkan + "100+ mitra lainnya"
- **Partner (13):** Syabab Studio, Next Edu, ZKTeco, FIVO Studio, Winpay, Dea Artvertising, Bank Muamalat, BSI, BCA, BNI, DSG, Smartlink, OPG
- **Pencapaian SIDIGS:** 1st Winner Indigo Betalist · Top 10 Hetero for Startup · Top 10 Techibition · Top 10 F+ · Top 10 Hatch by 1000 Startup Digital
- **Pencapaian mitra:** Sekolah Alam Pacitan (4 penghargaan internasional/nasional), SMPN 16 Malang, Mastini M.Pd., Fardika Sihiyantoro S.Pd., Akmaliatus Saida S.Pd.
- **Dokumentasi:** 18 foto workshop & implementasi di sekolah

---

## Lampiran C: Revisi setelah review Fase 2 (2026-11-03)
| # | Revisi | Hasil |
|---|---|---|
| 1 | Foto hero diganti | `Transbara Porto.png` (cutout transparan 1121×1403) dipotong ke bbox, diekspor `public/v2/img/portrait-{480,768,881}.webp` |
| 2 | CTA nav | "Let's talk" → **"Undang Saya as Speaker"**. Di beranda membuka form kontak dengan keperluan "Undangan berbicara" terpilih; di halaman lain menuju `/?keperluan=undangan_berbicara#kontak`. Tautan nav penuh baru tampil mulai 1100px (di bawahnya menu burger) karena teks CTA lebih panjang |
| 3 | Video + Founder Story | Seksi baru `#founder-story` di atas "Dari manual ke digital": video YouTube `6JI1e3aJsaA` ("Kisah Alumni: SIDIGS", Gerakan Nasional 1000 Startup Digital) **tanpa autoplay**. Thumbnail disimpan lokal; YouTube (domain `youtube-nocookie.com`) baru dimuat setelah tombol putar ditekan. Berisi label Founder Story, 2 paragraf, dan 3 nilai (Amanah, Bermanfaat, Berdampak) |
| 4 | Tab Karya | Tab "Modul Tambahan" dihapus (9 ikon modul tetap tampil di tab "Semua"). Tab baru **"Proyek Lainnya"** diambil dari CMS > Proyek (tabel `projects`): Logo (`logo_url`), Nama, Peran (`role`), Deskripsi singkat (`summary`), tombol **Kunjungi** ke `url` (tab ini disembunyikan bila belum ada proyek terbit; proyek berstatus archived tidak tampil) |
| 5 | Retext hero | "Founder & CEO / SIDIGS" → **Founder & CEO SIDIGS**; "Edutech Entrepreneur" → **The Muslimpreneur** |

Catatan: di lokal (database tidak terhubung) tab Proyek Lainnya memakai 2 data contoh bertanda "Pratinjau lokal" yang hanya muncul di mode dev. Di produksi selalu data CMS asli.

### Revisi tambahan (2026-11-03, review kedua)
| # | Revisi | Hasil |
|---|---|---|
| 1 | Section "Sebelum & sesudah / Dari manual. Ke digital." dihapus | Section, slider, 6 tantangan, gambar, komponen, dan kodenya dibuang. Urutan beranda kini: Karya, Pencapaian, Founder Story, Tentang, Perjalanan, (Artikel), Kontak. Mengganti S4 pada §8 |
| 2 | Paragraf "Dari keresahan itulah SIDIGS lahir…" dihapus | Founder Story hanya berisi paragraf "Sebagai seorang Muslim…" dan nilai Amanah / Bermanfaat / Berdampak |
| 3 | Judul Tentang | "Bukan Jualan Fitur Tapi Servis Excellent." (ditulis "Excellent"; di brief tertulis "Exelent", diasumsikan salah ketik) |
| 4 | Pola Founder Story | Memakai `SectionHeader` seperti section lain: label "Kisah pendiri", judul "Founder story.", garis pemisah, lalu grid video + teks |

### Revisi tambahan (2026-11-03, review ketiga)
| # | Revisi | Hasil |
|---|---|---|
| 1 | Kartu "Aplikasi Laundry" dihapus | Modul tambahan kini 8 (Yayasan, HRD, BK, Klinik, Sarpra, Perpustakaan, Kantin, Pesantren); file gambar dibuang. **Catatan: statistik hero masih "15 produk" (6 utama + 9 tambahan di company profile); perlu diputuskan apakah menjadi 14** |
| 2 | Paragraf "Saya Transbara, Founder & CEO SIDIGS dari Malang…" di samping judul Tentang dihapus | Judul Tentang tampil sendiri di kiri |
| 3 | Teks kartu kutipan di Tentang | Diganti menjadi "Sebelum membangun startup, saya adalah kepala sekolah, dan dari ruang itulah saya belajar bahwa transformasi digital tidak dimulai dari teknologi, tetapi dari memahami proses yang ingin diperbaiki." (contoh di `/design-system` ikut diperbarui) |

---

## Lampiran D: Hasil Fase 3, Data & Admin (2026-11-03)
**Perubahan terhadap rencana §11:** tidak ada tabel atau kolom baru. Seksi baru memakai skema `SECTIONS` + `site_settings` yang sudah ada, dan "Proyek Lainnya" memakai kolom `projects` yang sudah ada (name, role, summary, logo_url, url). Satu-satunya SQL adalah file data `supabase/migrations/20261103000000_profile_settings.sql`.

| Area | Hasil |
|---|---|
| Data beranda | Semua teks, gambar, dan daftar dibaca dari `site_settings` key `home_*`; nilai bawaan di `src/lib/home-defaults.ts` (situs tetap tampil penuh bila database kosong/mati). `src/lib/home-data.ts` dihapus |
| Admin > Halaman Beranda | 10 seksi: Navigasi, Hero, Karya (produk, modul tambahan, logo mitra & partner), Pencapaian, Founder Story (video), Tentang, Perjalanan, Artikel di beranda, Kontak, Footer. Field baru bertipe **pilihan** (kategori produk). Judul memakai format: Enter = baris baru, `*kata*` = biru, titik biru otomatis |
| Admin > Proyek | Teks bantuan menjelaskan pemetaan ke kartu Beranda; proyek unggulan tampil lebih dulu; proyek berstatus Diarsipkan tidak tampil |
| Pengaturan situs | Judul tab/SEO kini dari `site.name` + `site.tagline`; deskripsi dari `site.description` |
| SQL profil | Mengisi `site` (positioning baru), `contact.email`, `social.instagram/linkedin`. Nilai yang sudah diisi pengguna tidak ditimpa (kecuali tagline & deskripsi situs). Teruji di Postgres (PGlite): 3 skenario + idempoten |
| Favicon | **T.** (T putih tebal dari font Anton + titik biru) di latar navy: `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`; terpasang di semua layout dan admin |
| Seksi lama | Key lama (hero, about, journey, dst.) tetap ada di kode untuk halaman lama dan dihapus di Fase 4. Seksi tersebut sengaja tidak lagi muncul di admin |

**Perilaku yang perlu diketahui**
- Kolom teks yang dikosongkan di admin jatuh kembali ke teks bawaan; daftar yang dikosongkan total juga kembali ke bawaan. Menyembunyikan seksi tidak didukung (kecuali Artikel, Proyek Lainnya, dan video yang otomatis menyesuaikan).
- Item daftar yang baru ditambah tapi belum diisi tidak ditampilkan di situs.
- Email/Instagram/LinkedIn memakai nilai di `src/lib/profile.ts` bila kolom di admin kosong.
- Gambar sampul video kosong = memakai sampul dari YouTube (hqdefault).

**Pengujian (end-to-end, server Supabase tiruan di lokal, tanpa menyentuh produksi):** login admin, buka seksi, ubah Hero, tambah/ubah/urutkan item produk, simpan, reset ke bawaan, ubah tagline situs, lalu muat ulang situs publik dan cek hasilnya (judul, produk, filter, proyek unggulan di depan, proyek arsip tersembunyi, proyek tanpa tautan tanpa tombol, item kosong tersembunyi). Tidak diuji: unggah gambar ke Storage dan login dengan Supabase sungguhan (butuh server asli).


---

## Lampiran E: Hasil Fase 4 (halaman lain, SEO, pembersihan legacy)

**Selesai (lokal, belum commit, belum deploy):**
- Halaman baru bergaya gelap: `/tentang`, `/proyek` (studi kasus SIDIGS), `/artikel` (filter, cari, muat lebih banyak), `/artikel/[slug]` (TOC, bagikan, penulis, terkait), `/kontak`, `404`.
- Teks halaman lain dapat diedit dari admin (menu **Halaman Lain**, kunci `page_*`), default di `src/lib/page-defaults.ts`.
- SEO: canonical, OG/Twitter, JSON-LD (Person/Organization/WebSite/BreadcrumbList/Article), `sitemap.xml` dinamis, `robots.txt`, gambar OG 1200x630, favicon T putih + titik biru di navy.
- Legacy dihapus: Argon/Bootstrap SCSS, `layouts/Base.astro`, komponen lama, kunci konten lama.
- README diperbarui.

**Hasil Lighthouse (mobile, build produksi lokal, Node tanpa gzip):**

| Halaman | Perf | A11y | BP | SEO |
| --- | --- | --- | --- | --- |
| `/` | 97 (90 pada run ulang) | 100 | 100 | 100 |
| `/tentang` | 87 awal, 81 setelah run ulang (LCP simulasi 3,5-4,1 s) | 100 | 100 | 100 |
| `/proyek` | 99 | 100 | 100 | 100 |
| `/artikel` | 99 | 100 | 100 | 100 |
| `/kontak` | 100 | 100 | 100 | 100 |
| `/artikel/[slug]` | 100 | 96 -> kontras `.credit` diperbaiki (belum diukur ulang) | 100 | 100 |

Catatan: LCP terukur nyata pada `/tentang` sekitar 1 s; angka 3,5-4,1 s adalah simulasi throttling. Potret dikompres (768w: 345 KB -> 238 KB). **Masuk daftar Fase 5:** turunkan LCP `/tentang` agar Perf >= 90, ukur ulang a11y artikel, ulangi tes dengan gzip di Nginx dan di perangkat nyata.

**Belum teruji:** login Supabase asli, upload Storage, perangkat/browser nyata, gzip Nginx. SQL `20261103000000_profile_settings.sql` belum dijalankan user.


---

## Lampiran F: Hasil QA Fase 5 (lokal, build produksi)

**Perbaikan di Fase 5**
- `/tentang`: potret dibuat `loading="lazy"` dan dikompres (768w 345 KB -> 238 KB, 480w 155 KB -> 109 KB). Perf 87 -> 93.
- Kontras teks kredit gambar artikel (`.credit`) memakai `--muted`. A11y artikel 96 -> 100.
- Kolom pencarian `/artikel` kini punya cincin fokus (`outline`) saat fokus keyboard.
- Dev: query Supabase gagal dibungkus `Error` asli, `getContent` tahan Supabase mati, retry bawaan dimatikan di dev (produksi tetap retry). Memperbaiki "UnhandledRejection" dan loading 7-28 detik saat Supabase lokal tidak jalan.

**Lighthouse mobile, rata-rata 3 run (target Perf >= 90, A11y >= 95, SEO >= 95)**

| Halaman | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 | 1,2 s | 0 | 1 ms |
| `/tentang` | 93 | 100 | 100 | 100 | 3,2 s (simulasi) | 0 | 29 ms |
| `/proyek` | 99 | 100 | 100 | 100 | 2,2 s | 0,001 | 1 ms |
| `/artikel` | 99 | 100 | 100 | 100 | 1,9 s | 0 | 0 ms |
| `/artikel/[slug]` | 100 | 100 | 100 | 100 | 1,3 s | 0 | 0 ms |
| `/kontak` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 0 ms |

Server Node tanpa gzip; Nginx produksi akan mengecilkan transfer lagi.

**Uji otomatis (Chrome headless + CDP, server Supabase tiruan)**
- Matriks viewport 360/390/412/768/1024/1280/1440/1920 x 7 halaman: tanpa scroll horizontal, tanpa error konsol/jaringan, tanpa elemen `.reveal` yang tertinggal tersembunyi.
- Tanpa JS (6 halaman): semua konten terlihat, 1 h1, menu tetap ada.
- `prefers-reduced-motion`: 0 animasi tak terbatas, 0 elemen tersembunyi, Motion otomatis off.
- Keyboard (60 tab per halaman): "Lewati ke konten" pertama, semua fokus punya indikator.
- Zoom 200% dan 400% (lebar 640/320): tanpa overflow horizontal.
- Fungsional: filter karya (Semua 16, Mobile 4, Web 3, Proyek 2 pada konten bawaan), accordion, count-up, toggle Motion (tersimpan setelah reload), dialog logo, menu mobile (Esc menutup), form kontak (validasi + kirim sukses), lightbox galeri, filter/cari/muat lebih banyak artikel, TOC, 404, tautan CV dan company profile (200 application/pdf), sitemap, robots, favicon, OG.
- Regresi admin (login, Halaman Lain, simpan, tampil di publik) lulus pada build produksi dengan server tiruan.
- Hygiene: `.env` di-ignore, tidak ada kunci rahasia di repo, nomor telepon tidak ada di sumber maupun PDF.

**Belum teruji (butuh kamu / server asli)**
- Login dan upload Storage ke Supabase produksi, kirim form ke produksi.
- Safari iOS dan perangkat Android nyata, pratinjau OG di WhatsApp/LinkedIn, gzip + header keamanan di Nginx.
- Tombol "Salin tautan" (Clipboard API gagal di headless; fallback pesan tampil, di HTTPS seharusnya jalan).

**Catatan keamanan dependensi (di luar lingkup redesign):** `npm audit --omit=dev` melaporkan 6 temuan (astro <=7.3.1 critical, @astrojs/node, sharp, esbuild, zod). Perbaikan butuh `npm audit fix --force` (naik versi mayor), jadi sebaiknya dikerjakan terpisah setelah redesign rilis, bukan dicampur.

**Daftar langkah rilis (§17), menunggu persetujuan**
1. Commit di `redesign-2026` (git diff besar: 163 file hapus, 21 ubah, 18 baru).
2. Jalankan SQL `20261103000000_profile_settings.sql` di Supabase SQL Editor (hanya mengisi/ubah identitas situs, aman untuk versi lama).
3. Di server: tag `pre-redesign`, simpan `dist.bak-YYYYMMDD`, `git pull`, `npm ci`, `npm run build`, `pm2 reload transbara-web`. Nginx tidak diubah.
4. Cek: semua halaman, form kontak, admin, header keamanan, WhatsApp/LinkedIn preview.
5. Rollback: `git checkout pre-redesign && npm run build && pm2 reload transbara-web`.
