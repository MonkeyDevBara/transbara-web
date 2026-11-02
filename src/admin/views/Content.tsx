import { useState } from 'preact/hooks';
import { SECTIONS, DEFAULTS, type Section } from '../../lib/content';
import { sb, errMsg } from '../sb';
import { PageHead, SchemaFields, SaveBtn, Loading, ErrorState, useLoad, useToast, useUnsavedGuard, q } from '../ui';

/** Form konten berbasis skema. group 'beranda' = seksi landing page, 'global' = pengaturan website. */
export default function ContentView({ group }: { group: 'beranda' | 'global' }) {
  const sections = SECTIONS.filter((s) => s.group === group);
  const { data, loading, error, reload } = useLoad(() => q(sb.from('site_settings').select('key, value')), [group]);
  const stored = Object.fromEntries(((data as any[]) ?? []).map((r) => [r.key, r.value]));

  return (
    <>
      <PageHead
        title={group === 'beranda' ? 'Halaman Beranda' : 'Pengaturan Website'}
        desc={group === 'beranda'
          ? 'Semua teks dan gambar di landing page, dari header sampai footer, berurutan sesuai tampilannya.'
          : 'Identitas situs, SEO bawaan, email kontak, dan tautan sosial media.'}
        actions={<a class="btn btn-s" href="/" target="_blank" rel="noopener">Lihat situs ↗</a>}
      />
      {loading ? <div class="panel"><Loading rows={6} /></div>
        : error ? <div class="panel"><ErrorState text={error} retry={reload} /></div>
        : sections.map((s, i) => <SectionForm key={s.key} section={s} stored={stored[s.key]} defaultOpen={i === 0} />)}
    </>
  );
}

function SectionForm({ section, stored, defaultOpen }: { section: Section; stored: any; defaultOpen: boolean }) {
  const toast = useToast();
  const initial = { ...(DEFAULTS as any)[section.key], ...(stored ?? {}) };
  const [value, setValue] = useState<Record<string, any>>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [open, setOpen] = useState(defaultOpen);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(value) !== saved;
  useUnsavedGuard(dirty);

  const save = async (e: Event) => {
    e.preventDefault();
    setSaving(true);
    // Simpan hanya field yang ada di skema (bersihkan sisa field lama).
    const clean = Object.fromEntries(section.fields.map((f) => [f.key, value[f.key] ?? null]));
    const { error } = await sb.from('site_settings').upsert({ key: section.key, value: clean });
    setSaving(false);
    if (error) return toast(errMsg(error), true);
    setSaved(JSON.stringify(value));
    toast(`${section.title} disimpan.`);
  };
  const reset = () => setValue({ ...(DEFAULTS as any)[section.key] });

  return (
    <form class={`panel collapsible ${open ? 'open' : ''}`} onSubmit={save}>
      <div class="panel-h" onClick={() => setOpen(!open)} role="button" tabIndex={0} aria-expanded={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(!open))}>
        <div>
          <h2>{section.title}{dirty && <span class="st st-scheduled">Belum disimpan</span>}</h2>
          {section.description && <p>{section.description}</p>}
        </div>
        <span class="chev" aria-hidden="true">▾</span>
      </div>
      {open && (
        <>
          <div class="panel-b">
            <SchemaFields fields={section.fields} value={value} onChange={setValue} />
            {section.manage && <div class="alert info mt">Data berulang untuk seksi ini dikelola terpisah. <a href={section.manage.route}>{section.manage.label} →</a></div>}
          </div>
          <div class="panel-f">
            <button type="button" class="btn btn-g" onClick={reset}>Kembalikan teks bawaan</button>
            {dirty && <button type="button" class="btn btn-s" onClick={() => setValue(JSON.parse(saved))}>Batalkan perubahan</button>}
            <SaveBtn saving={saving} dirty={dirty} />
          </div>
        </>
      )}
    </form>
  );
}
