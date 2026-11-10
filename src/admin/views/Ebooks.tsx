import { useState } from 'preact/hooks';
import { sb, slugify, errMsg } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, TextField, Check, ImageField, SaveBtn, useLoad, useToast, useUnsavedGuard, q } from '../ui';

const BLANK = { title: '', slug: '', summary: '', tag: '', cover_url: '', url: '', is_published: true, sort_order: 0 };
type EbookForm = typeof BLANK & { id?: string };
type EbookRow = { id: string; title: string; slug: string; summary: string | null; tag: string | null; cover_url: string | null; url: string | null; is_published: boolean; sort_order: number };

export default function Ebooks() {
  const { data, loading, error, reload } = useLoad(() => q<EbookRow[]>(sb.from('ebooks').select('*').order('sort_order')));
  const [edit, setEdit] = useState<EbookForm | null>(null);
  const rows = data ?? [];
  if (edit) return <EbookForm init={edit} onDone={() => { setEdit(null); reload(); }} />;
  return (
    <>
      <PageHead title="E-Book" desc='Semua e-book yang dicentang "Tampilkan di situs" tampil di tab "E-Book" pada seksi Karya di Beranda (kartu potret: sampul, label, judul, deskripsi singkat; klik kartu membuka tautan).'
        actions={<button class="btn btn-p" onClick={() => setEdit({ ...BLANK, sort_order: rows.length + 1 })}>+ E-Book baru</button>} />
      <Panel>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : rows.length === 0 ? <Empty title="Belum ada e-book" /> : (
          <div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>E-Book</th><th>Status</th><th>Label</th><th></th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} class="clickable" onClick={() => setEdit({ ...BLANK, ...e, summary: e.summary ?? '', tag: e.tag ?? '', cover_url: e.cover_url ?? '', url: e.url ?? '' })}>
                  <td>
                    <div class="flex" style={{ gap: 12, alignItems: 'center' }}>
                      {e.cover_url && <img src={e.cover_url} alt="" width="36" height="48" style={{ objectFit: 'cover', borderRadius: 4, flex: 'none' }} />}
                      <div><div class="title">{e.sort_order}. {e.title}</div><div class="sub">{e.summary}</div></div>
                    </div>
                  </td>
                  <td><span class={`st ${e.is_published ? 'st-published' : 'st-draft'}`}>{e.is_published ? 'Tampil' : 'Disembunyikan'}</span></td>
                  <td>{e.tag ?? '–'}</td>
                  <td class="actions"><button class="btn btn-g btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </Panel>
    </>
  );
}

function EbookForm({ init, onDone }: { init: EbookForm; onDone: () => void }) {
  const toast = useToast();
  const [p, setP] = useState<EbookForm>(init);
  const [saved, setSaved] = useState(JSON.stringify(p));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(p) !== saved;
  useUnsavedGuard(dirty);
  const set = <K extends keyof EbookForm>(k: K, v: EbookForm[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = async (e: Event) => {
    e.preventDefault();
    if (!p.title.trim()) return toast('Judul e-book wajib diisi.', true);
    const blankToNull = (v: string) => (v.trim() ? v.trim() : null);
    const row = {
      title: p.title.trim(),
      slug: slugify(p.slug || p.title),
      summary: blankToNull(p.summary),
      tag: blankToNull(p.tag),
      cover_url: blankToNull(p.cover_url),
      url: blankToNull(p.url),
      is_published: p.is_published,
      sort_order: Number(p.sort_order) || 0,
    };
    setSaving(true);
    try {
      const res = p.id
        ? await q<EbookRow>(sb.from('ebooks').update(row).eq('id', p.id).select().single())
        : await q<EbookRow>(sb.from('ebooks').insert(row).select().single());
      setP({ ...p, id: res.id });
      setSaved(JSON.stringify({ ...p, id: res.id }));
      toast('E-Book disimpan.');
    } catch (err) { toast(errMsg(err), true); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!confirm(`Hapus e-book "${p.title}"?`)) return;
    const { error } = await sb.from('ebooks').delete().eq('id', p.id);
    if (error) return toast(errMsg(error), true);
    toast('E-Book dihapus.'); onDone();
  };
  const back = () => { if (!dirty || confirm('Perubahan belum disimpan. Tetap kembali?')) onDone(); };

  return (
    <form onSubmit={save}>
      <PageHead crumb={<><a href="#/ebook" onClick={(e) => { e.preventDefault(); back(); }}>E-Book</a> / {p.id ? 'Edit' : 'Baru'}</>}
        title={p.title || 'E-Book baru'} actions={<>{dirty && <span class="st st-scheduled">Belum disimpan</span>}<button type="button" class="btn btn-s" onClick={back}>Kembali</button><SaveBtn saving={saving} dirty={dirty} /></>} />
      <div class="split">
        <Panel>
          <div class="panel-b">
            <div class="grid grid-2" style={{ gap: 12 }}>
              <TextField label="Judul e-book" value={p.title} onInput={(v) => setP((x) => ({ ...x, title: v, slug: x.id ? x.slug : slugify(v) }))} />
              <TextField label="Slug" value={p.slug} onInput={(v) => set('slug', v)} />
            </div>
            <TextField label="Deskripsi singkat (tampil di kartu Beranda)" value={p.summary} onInput={(v) => set('summary', v)} multiline rows={3} />
            <TextField label="Label di pojok sampul" value={p.tag} onInput={(v) => set('tag', v)} placeholder="Mis. E-Book · PDF" help="Kosongkan bila tidak perlu label." />
            <TextField label="Tautan e-book" value={p.url} onInput={(v) => set('url', v)} type="url" placeholder="https://" help="Tujuan saat kartu diklik (PDF, Google Drive, toko, dll.). Kosongkan bila belum ada; kartu tampil tanpa tautan." />
          </div>
        </Panel>
        <div>
          <Panel title="Tampilan">
            <div class="panel-b">
              <Check label="Tampilkan di situs" checked={p.is_published} onChange={(v) => set('is_published', v)} />
              <TextField label="Nomor urut" type="number" value={String(p.sort_order)} onInput={(v) => set('sort_order', Number(v) || 0)} />
            </div>
          </Panel>
          <Panel title="Sampul"><div class="panel-b"><ImageField label="Sampul e-book (potret)" value={p.cover_url} onChange={(v) => set('cover_url', v)} help="Gunakan rasio 3:4 (mis. 900×1200 px) agar pas di kartu. Kosongkan untuk menampilkan judul saja." /></div></Panel>
          {p.id && <button type="button" class="btn btn-d" onClick={remove}>Hapus e-book</button>}
        </div>
      </div>
    </form>
  );
}
