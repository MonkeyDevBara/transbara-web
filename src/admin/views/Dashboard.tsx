import { sb } from '../sb';
import { PageHead, Panel, Loading, ErrorState, Empty, useLoad, fmtDate } from '../ui';

async function load() {
  const count = async (table: string, f?: (b: any) => any) => {
    let b: any = sb.from(table).select('*', { count: 'exact', head: true });
    if (f) b = f(b);
    const { count: c, error } = await b;
    if (error) throw error;
    return c ?? 0;
  };
  const now = new Date().toISOString();
  const [published, scheduled, draft, unread, subs, recent, messages] = await Promise.all([
    count('articles', (b) => b.in('status', ['published', 'scheduled']).lte('published_at', now)),
    count('articles', (b) => b.in('status', ['published', 'scheduled']).gt('published_at', now)),
    count('articles', (b) => b.eq('status', 'draft')),
    count('contact_messages', (b) => b.eq('is_read', false)),
    count('newsletter_subscribers'),
    sb.from('articles').select('id, title, status, published_at, updated_at').order('updated_at', { ascending: false }).limit(6),
    sb.from('contact_messages').select('id, name, subject, created_at, is_read').order('created_at', { ascending: false }).limit(5),
  ]);
  if (recent.error) throw recent.error;
  if (messages.error) throw messages.error;
  return { published, scheduled, draft, unread, subs, recent: recent.data ?? [], messages: messages.data ?? [] };
}

export const statusOf = (a: { status: string; published_at: string | null }) => {
  if (a.status === 'draft') return { cls: 'st-draft', label: 'Draft' };
  if (a.published_at && new Date(a.published_at) > new Date()) return { cls: 'st-scheduled', label: 'Terjadwal' };
  return { cls: 'st-published', label: 'Terbit' };
};

export default function Dashboard() {
  const { data, loading, error, reload } = useLoad(load);
  return (
    <>
      <PageHead title="Ringkasan" desc="Gambaran singkat konten dan aktivitas terbaru." actions={<a class="btn btn-p" href="#/artikel/baru">+ Artikel baru</a>} />
      {loading ? <div class="panel"><Loading /></div> : error ? <div class="panel"><ErrorState text={error} retry={reload} /></div> : data && (
        <>
          <div class="grid grid-4" style={{ marginBottom: 16 }}>
            {[
              ['Artikel terbit', data.published, '#/artikel?status=terbit'],
              ['Draft', data.draft, '#/artikel?status=draft'],
              ['Terjadwal', data.scheduled, '#/artikel?status=terjadwal'],
              ['Pesan belum dibaca', data.unread, '#/pesan'],
            ].map(([l, n, href]) => (
              <a class="stat" href={href as string} key={l as string} style={{ textDecoration: 'none' }}><div class="n">{n}</div><div class="l">{l}</div></a>
            ))}
          </div>
          <div class="grid grid-2">
            <Panel title="Artikel terakhir diubah" actions={<a href="#/artikel" class="btn btn-g btn-sm">Semua</a>}>
              {data.recent.length === 0 ? <Empty title="Belum ada artikel" /> : (
                <table class="tbl"><tbody>
                  {data.recent.map((a: any) => {
                    const s = statusOf(a);
                    return (
                      <tr key={a.id} class="clickable" onClick={() => (location.hash = `#/artikel/${a.id}`)}>
                        <td><div class="title">{a.title}</div><div class="sub">Diubah {fmtDate(a.updated_at, true)}</div></td>
                        <td class="actions"><span class={`st ${s.cls}`}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody></table>
              )}
            </Panel>
            <Panel title="Pesan masuk terbaru" desc={`${data.subs} pelanggan newsletter`} actions={<a href="#/pesan" class="btn btn-g btn-sm">Semua</a>}>
              {data.messages.length === 0 ? <Empty title="Belum ada pesan" text="Pesan dari halaman Kontak akan muncul di sini." /> : (
                <table class="tbl"><tbody>
                  {data.messages.map((m: any) => (
                    <tr key={m.id} class="clickable" onClick={() => (location.hash = '#/pesan')}>
                      <td><div class="title">{m.subject}</div><div class="sub">{m.name} · {fmtDate(m.created_at, true)}</div></td>
                      <td class="actions">{!m.is_read && <span class="st st-scheduled">Baru</span>}</td>
                    </tr>
                  ))}
                </tbody></table>
              )}
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
