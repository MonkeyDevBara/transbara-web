// Isi bawaan beranda v2. Dipakai bila database kosong/tidak terjangkau; nilai dari /admin (site_settings, key home_*) diutamakan.
// Sumber: company profile SIDIGS 2026 + profil LinkedIn. Nomor HP pribadi sengaja tidak dicantumkan.

const mitra = Array.from({ length: 30 }, (_, i) => ({ image: `/v2/img/logos/mitra-${String(i + 1).padStart(2, '0')}.webp`, alt: `Logo sekolah mitra ${i + 1}` }));
const PARTNER_NAMES = ['Syabab Studio', 'Next Edu', 'ZKTeco', 'FIVO Studio', 'Winpay', 'Dea Artvertising', 'Bank Muamalat', 'BSI', 'BCA', 'BNI', 'DSG', 'Smartlink', 'OPG'];
const partners = PARTNER_NAMES.map((n, i) => ({ image: `/v2/img/logos/partner-${String(i + 1).padStart(2, '0')}.webp`, alt: `Logo ${n}` }));
const ADDON_NAMES: Record<string, string> = { yayasan: 'Yayasan', hrd: 'HRD', bk: 'BK', klinik: 'Klinik', sarpra: 'Sarpra', perpustakaan: 'Perpustakaan', kantin: 'Kantin', pesantren: 'Pesantren' };
const addons = Object.keys(ADDON_NAMES).map((k) => ({ name: `Aplikasi ${ADDON_NAMES[k]}`, image: `/v2/img/addons/${k}.webp` }));

