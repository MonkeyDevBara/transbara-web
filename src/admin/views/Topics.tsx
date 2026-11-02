import { useEffect, useState } from 'preact/hooks';
import { sb, errMsg } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, SaveBtn, useLoad, useToast, useUnsavedGuard, q } from '../ui';

type Topic = { id?: string; title: string; description: string; is_signature: boolean; sort_order: number };

export default function Topics() {
  const { data, loading, error, reload } = useLoad(() => q(sb.from('speaking_topics').select('*').order('sort_order')));
  return (
    <>
      <PageHead title="Topik Bicara" desc='Daftar topik di seksi "Topik yang Saya Bicarakan". Topik andalan ditampilkan paling menonjol.'
        actions={<a class="btn btn-s" href="#/beranda">Ubah judul seksi</a>} />
      {loading ? <div class="panel"><Loading /></div> : error ? <div class="panel"><ErrorState text={error} retry={reload} /></div>
        : <TopicsForm init={(data as any[]).map((t) => ({ ...t, description: t.description ?? '' }))} reload={reload} />}
    </>
  );
}

function TopicsForm({ init, reload }: { init: Topic[]; reload: () => void }) {
  const toast = useToast();
  const [items, setItems] = useState<Topic[]>(init);
  const [saved, setSaved] = useState(JSON.stringify(init));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(items) !== saved;
  useUnsavedGuard(dirty);
  useEffect(() => { setItems(init); setSaved(JSON.stringify(init)); }, [init]);

  const set = (i: number, patch: Partial<Topic>) => setItems((x) => x.map((t, j) => (j === i ? { ...t, ...patch } : patch.is_signature ? { ...t, is_signature: false } : t)));
  const move = (i: number, d: number) => setItems((x) => { const a = [...x]; const [t] = a.splice(i, 1); a.splice(i + d, 0, t); return a; });

  const save = async () => {
    if (items.some((t) => !t.title.trim())) return toast('Judul topik tidak boleh kosong.', true);
    setSaving(true);
    try {
      const keep = items.filter((t) => t.id).map((t) => t.id!);
      const removed = (JSON.parse(saved) as Topic[]).filter((t) => t.id && !keep.includes(t.id));
      if (removed.length) await q(sb.from('speaking_topics').delete().in('id', removed.map((t) => t.id!)));
      for (const [i, t] of items.entries()) {
        const row = { title: t.title.trim(), description: t.description.trim() || null, is_signature: t.is_signature, sort_order: i + 1 };
        if (t.id) await q(sb.from('speaking_topics').update(row).eq('id', t.id));
        else await q(sb.from('speaking_topics').insert(row));
      }
      toast('Topik disimpan.');
      reload();
    } catch (e) { toast(errMsg(e), true); }
    finally { setSaving(false); }
  };

  return (
    <Panel footer={<>{dirty && <span class="st st-scheduled" style={{ marginRight: 'auto' }}>Belum disimpan</span>}
      <button class="btn btn-s" onClick={() => setItems((x) => [...x, { title: '', description: '', is_signature: false, sort_order: x.length + 1 }])}>+ Topik baru</button>
      <SaveBtn saving={saving} dirty={dirty} onClick={save} /></>}>
      <div class="panel-b">
        {items.length === 0 ? <Empty title="Belum ada topik" text="Tambahkan topik yang siap Anda bawakan." /> : items.map((t, i) => (
          <div class="list-item" key={t.id ?? `new-${i}`}>
            <div class="list-item-h">
              <span>Topik {i + 1} {t.is_signature && <span class="tag">Topik andalan</span>}</span>
              <span class="flex">
                <button class="btn btn-s btn-sm btn-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naikkan">↑</button>
                <button class="btn btn-s btn-sm btn-icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Turunkan">↓</button>
                <button class="btn btn-d btn-sm" onClick={() => setItems((x) => x.filter((_, j) => j !== i))}>Hapus</button>
              </span>
            </div>
            <div class="fld"><label for={`t-${i}`}>Judul</label><input id={`t-${i}`} class="inp" value={t.title} onInput={(e) => set(i, { title: e.currentTarget.value })} /></div>
            <div class="fld"><label for={`d-${i}`}>Deskripsi singkat</label><textarea id={`d-${i}`} class="inp" rows={2} value={t.description} onInput={(e) => set(i, { description: e.currentTarget.value })} /></div>
            <label class="chk"><input type="radio" name="signature" checked={t.is_signature} onChange={() => set(i, { is_signature: true })} />Jadikan topik andalan</label>
          </div>
        ))}
      </div>
    </Panel>
  );
}
