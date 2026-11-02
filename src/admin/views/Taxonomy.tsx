import { useState } from 'preact/hooks';
import { sb, slugify, errMsg } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, useLoad, useToast, q } from '../ui';

async function load() {
  const [cats, tags, arts, at] = await Promise.all([
    q(sb.from('categories').select('*').order('sort_order')),
    q(sb.from('tags').select('*').order('name')),
    q(sb.from('articles').select('category_id')),
    q(sb.from('article_tags').select('tag_id')),
  ]);
  const catCount: Record<string, number> = {};
  for (const a of arts as any[]) if (a.category_id) catCount[a.category_id] = (catCount[a.category_id] ?? 0) + 1;
  const tagCount: Record<string, number> = {};
  for (const t of at as any[]) tagCount[t.tag_id] = (tagCount[t.tag_id] ?? 0) + 1;
  return { cats: cats as any[], tags: tags as any[], catCount, tagCount };
}

export default function Taxonomy() {
  const { data, loading, error, reload } = useLoad(load);
  return (
    <>
      <PageHead title="Kategori & Tag" desc="Kategori tampil sebagai filter di halaman Artikel. Urutan kategori mengikuti nomor urut." />
      {loading ? <div class="panel"><Loading /></div> : error ? <div class="panel"><ErrorState text={error} retry={reload} /></div> : data && (
        <div class="grid grid-2" style={{ alignItems: 'start' }}>
          <Panel title="Kategori"><Categories rows={data.cats} counts={data.catCount} reload={reload} /></Panel>
          <Panel title="Tag"><Tags rows={data.tags} counts={data.tagCount} reload={reload} /></Panel>
        </div>
      )}
    </>
  );
}

function Categories({ rows, counts, reload }: { rows: any[]; counts: Record<string, number>; reload: () => void }) {
  const toast = useToast();
  const [edit, setEdit] = useState<any | null>(null);
  const save = async (e: Event) => {
    e.preventDefault();
    if (!edit.name.trim()) return toast('Nama kategori wajib diisi.', true);
    const row = { name: edit.name.trim(), slug: slugify(edit.slug || edit.name), description: edit.description || null, sort_order: Number(edit.sort_order) || 0 };
    const { error } = edit.id ? await sb.from('categories').update(row).eq('id', edit.id) : await sb.from('categories').insert(row);
    if (error) return toast(errMsg(error), true);
    toast('Kategori disimpan.'); setEdit(null); reload();
  };
  const remove = async (c: any) => {
    if (!confirm(`Hapus kategori "${c.name}"? Artikel di dalamnya menjadi tanpa kategori.`)) return;
    const { error } = await sb.from('categories').delete().eq('id', c.id);
    if (error) return toast(errMsg(error), true);
    toast('Kategori dihapus.'); reload();
  };
  return (
    <>
      {rows.length === 0 ? <Empty title="Belum ada kategori" /> : (
        <table class="tbl"><tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td><div class="title">{c.sort_order}. {c.name}</div><div class="sub">/{c.slug} · {counts[c.id] ?? 0} artikel</div></td>
              <td class="actions">
                <button class="btn btn-g btn-sm" onClick={() => setEdit({ ...c, description: c.description ?? '' })}>Edit</button>
                <button class="btn btn-g btn-sm" style={{ color: 'var(--err)' }} onClick={() => remove(c)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody></table>
      )}
      {edit ? (
        <form class="panel-b" style={{ borderTop: '1px solid var(--line)' }} onSubmit={save}>
          <div class="grid grid-2" style={{ gap: 10 }}>
            <div class="fld"><label for="c-name">Nama</label><input id="c-name" class="inp" value={edit.name} onInput={(e) => setEdit({ ...edit, name: e.currentTarget.value, slug: edit.id ? edit.slug : slugify(e.currentTarget.value) })} /></div>
            <div class="fld"><label for="c-slug">Slug</label><input id="c-slug" class="inp" value={edit.slug} onInput={(e) => setEdit({ ...edit, slug: e.currentTarget.value })} /></div>
          </div>
          <div class="fld"><label for="c-desc">Deskripsi</label><input id="c-desc" class="inp" value={edit.description} onInput={(e) => setEdit({ ...edit, description: e.currentTarget.value })} /></div>
          <div class="fld"><label for="c-ord">Nomor urut</label><input id="c-ord" class="inp" type="number" value={edit.sort_order} onInput={(e) => setEdit({ ...edit, sort_order: e.currentTarget.value })} style={{ maxWidth: 120 }} /></div>
          <div class="flex"><button class="btn btn-p">Simpan</button><button type="button" class="btn btn-s" onClick={() => setEdit(null)}>Batal</button></div>
        </form>
      ) : (
        <div class="panel-f"><button class="btn btn-s" onClick={() => setEdit({ name: '', slug: '', description: '', sort_order: rows.length + 1 })}>+ Kategori baru</button></div>
      )}
    </>
  );
}

function Tags({ rows, counts, reload }: { rows: any[]; counts: Record<string, number>; reload: () => void }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const add = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await sb.from('tags').insert({ name: name.trim(), slug: slugify(name) });
    if (error) return toast(errMsg(error), true);
    setName(''); toast('Tag ditambahkan.'); reload();
  };
  const rename = async (t: any) => {
    const n = prompt('Nama tag baru', t.name)?.trim();
    if (!n || n === t.name) return;
    const { error } = await sb.from('tags').update({ name: n, slug: slugify(n) }).eq('id', t.id);
    if (error) return toast(errMsg(error), true);
    toast('Tag diubah.'); reload();
  };
  const remove = async (t: any) => {
    if (!confirm(`Hapus tag "${t.name}"?`)) return;
    const { error } = await sb.from('tags').delete().eq('id', t.id);
    if (error) return toast(errMsg(error), true);
    toast('Tag dihapus.'); reload();
  };
  return (
    <>
      {rows.length === 0 ? <Empty title="Belum ada tag" /> : (
        <table class="tbl"><tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td><span class="title">{t.name}</span> <span class="sub">· {counts[t.id] ?? 0} artikel</span></td>
              <td class="actions">
                <button class="btn btn-g btn-sm" onClick={() => rename(t)}>Ubah</button>
                <button class="btn btn-g btn-sm" style={{ color: 'var(--err)' }} onClick={() => remove(t)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody></table>
      )}
      <form class="panel-f" onSubmit={add} style={{ justifyContent: 'stretch' }}>
        <input class="inp" placeholder="Nama tag baru" aria-label="Nama tag baru" value={name} onInput={(e) => setName(e.currentTarget.value)} />
        <button class="btn btn-s">Tambah</button>
      </form>
    </>
  );
}
