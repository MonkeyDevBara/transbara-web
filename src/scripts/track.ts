// Mengirim satu kunjungan ke /api/hit per pemuatan halaman publik. Tanpa cookie.
// Dilewati untuk: halaman noindex (404, referensi), Do Not Track, dan admin yang sedang login
// (sesi admin tersimpan di localStorage 'tw-admin-auth', lihat src/admin/sb.ts).
function send() {
  fetch('/api/hit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: location.pathname, referrer: document.referrer }),
    keepalive: true,
  }).catch(() => {});
}

function skip() {
  if (document.querySelector('meta[name="robots"][content*="noindex"]')) return true;
  if (navigator.doNotTrack === '1') return true;
  try { if (localStorage.getItem('tw-admin-auth')) return true; } catch { /* storage diblokir: lanjut */ }
  return false;
}

if (!skip()) {
  // Tab yang dibuka di latar belakang / prerender baru dihitung saat benar-benar dilihat.
  if (document.visibilityState === 'visible') send();
  else document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && send(), { once: true });
}
