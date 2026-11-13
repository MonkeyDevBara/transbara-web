import { useState } from 'preact/hooks';
import { sb } from '../sb';
import { Panel, Loading, ErrorState, Empty, useLoad, q } from '../ui';

type Overview = {
  days: number;
  views: number; visitors: number; prev_views: number; prev_visitors: number;
  today_views: number; today_visitors: number;
  daily: { day: string; views: number; visitors: number }[];
  pages: { path: string; views: number; visitors: number }[];
  referrers: { host: string; views: number }[];
  devices: { device: string; views: number }[];
};

const RANGES = [7, 30, 90] as const;
const DEVICE_LABEL: Record<string, string> = { desktop: 'Desktop', mobile: 'Ponsel', tablet: 'Tablet' };

const nf = new Intl.NumberFormat('id-ID');
const dayLabel = (iso: string) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

/** Batas atas sumbu Y yang "bulat" (1, 2, 5 × 10^n). */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

async function load(days: number): Promise<Overview> {
  const data = await q(sb.rpc('analytics_overview', { p_days: days }));
  return data as unknown as Overview;
}

function Delta({ cur, prev }: { cur: number; prev: number }) {
  if (prev === 0) return <div class="l">{cur > 0 ? 'Belum ada pembanding' : 'Belum ada data'}</div>;
  const pct = Math.round(((cur - prev) / prev) * 100);
  const color = pct > 0 ? 'var(--ok)' : pct < 0 ? 'var(--err)' : 'var(--muted)';
  return <div class="l"><span style={{ color, fontWeight: 600 }}>{pct > 0 ? '▲' : pct < 0 ? '▼' : '='} {Math.abs(pct)}%</span> dari periode sebelumnya</div>;
}

