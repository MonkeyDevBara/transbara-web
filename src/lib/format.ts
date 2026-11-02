// Helper tampilan untuk konten yang bisa diedit dari admin.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Judul display: Enter = baris baru, *kata* = warna biru, titik biru ditambahkan otomatis di akhir.
 * Hasil sudah di-escape sehingga aman dipakai dengan set:html.
 */
export function fmtTitle(text: string, { dot = true }: { dot?: boolean } = {}): string {
  const lines = esc(String(text ?? '')).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const html = lines.map((line, i) => {
    const last = i === lines.length - 1;
    const parts = line.split(/\*(.+?)\*/g); // ganjil = di dalam tanda bintang
    const endsEm = parts.length > 1 && parts.length % 2 === 0 ? false : parts.length > 1 && line.endsWith('*');
    const d = dot && last ? '<span class="dot">.</span>' : '';
    return parts.map((p, j) => {
      if (j % 2 === 1) return `<span class="em">${p}${endsEm && j === parts.length - 2 ? d : ''}</span>`;
      return p;
    }).join('') + (endsEm ? '' : d);
  });
  return html.join('<br />');
}

/** Ambil ID video YouTube dari URL (watch, youtu.be, embed, shorts) atau ID polos. */
export function ytId(input: string): string {
  const s = String(input ?? '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : '';
}
