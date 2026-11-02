// Isi bawaan halaman dalam (Proyek, Tentang, Artikel, Kontak, 404). Editable dari /admin > Halaman Lain (site_settings key page_*).
// Sumber: company profile SIDIGS 2026 dan profil LinkedIn (kalimat ringkasan dikutip dari tulisan pemilik).

const docs = Array.from({ length: 12 }, (_, i) => ({ image: `/v2/img/docs/doc-${String(i + 1).padStart(2, '0')}.webp`, caption: 'Pendampingan implementasi SIDIGS di sekolah' }));

export const PAGE_DEFAULTS = {
  page_proyek: {
    label: 'Studi kasus',
    title: 'SIDIGS\n*Sekolah jadi mudah*',
    intro: 'SIDIGS adalah aplikasi sekolah dengan sistem digital terintegrasi berbasis web dan mobile yang dirancang untuk mendukung manajemen sekolah secara menyeluruh dalam satu ekosistem terpusat.',
    intro_2: 'Seluruh aktivitas akademik, administrasi, keuangan, dan komunikasi disatukan dalam satu sistem yang saling terhubung dan mudah dikendalikan oleh pimpinan sekolah, tanpa menambah beban guru dan staf.',
    ecosystem_title: 'Ekosistem produk',
    ecosystem_text: 'Setiap produk dalam ekosistem SIDIGS dirancang untuk saling melengkapi dan membentuk satu sistem manajemen sekolah yang utuh, sehingga sekolah dapat mengelola seluruh kebutuhan operasional dalam satu platform terintegrasi.',
    values_title: 'Nilai utama',
    values: [
      { title: 'Efisiensi waktu', text: 'Proses administrasi dan pelaporan menjadi lebih cepat dan terstruktur.' },
      { title: 'Efisiensi tenaga', text: 'Guru dan staf dapat fokus pada kegiatan inti pendidikan.' },
      { title: 'Efisiensi biaya', text: 'Sistem terintegrasi mengoptimalkan biaya operasional sekolah.' },
      { title: 'Keamanan dan akses data', text: 'Data sekolah tersimpan aman dan dapat diakses sesuai kewenangan.' },
    ],
    partners_title: 'Mitra & partner',
    partners_text: 'SIDIGS telah dipercaya oleh berbagai sekolah sebagai mitra transformasi digital dalam pengelolaan sekolah, dan membangun kolaborasi dengan berbagai partner untuk mendukung ekosistem digital pendidikan yang berkelanjutan.',
    awards_title: 'Pencapaian',
    awards_text: 'Pencapaian SIDIGS merupakan hasil dari kepercayaan dan kolaborasi bersama sekolah-sekolah yang terus bertumbuh.',
    gallery_title: 'Dokumentasi jejak kami',
    gallery: docs,
    projects_title: 'Proyek lainnya',
    cta_title: 'Ingin sekolah Anda\nlebih *mudah dikelola*',
    cta_text: 'Kenali SIDIGS lebih jauh di sidigs.com, atau ceritakan kebutuhan sekolah Anda langsung kepada saya.',
    cta_label: 'Kunjungi sidigs.com',
    cta_url: 'https://sidigs.com',
  },

  page_tentang: {
    label: 'Tentang',
    title: 'Saya Transbara\n*Founder & CEO SIDIGS*',
    lead: 'Transformasi digital di sekolah bukan dimulai dari teknologi, tetapi dari pemahaman terhadap proses yang ingin diperbaiki.',
    story_title: 'Cerita saya',
    story: [
      'Saya adalah Founder & CEO SIDIGS, sebuah perusahaan edutech yang membantu sekolah membangun sistem digital yang lebih terintegrasi, mulai dari administrasi, pembelajaran, hingga tata kelola sekolah.',
      'Selama beberapa tahun terakhir, saya berkesempatan bekerja sama dengan berbagai sekolah di Indonesia dan melihat satu pola yang terus berulang: banyak institusi ingin bertransformasi secara digital, tetapi belum memiliki strategi, sistem, dan pendampingan yang tepat agar perubahan tersebut benar-benar memberikan dampak.',
      'Melalui SIDIGS, saya berfokus membangun solusi yang sederhana, relevan, dan dapat digunakan secara berkelanjutan. Bagi saya, keberhasilan digitalisasi bukan diukur dari banyaknya fitur yang dimiliki sebuah aplikasi, tetapi dari seberapa besar teknologi mampu membantu guru, tenaga kependidikan, dan pimpinan sekolah bekerja lebih efektif.',
      'Saya selalu terbuka untuk berdiskusi dan berkolaborasi dengan kepala sekolah, yayasan, praktisi pendidikan, pemerintah, maupun pelaku industri yang memiliki visi untuk membangun ekosistem pendidikan yang lebih baik melalui teknologi.',
    ],
    timeline_title: 'Perjalanan',
    timeline: [
      { period: '2020 · Sekarang', role: 'Founder & Chief Executive Officer', org: 'SIDIGS', text: 'Membangun ekosistem aplikasi sekolah terintegrasi yang kini dipakai 100+ sekolah, dari administrasi, pembelajaran, hingga tata kelola.' },
      { period: '2019 · Sekarang', role: 'Managing Director', org: 'CV. Pendekar Pendidikan Digital · Malang', text: 'Badan usaha di balik SIDIGS: strategi, kemitraan, dan operasional.' },
      { period: '2022 – 2025', role: 'Founder', org: 'Syabab Studio · Malang', text: 'Studio kreatif dan digital, kini menjadi partner ekosistem SIDIGS.' },
      { period: '2023', role: 'Curriculum Director', org: 'Averroes Digital Islamic School · Malang', text: 'Merancang kurikulum sekolah Islam berbasis digital.' },
      { period: '2019 – 2020', role: 'Sales & Marketing Specialist', org: 'Indonesia Interactive Standard School · Malang', text: '' },
      { period: '2017 – 2019', role: 'Kepala Sekolah', org: 'Khalifah Islamic Boarding School · Malang', text: 'Memimpin sekolah dan melihat langsung beban administrasi yang menjadi alasan lahirnya SIDIGS.' },
      { period: '2016 – 2017', role: 'Entrepreneur Teacher', org: 'Khalifah Islamic Boarding School · Malang', text: '' },
      { period: '2014 – 2020', role: 'Digital Marketing Manager & Brand Consultant', org: 'Self-employed', text: 'Strategi digital, media sosial, dan pengembangan brand untuk berbagai bisnis.' },
      { period: '2017 – 2018', role: 'Marketing', org: 'Batu Flower Garden · Batu', text: '' },
      { period: '2018', role: 'Digital Marketing Intern', org: 'Illiyin Studio · Malang', text: '' },
      { period: '2017 – 2018', role: 'Brand Development Manager', org: 'Ganto Minang Padang Pamudo · Malang', text: '' },
      { period: '2016 – 2017', role: 'Digital Marketing Manager', org: 'CV. Revolution Indonesia · Surabaya', text: '' },
      { period: '2015 – 2016', role: 'Network Engineer', org: 'PT. Sinergy Informasi Pratama · Jakarta', text: '' },
      { period: '2015 – 2016', role: 'Social Media Specialist', org: 'CV. Uno Ice Cream Indonesia · Malang', text: '' },
    ],
    topics_title: 'Topik yang bisa saya bawakan',
    topics_text: 'Untuk forum, seminar, dan diskusi.',
    cta_title: 'Mari berbagi gagasan\ndi *forum Anda*',
    cta_text: 'Saya terbuka untuk berbicara tentang digitalisasi sekolah, AI untuk guru, perjalanan dari sekolah ke startup, dan bisnis yang bermakna.',
    cta_label: 'Undang Saya Berbicara',
  },

  page_artikel: {
    label: 'Catatan & pemikiran',
    title: 'Pikiran yang\n*saya bagikan*',
    intro: 'Ruang untuk berbagi gagasan, pelajaran, dan refleksi tentang pendidikan, bisnis, teknologi, dan perjalanan bertumbuh.',
  },

  page_kontak: {
    label: 'Kontak',
    title: 'Mari\n*terhubung*',
    intro: 'Untuk diskusi, undangan berbicara, pertukaran ide, atau peluang kolaborasi, silakan hubungi saya.',
    note: 'Saya membaca setiap pesan dan akan membalas sesegera mungkin.',
  },

  page_404: {
    title: 'Halaman ini\n*belum dibuat*',
    text: 'Mungkin tautannya sudah berubah. Silakan kembali ke beranda atau jelajahi tulisan terbaru.',
  },
};
