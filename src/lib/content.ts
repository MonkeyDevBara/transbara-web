// Skema konten bersama: sumber tunggal untuk landing page DAN form admin.
// Setiap teks/gambar yang tampil di landing page didefinisikan di sini beserta nilai default-nya.
// Menambah seksi/field baru di landing page = tambahkan juga di sini, maka form admin ikut muncul otomatis.
import { supabase } from './supabase';
import { HOME_DEFAULTS } from './home-defaults';
import { PAGE_DEFAULTS } from './page-defaults';

export type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'number' | 'strings' | 'list' | 'select';
export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  itemFields?: Field[]; // untuk type 'list' (jangan menumpuk list di dalam list)
  options?: { value: string; label: string }[]; // untuk type 'select'
};
export type Section = {
  key: string;
  title: string;
  description?: string;
  group: 'beranda' | 'halaman' | 'global';
  manage?: { label: string; route: string }; // data berulang yang dikelola di modul lain
  fields: Field[];
};

export const SECTIONS: Section[] = [
  {
    key: 'site', group: 'global', title: 'Identitas & SEO situs',
    description: 'Nama situs, tagline, dan deskripsi bawaan untuk mesin pencari serta pratinjau saat dibagikan.',
    fields: [
      { key: 'name', label: 'Nama situs / wordmark', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text', help: 'Dipakai di judul tab beranda dan footer.' },
      { key: 'description', label: 'Deskripsi meta bawaan', type: 'textarea', help: 'Maks. ~160 karakter agar tidak terpotong di Google.' },
      { key: 'og_image', label: 'Gambar share sosial bawaan', type: 'image' },
    ],
  },
  {
    key: 'contact', group: 'global', title: 'Email kontak',
    fields: [{ key: 'email', label: 'Email publik', type: 'text', help: 'Kosongkan bila belum ingin ditampilkan.' }],
  },
  {
    key: 'social', group: 'global', title: 'Tautan sosial media',
    description: 'Kosongkan untuk menampilkan status "belum diatur".',
    fields: [
      { key: 'instagram', label: 'Instagram', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn', type: 'url' },
      { key: 'youtube', label: 'YouTube', type: 'url' },
      { key: 'x', label: 'X', type: 'url' },
      { key: 'threads', label: 'Threads', type: 'url' },
    ],
  },
  // ======= Beranda v2 (key diawali home_). Seksi lama (hero, about, journey, dst.) masih dipakai halaman lain sampai Fase 4. =======
  {
    key: 'home_header', group: 'beranda', title: 'Navigasi',
    fields: [
      { key: 'wordmark', label: 'Nama di pojok kiri (wordmark)', type: 'text', help: 'Titik biru ditambahkan otomatis.' },
      { key: 'cta_label', label: 'Teks tombol di kanan atas', type: 'text', help: 'Tombol ini membuka form kontak dengan keperluan "Undangan berbicara".' },
    ],
  },
  {
    key: 'home_hero', group: 'beranda', title: 'Hero (layar pertama)',
    fields: [
      { key: 'eyebrow1', label: 'Label kecil 1 (kiri atas)', type: 'text' },
      { key: 'eyebrow2', label: 'Label kecil 2', type: 'text' },
      { key: 'availability', label: 'Status (kanan atas, dengan titik berdenyut)', type: 'text' },
      { key: 'big_word', label: 'Kata raksasa di belakang foto', type: 'text', help: 'Satu kata pendek (maks. ±8 huruf) agar muat di layar.' },
      { key: 'greeting', label: 'Sapaan tulisan tangan', type: 'text' },
      { key: 'name', label: 'Nama besar', type: 'text' },
      { key: 'role', label: 'Jabatan', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'cta_label', label: 'Teks tombol utama', type: 'text' },
      { key: 'location', label: 'Lokasi', type: 'text' },
      { key: 'badge1', label: 'Teks lencana ✳ baris 1', type: 'text' },
      { key: 'badge2', label: 'Teks lencana ✳ baris 2', type: 'text' },
      { key: 'portrait', label: 'Foto (PNG/WebP latar transparan)', type: 'image', help: 'Gunakan foto setengah badan dengan latar dihapus agar tampil di depan kata raksasa. Rasio ±3:4.' },
      { key: 'portrait_alt', label: 'Teks alternatif foto', type: 'text' },
      { key: 'stats', label: 'Angka statistik', type: 'list', help: 'Disarankan 3 item.', itemFields: [
        { key: 'value', label: 'Angka', type: 'number' },
        { key: 'suffix', label: 'Akhiran (mis. +)', type: 'text' },
        { key: 'label', label: 'Keterangan', type: 'text' },
      ] },
      { key: 'cv_url', label: 'Berkas CV (PDF)', type: 'text', help: 'Isi tautan berkas, mis. /files/cv-transbara-wahyu.pdf atau URL dari Pustaka Media.' },
      { key: 'profile_url', label: 'Berkas Company Profile (PDF)', type: 'text' },
      { key: 'bar_right', label: 'Teks di kanan bawah hero', type: 'text' },
    ],
  },
  {
    key: 'home_work', group: 'beranda', title: 'Karya: produk, logo mitra & proyek',
    description: 'Proyek lainnya diambil otomatis dari menu Proyek (logo, nama, peran, ringkasan, tautan).',
    manage: { label: 'Kelola Proyek Lainnya', route: '#/proyek' },
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'link_label', label: 'Teks tautan di kanan judul', type: 'text' },
      { key: 'link_href', label: 'Tautan', type: 'text' },
      { key: 'products', label: 'Produk utama (kartu besar)', type: 'list', itemFields: [
        { key: 'name', label: 'Nama produk', type: 'text' },
        { key: 'tag', label: 'Label di pojok gambar', type: 'text', help: 'Mis. Mobile app, Web platform.' },
        { key: 'cats', label: 'Muncul di filter', type: 'select', options: [
          { value: 'mobile', label: 'Aplikasi Mobile' }, { value: 'web', label: 'Web Platform' }, { value: 'mobile web', label: 'Mobile & Web (muncul di keduanya)' },
        ] },
        { key: 'text', label: 'Deskripsi singkat', type: 'textarea' },
        { key: 'image', label: 'Gambar mockup (PNG/WebP, latar transparan)', type: 'image' },
        { key: 'link', label: 'Tautan kartu', type: 'text' },
      ] },
      { key: 'addons_title', label: 'Judul blok modul tambahan', type: 'text' },
      { key: 'addons', label: 'Modul tambahan (ikon kecil)', type: 'list', itemFields: [
        { key: 'name', label: 'Nama modul', type: 'text' },
        { key: 'image', label: 'Gambar ikon', type: 'image' },
      ] },
      { key: 'projects_title', label: 'Judul blok Proyek Lainnya', type: 'text' },
      { key: 'trust_label', label: 'Label kecil blok logo', type: 'text' },
      { key: 'trust_title', label: 'Judul blok logo', type: 'text', help: 'Mis. "100+ sekolah & 13 partner". Perbarui angkanya bila daftar logo berubah.' },
      { key: 'mitra', label: 'Logo sekolah mitra', type: 'list', itemFields: [
        { key: 'image', label: 'Logo', type: 'image' },
        { key: 'alt', label: 'Nama sekolah (teks alternatif)', type: 'text' },
      ] },
      { key: 'partners', label: 'Logo partner', type: 'list', itemFields: [
        { key: 'image', label: 'Logo', type: 'image' },
        { key: 'alt', label: 'Nama partner (teks alternatif)', type: 'text' },
      ] },
    ],
  },
  {
    key: 'home_awards', group: 'beranda', title: 'Pencapaian & penghargaan',
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'counter', label: 'Angka besar', type: 'number' },
      { key: 'counter_label', label: 'Keterangan angka', type: 'text' },
      { key: 'text', label: 'Teks pendamping', type: 'textarea' },
      { key: 'link_label', label: 'Teks tautan', type: 'text' },
      { key: 'link_href', label: 'Tautan', type: 'url' },
      { key: 'items', label: 'Daftar penghargaan', type: 'list', itemFields: [
        { key: 'title', label: 'Judul', type: 'text' },
        { key: 'org', label: 'Penyelenggara', type: 'text' },
        { key: 'rank', label: 'Peringkat (teks besar di kanan)', type: 'text', help: 'Mis. 1ST, TOP 10.' },
        { key: 'year', label: 'Tahun (opsional)', type: 'text' },
      ] },
    ],
  },
  {
    key: 'home_story', group: 'beranda', title: 'Founder Story (video)',
    fields: [
      { key: 'eyebrow', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'video', label: 'Tautan video YouTube', type: 'url', help: 'Tempel tautan YouTube biasa. Video tidak diputar otomatis dan baru dimuat saat tombol putar ditekan.' },
      { key: 'video_title', label: 'Judul video', type: 'text' },
      { key: 'video_credit', label: 'Kredit / sumber video', type: 'text' },
      { key: 'poster', label: 'Gambar sampul video (16:9)', type: 'image', help: 'Kosongkan untuk memakai sampul dari YouTube.' },
      { key: 'body', label: 'Paragraf cerita', type: 'textarea' },
      { key: 'values_label', label: 'Judul daftar nilai', type: 'text' },
      { key: 'values', label: 'Daftar nilai', type: 'strings' },
    ],
  },
  {
    key: 'home_about', group: 'beranda', title: 'Tentang',
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'education_title', label: 'Judul kolom pendidikan', type: 'text' },
      { key: 'education', label: 'Pendidikan', type: 'list', itemFields: [
        { key: 'school', label: 'Institusi', type: 'text' },
        { key: 'program', label: 'Program / jurusan', type: 'text' },
        { key: 'years', label: 'Tahun', type: 'text' },
      ] },
      { key: 'skills', label: 'Keahlian', type: 'strings' },
      { key: 'languages', label: 'Bahasa', type: 'strings' },
      { key: 'certifications', label: 'Sertifikasi', type: 'strings' },
      { key: 'steps_title', label: 'Judul kolom cara kerja', type: 'text' },
      { key: 'steps', label: 'Langkah cara kerja', type: 'list', itemFields: [
        { key: 'title', label: 'Judul langkah', type: 'text' },
        { key: 'text', label: 'Penjelasan', type: 'textarea' },
      ] },
      { key: 'quote', label: 'Teks kartu kutipan', type: 'textarea' },
      { key: 'signature', label: 'Tanda tangan (tulisan tangan)', type: 'text' },
      { key: 'quote_foot', label: 'Teks kecil di dasar kartu', type: 'text' },
    ],
  },
  {
    key: 'home_journey', group: 'beranda', title: 'Perjalanan',
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'link_label', label: 'Teks tautan Resume (membuka berkas CV)', type: 'text' },
      { key: 'items', label: 'Riwayat (item pertama terbuka otomatis)', type: 'list', itemFields: [
        { key: 'period', label: 'Periode', type: 'text' },
        { key: 'role', label: 'Peran', type: 'text' },
        { key: 'org', label: 'Organisasi', type: 'text' },
        { key: 'text', label: 'Deskripsi (tampil saat dibuka)', type: 'textarea' },
      ] },
      { key: 'milestones_label', label: 'Label kecil kolom prestasi', type: 'text' },
      { key: 'milestones_title', label: 'Judul kolom prestasi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'milestones', label: 'Daftar prestasi', type: 'list', itemFields: [
        { key: 'title', label: 'Prestasi', type: 'text' },
        { key: 'who', label: 'Siapa / sekolah', type: 'text' },
      ] },
    ],
  },
  {
    key: 'home_articles', group: 'beranda', title: 'Artikel di beranda',
    description: 'Seksi ini hanya tampil bila sudah ada artikel terbit yang bukan contoh (3 terbaru).',
    manage: { label: 'Kelola artikel', route: '#/artikel' },
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'link_label', label: 'Teks tautan ke semua artikel', type: 'text' },
    ],
  },
  {
    key: 'home_contact', group: 'beranda', title: 'Kontak',
    description: 'Email, Instagram, dan LinkedIn diatur di Pengaturan Website.',
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'text', label: 'Teks pengantar', type: 'textarea' },
      { key: 'button_label', label: 'Teks tombol utama', type: 'text' },
      { key: 'card_title', label: 'Kartu miring: judul', type: 'text' },
      { key: 'card_subtitle', label: 'Kartu miring: subjudul', type: 'text' },
      { key: 'card_button', label: 'Kartu miring: teks tombol', type: 'text' },
      { key: 'card_url', label: 'Kartu miring: tautan', type: 'url' },
      { key: 'form_title', label: 'Judul bagian form', type: 'text' },
    ],
  },
  {
    key: 'home_footer', group: 'beranda', title: 'Footer',
    fields: [{ key: 'copyright', label: 'Teks hak cipta', type: 'text', help: 'Tahun ditambahkan otomatis di depan.' }],
  },
  // ======= Halaman lain (key diawali page_) =======
  {
    key: 'page_proyek', group: 'halaman', title: 'Halaman Proyek (studi kasus SIDIGS)',
    description: 'Produk, logo mitra, dan penghargaan memakai data dari Halaman Beranda. Daftar proyek lain diambil dari menu Proyek.',
    manage: { label: 'Kelola Proyek', route: '#/proyek' },
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul halaman', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'intro', label: 'Pengantar paragraf 1', type: 'textarea' },
      { key: 'intro_2', label: 'Pengantar paragraf 2', type: 'textarea' },
      { key: 'ecosystem_title', label: 'Judul ekosistem produk', type: 'text' },
      { key: 'ecosystem_text', label: 'Teks ekosistem produk', type: 'textarea' },
      { key: 'values_title', label: 'Judul nilai utama', type: 'text' },
      { key: 'values', label: 'Nilai utama', type: 'list', itemFields: [
        { key: 'title', label: 'Judul', type: 'text' },
        { key: 'text', label: 'Penjelasan', type: 'textarea' },
      ] },
      { key: 'partners_title', label: 'Judul mitra & partner', type: 'text' },
      { key: 'partners_text', label: 'Teks mitra & partner', type: 'textarea' },
      { key: 'awards_title', label: 'Judul pencapaian', type: 'text' },
      { key: 'awards_text', label: 'Teks pencapaian', type: 'textarea' },
      { key: 'gallery_title', label: 'Judul galeri dokumentasi', type: 'text' },
      { key: 'gallery', label: 'Foto dokumentasi', type: 'list', itemFields: [
        { key: 'image', label: 'Foto', type: 'image' },
        { key: 'caption', label: 'Keterangan foto', type: 'text' },
      ] },
      { key: 'projects_title', label: 'Judul proyek lainnya', type: 'text' },
      { key: 'cta_title', label: 'Ajakan: judul', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'cta_text', label: 'Ajakan: teks', type: 'textarea' },
      { key: 'cta_label', label: 'Ajakan: teks tombol', type: 'text' },
      { key: 'cta_url', label: 'Ajakan: tautan tombol', type: 'url' },
    ],
  },
  {
    key: 'page_tentang', group: 'halaman', title: 'Halaman Tentang',
    description: 'Pendidikan, keahlian, dan nilai memakai data dari Halaman Beranda. Topik bicara diambil dari menu Topik Bicara.',
    manage: { label: 'Kelola Topik Bicara', route: '#/topik' },
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul halaman', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'lead', label: 'Kalimat pembuka', type: 'textarea' },
      { key: 'story_title', label: 'Judul bagian cerita', type: 'text' },
      { key: 'story', label: 'Paragraf cerita (paragraf pertama tampil lebih besar)', type: 'strings' },
      { key: 'timeline_title', label: 'Judul perjalanan', type: 'text' },
      { key: 'timeline', label: 'Riwayat perjalanan', type: 'list', help: 'Item tanpa deskripsi tampil sebagai baris biasa (tidak bisa dibuka).', itemFields: [
        { key: 'period', label: 'Periode', type: 'text' },
        { key: 'role', label: 'Peran', type: 'text' },
        { key: 'org', label: 'Organisasi', type: 'text' },
        { key: 'text', label: 'Deskripsi (opsional)', type: 'textarea' },
      ] },
      { key: 'topics_title', label: 'Judul topik bicara', type: 'text' },
      { key: 'topics_text', label: 'Teks topik bicara', type: 'text' },
      { key: 'cta_title', label: 'Ajakan: judul', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'cta_text', label: 'Ajakan: teks', type: 'textarea' },
      { key: 'cta_label', label: 'Ajakan: teks tombol', type: 'text' },
    ],
  },
  {
    key: 'page_artikel', group: 'halaman', title: 'Halaman Artikel (indeks)',
    manage: { label: 'Kelola artikel', route: '#/artikel' },
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul halaman', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'intro', label: 'Pengantar', type: 'textarea' },
    ],
  },
  {
    key: 'page_kontak', group: 'halaman', title: 'Halaman Kontak',
    description: 'Email, Instagram, dan LinkedIn diatur di Pengaturan Website.',
    fields: [
      { key: 'label', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul halaman', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'intro', label: 'Pengantar', type: 'textarea' },
      { key: 'note', label: 'Catatan kecil', type: 'text' },
    ],
  },
  {
    key: 'page_404', group: 'halaman', title: 'Halaman tidak ditemukan (404)',
    fields: [
      { key: 'title', label: 'Judul', type: 'textarea', help: 'Enter = baris baru. Bungkus kata dengan *tanda bintang* agar berwarna biru. Titik biru di akhir ditambahkan otomatis.' },
      { key: 'text', label: 'Teks', type: 'textarea' },
    ],
  },
];

