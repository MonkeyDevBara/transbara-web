import { useMemo, useState } from 'preact/hooks';
import { sb, errMsg } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, useLoad, useToast, fmtDate, q } from '../ui';

const PURPOSE: Record<string, string> = {
  undangan_berbicara: 'Undangan berbicara',
  diskusi_pendidikan: 'Diskusi pendidikan',
  kolaborasi: 'Kolaborasi',
  lainnya: 'Lainnya',
};

export function Messages({ onChange }: { onChange: () => void }) {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(() => q(sb.from('contact_messages').select('*').order('created_at', { ascending: false })));
  const [filter, setFilter] = useState<'semua' | 'baru' | string>('semua');
  const [open, setOpen] = useState<string | null>(null);
  const rows = useMemo(() => ((data as any[]) ?? []).filter((m) => filter === 'semua' || (filter === 'baru' ? !m.is_read : m.purpose === filter)), [data, filter]);

  const setRead = async (m: any, is_read: boolean) => {
    const { error } = await sb.from('contact_messages').update({ is_read }).eq('id', m.id);
    if (error) return toast(errMsg(error), true);
    m.is_read = is_read; onChange(); reload();
  };
  const toggle = (m: any) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.is_read) setRead(m, true);
  };
  const remove = async (m: any) => {
    if (!confirm(`Hapus pesan dari ${m.name}?`)) return;
    const { error } = await sb.from('contact_messages').delete().eq('id', m.id);
    if (error) return toast(errMsg(error), true);
    toast('Pesan dihapus.'); onChange(); reload();
  };

  return (
    <>
      <PageHead title="Pesan Masuk" desc="Pesan dari formulir di halaman Kontak." />
      <Panel>
        <div class="toolbar">
          <div class="tabs">
            {[['semua', 'Semua'], ['baru', 'Belum dibaca'], ...Object.entries(PURPOSE)].map(([k, l]) => (
              <button key={k} class={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : rows.length === 0 ? <Empty title="Tidak ada pesan" text="Pesan baru akan muncul di sini." /> : (
          <div class="tbl-wrap"><table class="tbl"><tbody>
            {rows.map((m) => [
              <tr key={m.id} class="clickable" onClick={() => toggle(m)} aria-expanded={open === m.id}>
                <td style={{ width: 12 }}>{!m.is_read && <span class="st st-scheduled" title="Belum dibaca" style={{ padding: '2px 4px' }} />}</td>
                <td><div class="title" style={{ fontWeight: m.is_read ? 500 : 700 }}>{m.subject}</div><div class="sub">{m.name} · {m.email}</div></td>
                <td><span class="tag">{PURPOSE[m.purpose] ?? m.purpose}</span></td>
                <td class="sub" style={{ whiteSpace: 'nowrap' }}>{fmtDate(m.created_at, true)}</td>
              </tr>,
              open === m.id && (
                <tr key={`${m.id}-b`}><td /><td colSpan={3}>
                  <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 12px' }}>{m.message}</p>
                  <div class="flex">
                    <a class="btn btn-p btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}>Balas via email</a>
                    <button class="btn btn-s btn-sm" onClick={() => setRead(m, false)}>Tandai belum dibaca</button>
                    <button class="btn btn-d btn-sm" onClick={() => remove(m)}>Hapus</button>
                  </div>
                </td></tr>
              ),
            ])}
          </tbody></table></div>
        )}
      </Panel>
    </>
  );
}

export function Newsletter() {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(() => q(sb.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })));
  const rows = (data as any[]) ?? [];
  const exportCsv = () => {
    const csv = 'email,tanggal_daftar\n' + rows.map((r) => `${r.email},${r.created_at}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const remove = async (r: any) => {
    if (!confirm(`Hapus ${r.email} dari daftar?`)) return;
    const { error } = await sb.from('newsletter_subscribers').delete().eq('id', r.id);
    if (error) return toast(errMsg(error), true);
    toast('Pelanggan dihapus.'); reload();
  };
  return (
    <>
      <PageHead title="Newsletter" desc={`${rows.length} pelanggan terdaftar dari form newsletter di situs.`} actions={<button class="btn btn-s" disabled={!rows.length} onClick={exportCsv}>Ekspor CSV</button>} />
      <Panel>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : rows.length === 0 ? <Empty title="Belum ada pelanggan" /> : (
          <table class="tbl"><thead><tr><th>Email</th><th>Tanggal daftar</th><th /></tr></thead><tbody>
            {rows.map((r) => (
              <tr key={r.id}><td>{r.email}</td><td class="sub">{fmtDate(r.created_at, true)}</td>
                <td class="actions"><button class="btn btn-g btn-sm" style={{ color: 'var(--err)' }} onClick={() => remove(r)}>Hapus</button></td></tr>
            ))}
          </tbody></table>
        )}
      </Panel>
    </>
  );
}
