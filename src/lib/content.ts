// Skema konten bersama: sumber tunggal untuk landing page DAN form admin.
// Setiap teks/gambar yang tampil di landing page didefinisikan di sini beserta nilai default-nya.
// Menambah seksi/field baru di landing page = tambahkan juga di sini, maka form admin ikut muncul otomatis.
import { supabase } from './supabase';

export type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'number' | 'strings' | 'list';
export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  itemFields?: Field[]; // untuk type 'list'
};
export type Section = {
  key: string;
  title: string;
  description?: string;
  group: 'beranda' | 'global';
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
  {
    key: 'header', group: 'beranda', title: 'Header',
    fields: [
      { key: 'descriptor', label: 'Deskriptor kecil di bawah wordmark', type: 'text' },
      { key: 'cta_label', label: 'Teks tombol CTA', type: 'text' },
      { key: 'cta_href', label: 'Tautan tombol CTA', type: 'text' },
    ],
  },
  {
    key: 'hero', group: 'beranda', title: 'Hero',
    fields: [
      { key: 'credibility', label: 'Baris kredibilitas', type: 'text' },
      { key: 'headline', label: 'Headline (satu baris per item)', type: 'strings' },
      { key: 'subtext', label: 'Subteks', type: 'textarea' },
      { key: 'cta_primary_label', label: 'Tombol primer: teks', type: 'text' },
      { key: 'cta_primary_href', label: 'Tombol primer: tautan', type: 'text' },
      { key: 'cta_secondary_label', label: 'Tombol sekunder: teks', type: 'text' },
      { key: 'cta_secondary_href', label: 'Tombol sekunder: tautan', type: 'text' },
      { key: 'portrait', label: 'Foto potret', type: 'image', help: 'Juga dipakai di blok penulis artikel. Latar terang akan menyatu dengan biru lembut.' },
      { key: 'portrait_alt', label: 'Teks alternatif foto', type: 'text' },
    ],
  },
  {
    key: 'about', group: 'beranda', title: 'Sedikit Tentang Saya',
    fields: [
      { key: 'title', label: 'Judul seksi', type: 'text' },
      { key: 'intro', label: 'Paragraf perkenalan (huruf serif besar)', type: 'textarea' },
      { key: 'body', label: 'Paragraf pendukung', type: 'textarea' },
      { key: 'link_label', label: 'Teks tautan', type: 'text' },
      { key: 'link_href', label: 'Tautan', type: 'text' },
    ],
  },
  {
    key: 'focus', group: 'beranda', title: 'Area Fokus',
    fields: [
      { key: 'title', label: 'Judul seksi', type: 'text' },
      { key: 'intro', label: 'Pengantar', type: 'textarea' },
      { key: 'items', label: 'Daftar area fokus', type: 'list', itemFields: [
        { key: 'title', label: 'Judul', type: 'text' },
        { key: 'text', label: 'Deskripsi', type: 'textarea' },
      ] },
    ],
  },
  {
    key: 'topics', group: 'beranda', title: 'Topik yang Saya Bicarakan',
    manage: { label: 'Kelola daftar topik', route: '#/topik' },
    fields: [
      { key: 'eyebrow', label: 'Label kecil', type: 'text' },
      { key: 'title', label: 'Judul seksi', type: 'text' },
      { key: 'signature_label', label: 'Label topik andalan', type: 'text' },
      { key: 'cta_label', label: 'Teks tombol', type: 'text' },
      { key: 'cta_href', label: 'Tautan tombol', type: 'text' },
    ],
  },
  {
    key: 'articles', group: 'beranda', title: 'Pikiran yang Saya Bagikan',
    description: 'Artikel besar diambil dari artikel yang ditandai "Unggulan", dua artikel kecil dari artikel terbaru lainnya.',
    manage: { label: 'Kelola artikel', route: '#/artikel' },
    fields: [
      { key: 'title', label: 'Judul seksi', type: 'text' },
      { key: 'link_label', label: 'Teks tautan ke semua artikel', type: 'text' },
    ],
  },
  {
    key: 'journey', group: 'beranda', title: 'Perjalanan yang Terus Bertumbuh',
    fields: [
      { key: 'title', label: 'Judul seksi', type: 'text' },
      { key: 'paragraphs', label: 'Paragraf narasi', type: 'strings' },
      { key: 'quote', label: 'Kutipan (pull quote)', type: 'textarea' },
      { key: 'quote_after', label: 'Tampilkan kutipan setelah paragraf ke-', type: 'number' },
    ],
  },
  {
    key: 'projects', group: 'beranda', title: 'Hal yang Sedang Saya Bangun',
    description: 'Menampilkan proyek yang ditandai "Unggulan".',
    manage: { label: 'Kelola proyek', route: '#/proyek' },
    fields: [{ key: 'title', label: 'Judul seksi', type: 'text' }],
  },
  {
    key: 'cta', group: 'beranda', title: 'CTA Penutup',
    fields: [
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'text', label: 'Teks', type: 'textarea' },
      { key: 'button_label', label: 'Teks tombol', type: 'text' },
      { key: 'button_href', label: 'Tautan tombol', type: 'text' },
    ],
  },
  {
    key: 'footer', group: 'beranda', title: 'Footer',
    fields: [
      { key: 'description', label: 'Deskripsi singkat', type: 'textarea' },
      { key: 'copyright', label: 'Teks hak cipta', type: 'text', help: 'Tahun ditambahkan otomatis di depan.' },
      { key: 'note', label: 'Catatan kecil di kanan bawah', type: 'text', help: 'Opsional. Kosongkan bila tidak perlu.' },
    ],
  },
];

