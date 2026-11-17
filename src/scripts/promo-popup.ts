// Pop up promo: tampil sekali pada kunjungan pertama (penanda di localStorage 'tw-promo-seen').
// Ditandai "sudah dilihat" saat ditampilkan, jadi tutup, klik Claim Promo, maupun pindah halaman tidak memunculkannya lagi.
// Tidak tampil bila: halaman noindex, penyimpanan diblokir (tidak bisa mengingat), atau admin sedang login.
const KEY = 'tw-promo-seen';
const dlg = document.getElementById('promo') as HTMLDialogElement | null;

function shouldShow() {
  if (!dlg || typeof dlg.showModal !== 'function') return false;
  if (document.querySelector('meta[name="robots"][content*="noindex"]')) return false;
  try {
    if (localStorage.getItem(KEY) || localStorage.getItem('tw-admin-auth')) return false;
    localStorage.setItem(KEY, String(Date.now()));
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

function open() {
  if (!dlg || !shouldShow()) return;
  const img = dlg.querySelector('img')!;
  img.src = dlg.dataset.img!;
  const show = () => { dlg.showModal(); document.body.style.overflow = 'hidden'; };
  // Tampil setelah gambar siap agar tidak muncul kotak kosong.
  if (img.complete) show(); else img.addEventListener('load', show, { once: true });
}

if (dlg) {
  dlg.querySelector('[data-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
  // Beri jeda singkat supaya tidak bersaing dengan render awal halaman.
  setTimeout(open, 1200);
}
