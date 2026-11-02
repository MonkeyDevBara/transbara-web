import { useState } from 'preact/hooks';
import { sb, slugify, errMsg } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, TextField, SelectField, Check, ImageField, StringsField, SaveBtn, useLoad, useToast, useUnsavedGuard, q } from '../ui';

const STATUS = [
  { value: 'active', label: 'Aktif (tampil di daftar proyek)' },
  { value: 'exploring', label: 'Sedang dieksplorasi' },
  { value: 'archived', label: 'Arsip (tidak tampil)' },
];
const BLANK = { name: '', slug: '', summary: '', description: '', role: '', contributions: [] as string[], logo_url: '', url: '', status: 'active', is_featured: false, is_published: true, sort_order: 0 };

export default function Projects() {
  const { data, loading, error, reload } = useLoad(() => q(sb.from('projects').select('*').order('sort_order')));
  const [edit, setEdit] = useState<any | null>(null);
  const rows = (data as any[]) ?? [];
  if (edit) return <ProjectForm init={edit} onDone={() => { setEdit(null); reload(); }} />;
  return (
    <>
      <PageHead title="Proyek" desc='Semua proyek yang dicentang "Tampilkan di situs" dan tidak berstatus Diarsipkan tampil di tab "Proyek Lainnya" pada Beranda (kartu: logo, nama, peran, deskripsi singkat, tombol Kunjungi). Proyek "Unggulan" tampil lebih dulu.'
        actions={<button class="btn btn-p" onClick={() => setEdit({ ...BLANK, sort_order: rows.length + 1 })}>+ Proyek baru</button>} />
      <Panel>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : rows.length === 0 ? <Empty title="Belum ada proyek" /> : (
          <div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Proyek</th><th>Status</th><th>Peran</th><th></th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} class="clickable" onClick={() => setEdit(p)}>
                  <td><div class="title">{p.sort_order}. {p.name}</div><div class="sub">{p.summary}</div></td>
                  <td>
                    <span class={`st ${p.status === 'active' ? 'st-published' : p.status === 'exploring' ? 'st-info' : 'st-draft'}`}>{STATUS.find((s) => s.value === p.status)?.label.split(' (')[0]}</span>
                    {p.is_featured && <span class="tag" style={{ marginLeft: 6 }}>Unggulan</span>}
                    {!p.is_published && <span class="tag" style={{ marginLeft: 6 }}>Disembunyikan</span>}
                  </td>
                  <td>{p.role ?? '–'}</td>
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

function ProjectForm({ init, onDone }: { init: any; onDone: () => void }) {
  const toast = useToast();
  const [p, setP] = useState<any>(() => {
    const v = { ...BLANK, ...init };
    for (const k of Object.keys(BLANK)) if (v[k] === null) v[k] = (BLANK as any)[k];
    return v;
  });
  const [saved, setSaved] = useState(JSON.stringify(p));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(p) !== saved;
  useUnsavedGuard(dirty);
  const set = (k: string, v: any) => setP((x: any) => ({ ...x, [k]: v }));

  const save = async (e: Event) => {
    e.preventDefault();
    if (!p.name.trim()) return toast('Nama proyek wajib diisi.', true);
    const row: any = {};
    for (const k of Object.keys(BLANK)) row[k] = typeof p[k] === 'string' && !p[k].trim() ? null : p[k];
    row.name = p.name.trim();
    row.slug = slugify(p.slug || p.name);
    row.status = p.status;
    row.sort_order = Number(p.sort_order) || 0;
    row.contributions = (p.contributions ?? []).filter((c: string) => c.trim());
    setSaving(true);
    try {
      const res: any = p.id
        ? await q(sb.from('projects').update(row).eq('id', p.id).select().single())
        : await q(sb.from('projects').insert(row).select().single());
      if (row.is_featured) await q(sb.from('projects').update({ is_featured: false }).neq('id', res.id).eq('is_featured', true));
      setP({ ...p, id: res.id });
      setSaved(JSON.stringify({ ...p, id: res.id }));
      toast('Proyek disimpan.');
    } catch (err) { toast(errMsg(err), true); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!confirm(`Hapus proyek "${p.name}"?`)) return;
    const { error } = await sb.from('projects').delete().eq('id', p.id);
    if (error) return toast(errMsg(error), true);
    toast('Proyek dihapus.'); onDone();
  };
  const back = () => { if (!dirty || confirm('Perubahan belum disimpan. Tetap kembali?')) onDone(); };

  return (
    <form onSubmit={save}>
      <PageHead crumb={<><a href="#/proyek" onClick={(e) => { e.preventDefault(); back(); }}>Proyek</a> / {p.id ? 'Edit' : 'Baru'}</>}
        title={p.name || 'Proyek baru'} actions={<>{dirty && <span class="st st-scheduled">Belum disimpan</span>}<button type="button" class="btn btn-s" onClick={back}>Kembali</button><SaveBtn saving={saving} dirty={dirty} /></>} />
      <div class="split">
        <Panel>
          <div class="panel-b">
            <div class="grid grid-2" style={{ gap: 12 }}>
              <TextField label="Nama proyek" value={p.name} onInput={(v) => setP((x: any) => ({ ...x, name: v, slug: x.id ? x.slug : slugify(v) }))} />
              <TextField label="Slug" value={p.slug} onInput={(v) => set('slug', v)} />
            </div>
            <TextField label="Deskripsi singkat (tampil di kartu Beranda)" value={p.summary} onInput={(v) => set('summary', v)} />
            <TextField label="Deskripsi" value={p.description} onInput={(v) => set('description', v)} multiline rows={5} />
            <TextField label="Peran Anda" value={p.role} onInput={(v) => set('role', v)} placeholder="Mis. Founder" help="Tampil sebagai label di kartu Beranda." />
            <StringsField label="Peran dan kontribusi" value={p.contributions} onChange={(v) => set('contributions', v)} help="Tampil sebagai daftar di halaman Proyek." />
            <TextField label="Tautan proyek" value={p.url} onInput={(v) => set('url', v)} type="url" placeholder="https://" help="Tujuan tombol Kunjungi di kartu Beranda. Kosongkan bila belum ada (tombol tidak tampil)." />
          </div>
        </Panel>
        <div>
          <Panel title="Tampilan">
            <div class="panel-b">
              <SelectField label="Status" value={p.status} onChange={(v) => set('status', v)} options={STATUS} />
              <Check label="Unggulan (tampil lebih dulu di Beranda)" checked={p.is_featured} onChange={(v) => set('is_featured', v)} />
              <Check label="Tampilkan di situs" checked={p.is_published} onChange={(v) => set('is_published', v)} />
              <TextField label="Nomor urut" type="number" value={String(p.sort_order)} onInput={(v) => set('sort_order', v)} />
            </div>
          </Panel>
          <Panel title="Logo"><div class="panel-b"><ImageField label="Logo proyek" value={p.logo_url} onChange={(v) => set('logo_url', v)} help="Kosongkan untuk menampilkan nama proyek." /></div></Panel>
          {p.id && <button type="button" class="btn btn-d" onClick={remove}>Hapus proyek</button>}
        </div>
      </div>
    </form>
  );
}
