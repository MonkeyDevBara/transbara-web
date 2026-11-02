import { useRef, useState } from 'preact/hooks';
import { sb, uploadImage, storagePathFromUrl, errMsg, MEDIA_BUCKET } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, useLoad, useToast, fmtDate, q } from '../ui';

export default function Media() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(() => q(sb.from('media').select('*').order('created_at', { ascending: false })));
  const [busy, setBusy] = useState(0);
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | File[] | null) => {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    setBusy(list.length);
    let ok = 0;
    for (const f of list) {
      try { await uploadImage(f); ok++; } catch (e) { toast(`${f.name}: ${errMsg(e)}`, true); }
      setBusy((n) => n - 1);
    }
    if (ok) toast(`${ok} gambar diunggah.`);
    if (fileRef.current) fileRef.current.value = '';
    reload();
  };
  const editAlt = async (m: any) => {
    const alt = prompt('Teks alternatif (deskripsi gambar)', m.alt ?? '');
    if (alt === null) return;
    const { error } = await sb.from('media').update({ alt: alt.trim() || null }).eq('id', m.id);
    if (error) return toast(errMsg(error), true);
    reload();
  };
  const copy = async (url: string) => {
    try { await navigator.clipboard.writeText(url); toast('URL disalin.'); } catch { prompt('Salin URL ini:', url); }
  };
  const remove = async (m: any) => {
    if (!confirm('Hapus gambar ini? Halaman yang memakainya akan kehilangan gambar.')) return;
    const path = storagePathFromUrl(m.url);
    if (path) {
      const { error } = await sb.storage.from(MEDIA_BUCKET).remove([path]);
      if (error) return toast(errMsg(error), true);
    }
    const { error } = await sb.from('media').delete().eq('id', m.id);
    if (error) return toast(errMsg(error), true);
    toast('Gambar dihapus.'); reload();
  };

  return (
    <>
      <PageHead title="Pustaka Media" desc="Gambar untuk sampul artikel, gambar inline, logo proyek, dan foto potret. Maks. 10 MB per file." />
      <Panel>
        <div class="panel-b">
          <div class="drop" style={over ? { borderColor: 'var(--navy)' } : undefined}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer?.files ?? null); }}>
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onChange={(e) => upload(e.currentTarget.files)} />
            {busy > 0 ? <span><span class="spin" /> Mengunggah {busy} file…</span> : (
              <>Seret gambar ke sini atau <button type="button" class="btn btn-p btn-sm" onClick={() => fileRef.current?.click()}>Pilih file</button><div class="help muted mt">JPG, PNG, WebP, atau GIF</div></>
            )}
          </div>
        </div>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : !(data as any[]).length ? <Empty title="Belum ada gambar" text="Gambar yang diunggah akan tampil di sini." /> : (
          <div class="panel-b" style={{ paddingTop: 0 }}>
            <div class="media-grid">
              {(data as any[]).map((m) => (
                <div class="media-card" key={m.id}>
                  <a class="thumb" href={m.url} target="_blank" rel="noopener" style={{ backgroundImage: `url("${m.url}")` }} aria-label="Buka gambar" />
                  <div class="meta" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <span title={m.alt ?? ''} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.alt || <em>Tanpa alt</em>}</span>
                    <span>{m.width ? `${m.width}×${m.height} · ` : ''}{fmtDate(m.created_at)}</span>
                    <span class="flex" style={{ gap: 2 }}>
                      <button class="btn btn-g btn-sm" onClick={() => copy(m.url)}>Salin URL</button>
                      <button class="btn btn-g btn-sm" onClick={() => editAlt(m)}>Alt</button>
                      <button class="btn btn-g btn-sm" style={{ color: 'var(--err)' }} onClick={() => remove(m)} aria-label="Hapus gambar">Hapus</button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Panel>
    </>
  );
}