export const DEFAULTS = {
  site: {
    name: 'Transbara Wahyu',
    tagline: 'Slowliving Muslimpreneur',
    description: 'Catatan perjalanan tentang membangun bisnis, mentransformasi pendidikan, dan bertumbuh sebagai Muslimpreneur.',
    og_image: '',
  },
  contact: { email: '' },
  social: { instagram: '', linkedin: '', youtube: '', x: '', threads: '' },
  header: {
    descriptor: 'Entrepreneur · Education · Muslimpreneur',
    cta_label: 'Undang Saya Berbicara',
    cta_href: '/kontak?keperluan=undangan_berbicara',
  },
  hero: {
    credibility: 'Founder SIDIGS. Mantan kepala sekolah.',
    headline: ['Membangun Bisnis.', 'Menumbuhkan Dampak.', 'Menjaga Makna.'],
    subtext: 'Catatan perjalanan tentang membangun bisnis, mentransformasi pendidikan, dan bertumbuh sebagai Muslimpreneur.',
    cta_primary_label: 'Kenali Saya',
    cta_primary_href: '/tentang',
    cta_secondary_label: 'Baca Artikel',
    cta_secondary_href: '/artikel',
    portrait: '/images/transbara-wahyu.jpg',
    portrait_alt: 'Potret Transbara Wahyu Firmansyah mengenakan kemeja batik biru',
  },
  about: {
    title: 'Sedikit Tentang Saya',
    intro: 'Saya Transbara Wahyu, seorang entrepreneur yang tertarik pada persimpangan antara teknologi, pendidikan, dan nilai-nilai Islam. Melalui perjalanan membangun bisnis, saya belajar bahwa pertumbuhan bukan hanya tentang seberapa jauh kita melangkah, tetapi juga tentang nilai yang kita jaga.',
    body: 'Sebelum membangun SIDIGS, saya pernah menjadi kepala sekolah. Dari ruang itulah saya belajar bahwa perubahan di dunia pendidikan selalu dimulai dari manusia, dan pengalaman itu masih menjadi kompas saya hari ini.',
    link_label: 'Baca cerita lengkapnya',
    link_href: '/tentang',
  },
  focus: {
    title: 'Tiga Hal yang Saya Tekuni',
    intro: 'Ruang berpikir dan menulis saya berputar di sekitar tiga area ini.',
    items: [
      { title: 'Pendidikan & Teknologi', text: 'Mengeksplorasi bagaimana teknologi dan AI dapat membantu sekolah bekerja lebih efektif dan meningkatkan kualitas pendidikan.' },
      { title: 'Kewirausahaan & Leadership', text: 'Membagikan pelajaran tentang membangun produk, mengelola bisnis, mengambil keputusan, dan bertumbuh sebagai founder.' },
      { title: 'Muslimpreneur & Pertumbuhan yang Bermakna', text: 'Merefleksikan perjalanan membangun bisnis dengan nilai, menjaga keseimbangan hidup, dan mencari keberkahan dalam pertumbuhan.' },
    ],
  },
  topics: {
    eyebrow: 'Untuk forum, seminar, dan diskusi',
    title: 'Topik yang Saya Bicarakan',
    signature_label: 'Topik andalan',
    cta_label: 'Undang Saya Berbicara',
    cta_href: '/kontak?keperluan=undangan_berbicara',
  },
  articles: { title: 'Pikiran yang Saya Bagikan', link_label: 'Semua artikel' },
  journey: {
    title: 'Perjalanan yang Terus Bertumbuh',
    paragraphs: [
      'Perjalanan saya tidak lurus. Dari ruang kepala sekolah, saya melangkah ke dunia membangun produk, dengan semua kebingungan, kesalahan, dan pelajaran yang menyertainya.',
      'Membangun bisnis mengajarkan saya untuk mendengar lebih banyak, memutuskan dengan lebih jujur, dan bersabar dengan proses. Menjelajahi edutech membuat saya semakin yakin bahwa teknologi hanya berarti jika ia melayani manusia.',
      'Di sepanjang jalan, saya terus merefleksikan nilai yang ingin saya pegang: bekerja dengan sungguh-sungguh, tetap utuh sebagai manusia, dan mencari keberkahan dalam setiap langkah.',
    ],
    quote: 'Pertumbuhan yang paling bermakna sering kali terjadi pelan-pelan, di sela keputusan-keputusan kecil yang kita jaga setiap hari.',
    quote_after: 2,
  },
  projects: { title: 'Hal yang Sedang Saya Bangun' },
  cta: {
    title: 'Selalu Ada Ruang untuk Bertumbuh dan Berkolaborasi.',
    text: 'Terbuka untuk percakapan, pertukaran ide, dan kolaborasi yang membawa dampak.',
    button_label: 'Hubungi Saya',
    button_href: '/kontak',
  },
  footer: {
    description: 'Catatan perjalanan tentang membangun bisnis, mentransformasi pendidikan, dan bertumbuh sebagai Muslimpreneur.',
    copyright: 'Transbara Wahyu Firmansyah. Hak cipta dilindungi.',
    note: '',
  },
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
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) console.error(error);
    return mergeContent(data ?? []);
  })();
  cache = { at: Date.now(), promise };
  return promise;
}