function Chart({ daily }: { daily: Overview['daily'] }) {
  const W = 720, H = 220, L = 40, R = 8, T = 10, B = 24;
  const max = niceMax(Math.max(1, ...daily.map((d) => d.views)));
  const pw = W - L - R, ph = H - T - B;
  const slot = pw / daily.length;
  const bw = Math.max(1, slot * 0.7);
  const y = (v: number) => T + ph - (v / max) * ph;
  const cx = (i: number) => L + slot * i + slot / 2;
  const line = daily.map((d, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)},${y(d.visitors).toFixed(1)}`).join(' ');
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  const labelAt = [0, Math.floor((daily.length - 1) / 2), daily.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik tampilan halaman dan pengunjung per hari" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" stroke-width="1" />
          <text x={L - 6} y={y(t) + 4} text-anchor="end" font-size="11" fill="var(--muted)">{nf.format(t)}</text>
        </g>
      ))}
      {daily.map((d, i) => (
        <rect key={d.day} x={cx(i) - bw / 2} y={y(d.views)} width={bw} height={Math.max(0, T + ph - y(d.views))} rx="1.5" fill="var(--navy)" opacity="0.85">
          <title>{`${dayLabel(d.day)}: ${nf.format(d.views)} tampilan, ${nf.format(d.visitors)} pengunjung`}</title>
        </rect>
      ))}
      <path d={line} fill="none" stroke="var(--gold)" stroke-width="2" stroke-linejoin="round" />
      {labelAt.map((i, k) => (
        <text key={i} x={cx(i)} y={H - 6} font-size="11" fill="var(--muted)" text-anchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'}>{dayLabel(daily[i].day)}</text>
      ))}
    </svg>
  );
}

function Bars({ rows, empty }: { rows: { label: string; value: number; sub?: string }[]; empty: string }) {
  if (rows.length === 0) return <Empty title={empty} />;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div class="panel-b" style={{ display: 'grid', gap: 10 }}>
      {rows.map((r) => (
        <div key={r.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--navy)', fontWeight: 600 }} title={r.label}>{r.label}</span>
            <span style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{nf.format(r.value)}{r.sub ? ` · ${r.sub}` : ''}</span>
          </div>
          <div style={{ height: 6, background: 'var(--blue-soft)', borderRadius: 3, marginTop: 4 }}>
            <div style={{ height: '100%', width: `${(r.value / max) * 100}%`, background: 'var(--navy)', borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Traffic() {
  const [days, setDays] = useState<number>(30);
  const { data, loading, error, reload } = useLoad(() => load(days), [days]);
  // Migrasi belum dijalankan: beri petunjuk, bukan pesan teknis mentah.
  const notReady = !!error && /analytics_overview|schema cache|page_views/i.test(error);

  const tabs = (
    <div class="tabs" role="tablist" aria-label="Rentang waktu">
      {RANGES.map((n) => <button key={n} role="tab" aria-selected={days === n} class={days === n ? 'on' : ''} onClick={() => setDays(n)}>{n} hari</button>)}
    </div>
  );
  const totalViews = data ? data.devices.reduce((s, d) => s + d.views, 0) : 0;

  return (
    <Panel title="Traffic kunjungan" desc="Halaman publik saja. Admin yang sedang login, bot, dan Do Not Track tidak dihitung." actions={tabs}>
      {loading && !data ? <Loading rows={5} /> : notReady ? (
        <Empty title="Statistik belum aktif" text="Jalankan file supabase/migrations/20261113000000_page_views.sql di SQL Editor Supabase, lalu muat ulang halaman ini." />
      ) : error ? <ErrorState text={error} retry={reload} /> : data && (
        <div class="panel-b" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .15s' }}>
          <div class="grid grid-4" style={{ marginBottom: 18 }}>
            <div class="stat"><div class="n">{nf.format(data.views)}</div><div class="l">Tampilan halaman · {data.days} hari</div><Delta cur={data.views} prev={data.prev_views} /></div>
            <div class="stat"><div class="n">{nf.format(data.visitors)}</div><div class="l">Pengunjung · {data.days} hari</div><Delta cur={data.visitors} prev={data.prev_visitors} /></div>
            <div class="stat"><div class="n">{nf.format(data.today_views)}</div><div class="l">Tampilan hari ini</div></div>
            <div class="stat"><div class="n">{nf.format(data.today_visitors)}</div><div class="l">Pengunjung hari ini</div></div>
          </div>

          {data.views === 0 ? (
            <Empty title="Belum ada kunjungan tercatat" text="Kunjungan baru akan muncul di sini setelah ada yang membuka situs." />
          ) : (
            <>
              <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--muted)', marginBottom: 6 }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--navy)', borderRadius: 2, marginRight: 6 }} />Tampilan halaman</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 3, background: 'var(--gold)', marginRight: 6, verticalAlign: 'middle' }} />Pengunjung</span>
              </div>
              <Chart daily={data.daily} />
            </>
          )}
        </div>
      )}
      {data && data.views > 0 && !notReady && !error && (
        <div class="grid grid-3" style={{ borderTop: '1px solid var(--line)' }}>
          <div>
            <div class="panel-h"><h2>Halaman terpopuler</h2></div>
            <Bars empty="Belum ada data" rows={data.pages.map((p) => ({ label: p.path, value: p.views, sub: `${nf.format(p.visitors)} pengunjung` }))} />
          </div>
          <div>
            <div class="panel-h"><h2>Sumber kunjungan</h2></div>
            <Bars empty="Belum ada rujukan dari situs lain" rows={data.referrers.map((r) => ({ label: r.host, value: r.views }))} />
          </div>
          <div>
            <div class="panel-h"><h2>Perangkat</h2></div>
            <Bars empty="Belum ada data" rows={data.devices.map((d) => ({ label: DEVICE_LABEL[d.device] ?? d.device, value: d.views, sub: `${Math.round((d.views / totalViews) * 100)}%` }))} />
          </div>
        </div>
      )}
    </Panel>
  );
}