export const DEFAULTS = {
  ...HOME_DEFAULTS,
  ...PAGE_DEFAULTS,
  site: {
    name: 'Transbara Wahyu',
    tagline: 'Founder & CEO SIDIGS',
    description: 'Transbara Wahyu Firmansyah, Founder & CEO SIDIGS. Membantu 100+ sekolah bekerja lebih rapi lewat ekosistem digital terintegrasi.',
    og_image: '',
  },
  contact: { email: '' },
  social: { instagram: '', linkedin: '', youtube: '', x: '', threads: '' },
};

export type Content = typeof DEFAULTS;

/** Gabungkan nilai dari database dengan default; nilai kosong jatuh ke default (kecuali kontak & sosmed). */
export function mergeContent(rows: { key: string; value: any }[]): Content {
  const out: any = structuredClone(DEFAULTS);
  for (const row of rows) {
    if (!(row.key in out) || !row.value || typeof row.value !== 'object') continue;
    for (const [k, v] of Object.entries(row.value)) {
      if (!(k in out[row.key])) continue;
      const optional = row.key === 'contact' || row.key === 'social' || k === 'og_image' || (row.key === 'footer' && k === 'note');
      const empty = v === null || v === '' || (Array.isArray(v) && v.length === 0);
      if (!empty || optional) out[row.key][k] = v ?? '';
    }
  }
  return out;
}

let cache: { at: number; promise: Promise<Content> } | null = null;

export function getContent(): Promise<Content> {
  // Cache singkat: beberapa komponen dalam satu render memakai hasil query yang sama.
  if (cache && Date.now() - cache.at < 3000) return cache.promise;
  const promise = (async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) console.error(error);
      return mergeContent(data ?? []);
    } catch (e) {
      // Supabase tidak terjangkau: tampilkan konten bawaan, jangan gagalkan halaman.
      console.error(e);
      return mergeContent([]);
    }
  })();
  cache = { at: Date.now(), promise };
  return promise;
}