export const HOME_DEFAULTS = {
  home_header: { wordmark: 'Transbara', cta_label: 'Undang Saya as Speaker' },

  home_hero: {
    eyebrow1: 'Founder & CEO SIDIGS',
    eyebrow2: 'The Muslimpreneur',
    availability: 'Terbuka untuk kolaborasi & speaking',
    big_word: 'Founder',
    greeting: "Hello, I'm",
    name: 'Transbara',
    role: 'Founder & CEO SIDIGS',
    tagline: 'Membantu sekolah bekerja lebih rapi lewat teknologi yang sederhana dan benar-benar dipakai.',
    cta_label: 'Lihat karya saya',
    location: 'Malang, Indonesia',
    badge1: 'Sekolah.',
    badge2: 'Jadi mudah.',
    portrait: '/v2/img/portrait-881.webp',
    portrait_alt: 'Potret Transbara Wahyu Firmansyah mengenakan kemeja batik biru',
    stats: [
      { value: 100, suffix: '+', label: 'Sekolah mitra di Indonesia' },
      { value: 15, suffix: '', label: 'Produk dalam ekosistem SIDIGS' },
      { value: 5, suffix: '+', label: 'Penghargaan & Top 10 startup' },
    ],
    cv_url: '/files/cv-transbara-wahyu.pdf',
    profile_url: '/files/company-profile-sidigs.pdf',
    bar_right: 'Selected work / 2020–2026',
  },

  home_work: {
    label: '01 / Karya',
    title: 'Karya yang bicara',
    link_label: 'Studi kasus SIDIGS',
    link_href: '/proyek',
    products: [
      { name: 'Aplikasi Murid', tag: 'Mobile app', cats: 'mobile', text: 'Jadwal, materi, tugas, nilai, dan pengumuman dalam satu genggaman.', image: '/v2/img/products/murid.webp', link: '/proyek' },
      { name: 'Aplikasi Wali Murid', tag: 'Mobile app', cats: 'mobile', text: 'Pantau presensi, nilai, tagihan, dan perkembangan anak secara real-time.', image: '/v2/img/products/wali-murid.webp', link: '/proyek' },
      { name: 'Aplikasi Guru', tag: 'Mobile app', cats: 'mobile', text: 'Jadwal mengajar, presensi, penilaian, dan poin tata tertib siswa.', image: '/v2/img/products/guru.webp', link: '/proyek' },
      { name: 'Aplikasi CBT', tag: 'Mobile & web', cats: 'mobile web', text: 'Ujian berbasis komputer yang aman, terjadwal, dan terkoreksi otomatis.', image: '/v2/img/products/cbt.webp', link: '/proyek' },
      { name: 'School Management System', tag: 'Web platform', cats: 'web', text: 'Pusat kendali administrasi, data, keuangan, dan presensi sekolah.', image: '/v2/img/products/sms.webp', link: '/proyek' },
      { name: 'Learning Management System', tag: 'Web platform', cats: 'web', text: 'Kelas digital: materi, kuis, dan ujian dalam satu tempat.', image: '/v2/img/products/lms.webp', link: '/proyek' },
    ],
    addons_title: 'Modul tambahan',
    addons,
    projects_title: 'Proyek lainnya',
    trust_label: 'Dipercaya oleh',
    trust_title: '100+ sekolah & 13 partner',
    mitra,
    partners,
  },

  home_awards: {
    label: 'Pencapaian & pengakuan',
    title: 'The work.\n*The recognition*',
    counter: 5,
    counter_label: 'Penghargaan startup',
    text: 'Penghargaan bukan tujuan. Tapi tanda bahwa sekolah-sekolah merasakan manfaatnya.',
    link_label: 'Sertifikat di LinkedIn',
    link_href: 'https://www.linkedin.com/in/transbara-wahyu-firmansyah',
    items: [
      { title: '1st Winner', org: 'Indigo Betalist', rank: '1ST', year: '' },
      { title: 'Top 10 Startup', org: 'Hetero for Startup', rank: 'TOP 10', year: '' },
      { title: 'Top 10 Startup', org: 'Techibition', rank: 'TOP 10', year: '' },
      { title: 'Top 10 Startup', org: 'F+', rank: 'TOP 10', year: '' },
      { title: 'Top 10 Startup', org: 'Hatch by 1000 Startup Digital', rank: 'TOP 10', year: '' },
    ],
  },

  home_story: {
    eyebrow: 'Kisah pendiri',
    title: 'Founder story',
    video: 'https://www.youtube.com/watch?v=6JI1e3aJsaA',
    video_title: 'Kisah Alumni: SIDIGS',
    video_credit: 'Gerakan Nasional 1000 Startup Digital',
    poster: '/v2/img/founder-story.webp',
    body: 'Sebagai seorang Muslim yang percaya bahwa setiap pekerjaan adalah ibadah, saya membangun SIDIGS dengan prinsip: teknologi yang bermanfaat nyata bagi masyarakat, dijalankan dengan amanah, dan memberikan dampak jangka panjang bagi pendidikan Indonesia.',
    values_label: 'Nilai yang Kami Pegang',
    values: ['Amanah', 'Bermanfaat', 'Berdampak'],
  },

  home_about: {
    label: '02 / Tentang',
    title: 'Bukan jualan fitur\ntapi servis *excellent*',
    education_title: 'Pendidikan & keahlian',
    education: [
      { school: 'Universitas Bina Nusantara', program: 'Sistem Informasi Manajemen', years: '2016 – 2020' },
      { school: 'Mahad Cordoba', program: 'Bahasa & Sastra Arab', years: '2018 – 2019' },
      { school: 'Telkom Schools Malang', program: 'Teknik Komputer & Jaringan', years: '2012 – 2015' },
    ],
    skills: ['Startup Development', 'Full-Stack Development', 'School Management', 'Digital Marketing', 'Brand Strategy', 'Public Speaking'],
    languages: ['Indonesia', 'English', 'العربية'],
    certifications: ['Indigo Betalist 1st Winner', 'Business Mentor Wira Cipta', 'PHP Laravel Engineer'],
    steps_title: 'Cara saya bekerja',
    steps: [
      { title: 'Memahami proses', text: 'Mendengar sekolah dulu: alur kerja, kendala, dan orang-orangnya.' },
      { title: 'Merancang sistem', text: 'Menyusun alur digital yang sederhana dan sesuai kebutuhan, bukan sekadar menambah fitur.' },
      { title: 'Membangun', text: 'Mengembangkan produk yang saling terhubung dalam satu ekosistem.' },
      { title: 'Mendampingi', text: 'Pelatihan dan pendampingan di lapangan sampai guru dan staf benar-benar terbiasa.' },
      { title: 'Bertumbuh bersama', text: 'Evaluasi rutin, perbaikan berkelanjutan, dan dampak yang terukur.' },
    ],
    quote: 'Sebelum membangun startup, saya adalah kepala sekolah, dan dari ruang itulah saya belajar bahwa transformasi digital tidak dimulai dari teknologi, tetapi dari memahami proses yang ingin diperbaiki.',
    signature: 'Transbara',
    quote_foot: "Let's make schools simpler",
  },

  home_journey: {
    label: '03 / Perjalanan',
    title: 'Terus bertumbuh. Terus berdampak',
    link_label: 'Resume',
    items: [
      { period: '2020 · Sekarang', role: 'Founder & CEO', org: 'SIDIGS', text: 'Membangun ekosistem aplikasi sekolah terintegrasi yang kini dipakai 100+ sekolah, dari administrasi, pembelajaran, hingga tata kelola.' },
      { period: '2019 · Sekarang', role: 'Managing Director', org: 'CV. Pendekar Pendidikan Digital', text: 'Badan usaha di balik SIDIGS: strategi, kemitraan, dan operasional.' },
      { period: '2022 – 2025', role: 'Founder', org: 'Syabab Studio', text: 'Studio kreatif dan digital, kini menjadi partner ekosistem SIDIGS.' },
      { period: '2023', role: 'Curriculum Director', org: 'Averroes Digital Islamic School', text: 'Merancang kurikulum sekolah Islam berbasis digital.' },
      { period: '2017 – 2019', role: 'Kepala Sekolah', org: 'Khalifah Islamic Boarding School', text: 'Memimpin sekolah dan melihat langsung beban administrasi yang menjadi alasan lahirnya SIDIGS. Sebelumnya Entrepreneur Teacher di sekolah yang sama (2016 – 2017).' },
      { period: '2014 – 2020', role: 'Digital Marketing & Brand', org: 'Berbagai brand & perusahaan', text: 'Strategi digital, media sosial, dan pengembangan brand untuk berbagai bisnis.' },
    ],
    milestones_label: 'Prestasi sekolah mitra',
    milestones_title: 'Sekolah mitra.\n*Prestasi nyata*',
    milestones: [
      { title: "Top 10 World's Best School Prize 2024, Aksi Lingkungan", who: 'Sekolah Alam Pacitan' },
      { title: 'Southeast Asian Waste Hero Awards 2023', who: 'Sekolah Alam Pacitan' },
      { title: 'Digital Transformation Radar Madiun Education Award 2025', who: 'Sekolah Alam Pacitan' },
      { title: 'Special Prize SEAMEO-Japan ESD Award 2022', who: 'Sekolah Alam Pacitan' },
      { title: 'Juara 1 Inotek Website & Aplikasi, Kota Malang', who: 'SMP Negeri 16 Malang' },
      { title: 'Juara 1 Jambore GTK Hebat 2024, Provinsi Jawa Timur', who: 'Mastini, M.Pd.' },
    ],
  },

  home_articles: { label: 'Pikiran yang saya bagikan', title: 'Catatan dari lapangan', link_label: 'Semua artikel' },

  home_contact: {
    label: '04 / Kontak',
    title: "Let's work\ntogether",
    text: 'Punya sekolah yang ingin bertransformasi, acara yang butuh pembicara, atau ide kolaborasi? Mari ngobrol.',
    button_label: 'Mulai percakapan',
    card_title: 'SIDIGS',
    card_subtitle: 'Sekolah jadi mudah',
    card_button: 'Kunjungi sidigs.com',
    card_url: 'https://sidigs.com',
    form_title: 'Ceritakan kebutuhan Anda',
  },

  home_footer: { copyright: 'Transbara Wahyu Firmansyah. Membangun dengan makna.' },
};

export const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'mobile', label: 'Aplikasi Mobile' },
  { key: 'web', label: 'Web Platform' },
  { key: 'project', label: 'Proyek Lainnya' },
];

export const PURPOSES = [
  { value: 'undangan_berbicara', label: 'Undangan berbicara' },
  { value: 'diskusi_pendidikan', label: 'Digitalisasi sekolah' },
  { value: 'kolaborasi', label: 'Kolaborasi' },
  { value: 'lainnya', label: 'Lainnya' },
];

// Pratinjau lokal saja (dipakai hanya di mode dev bila database tidak terjangkau). Di produksi data selalu dari CMS > Proyek.
export const PREVIEW_PROJECTS = [
  { id: 'preview-1', name: 'SIDIGS', role: 'Founder & CEO', summary: 'Aplikasi sekolah terintegrasi berbasis web dan mobile (data contoh pratinjau).', logo_url: null as string | null, url: 'https://sidigs.com', is_featured: true },
  { id: 'preview-2', name: 'Syabab Studio', role: 'Founder', summary: 'Studio kreatif dan digital (data contoh pratinjau, tanpa tautan).', logo_url: '/v2/img/logos/partner-01.webp', url: '', is_featured: false },
];
