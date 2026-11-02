import { useMemo, useRef, useState } from 'preact/hooks';
import { sb, slugify, uploadImage, errMsg } from '../sb';
import { renderArticle } from '../../lib/markdown';
import {
  PageHead, Panel, Loading, ErrorState, Empty, TextField, SelectField, Check, ImageField, SaveBtn,
  MediaPicker, useLoad, useToast, useUnsavedGuard, fmtDate, q,
} from '../ui';
import { statusOf } from './Dashboard';

// ---------------- Daftar artikel ----------------
const TABS = [
  { key: '', label: 'Semua' },
  { key: 'terbit', label: 'Terbit' },
  { key: 'draft', label: 'Draft' },
  { key: 'terjadwal', label: 'Terjadwal' },
];

export function ArticleList({ query }: { query: URLSearchParams }) {
  const [tab, setTab] = useState(query.get('status') ?? '');
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useLoad(() =>
    q(sb.from('articles').select('id, title, slug, status, published_at, updated_at, is_featured, is_sample, category:categories(name)').order('updated_at', { ascending: false })),
  );
  const rows = useMemo(() => ((data as any[]) ?? []).filter((a) => {
    const s = statusOf(a).label.toLowerCase();
    if (tab && s !== tab) return false;
    return !search || a.title.toLowerCase().includes(search.toLowerCase());
  }), [data, tab, search]);

  return (
    <>
      <PageHead title="Artikel" desc="Tulis, jadwalkan, dan kelola tulisan." actions={<a class="btn btn-p" href="#/artikel/baru">+ Artikel baru</a>} />
      <Panel>
        <div class="toolbar">
          <div class="tabs" role="tablist">
            {TABS.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} class={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>{t.label}</button>)}
          </div>
          <input class="inp" type="search" placeholder="Cari judul…" aria-label="Cari judul artikel" value={search} onInput={(e) => setSearch(e.currentTarget.value)} style={{ marginLeft: 'auto' }} />
        </div>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : rows.length === 0 ? (
          <Empty title={data && (data as any[]).length ? 'Tidak ada yang cocok' : 'Belum ada artikel'} text={data && (data as any[]).length ? 'Ubah filter atau kata kunci.' : 'Mulai dengan menulis artikel pertama.'}>
            {!(data as any[])?.length && <a class="btn btn-p" href="#/artikel/baru">Tulis artikel</a>}
          </Empty>
        ) : (
          <div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Judul</th><th>Kategori</th><th>Status</th><th>Tanggal terbit</th><th>Diubah</th></tr></thead>
            <tbody>
              {rows.map((a: any) => {
                const s = statusOf(a);
                return (
                  <tr key={a.id} class="clickable" onClick={() => (location.hash = `#/artikel/${a.id}`)}>
                    <td>
                      <a class="title" href={`#/artikel/${a.id}`} onClick={(e) => e.stopPropagation()}>{a.title}</a>
                      <div class="sub">/{a.slug} {a.is_featured && <span class="tag">Unggulan</span>} {a.is_sample && <span class="tag">Contoh konten</span>}</div>
                    </td>
                    <td>{a.category?.name ?? '–'}</td>
                    <td><span class={`st ${s.cls}`}>{s.label}</span></td>
                    <td>{a.status === 'draft' ? '–' : fmtDate(a.published_at, true)}</td>
                    <td class="sub">{fmtDate(a.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        )}
      </Panel>
    </>
  );
}

// ---------------- Editor artikel ----------------
type Art = Record<string, any>;
const EMPTY: Art = {
  title: '', slug: '', subtitle: '', excerpt: '', content: '', cover_url: '', cover_alt: '', cover_credit: '',
  category_id: '', status: 'draft', is_featured: false, is_sample: false, published_at: null,
  seo_title: '', seo_description: '', canonical_url: '', og_image_url: '', noindex: false,
};
const COLUMNS = Object.keys(EMPTY);

const toLocalInput = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const readingMinutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 200));

async function loadEditor(id: string) {
  const [cats, tags, all] = await Promise.all([
    q(sb.from('categories').select('id, name').order('sort_order')),
    q(sb.from('tags').select('id, name, slug').order('name')),
    q(sb.from('articles').select('id, title').order('published_at', { ascending: false })),
  ]);
  if (id === 'baru') return { article: { ...EMPTY }, tagIds: [] as string[], relatedIds: [] as string[], cats, tags, all };
  const [article, at, rel] = await Promise.all([
    q(sb.from('articles').select('*').eq('id', id).single()),
    q(sb.from('article_tags').select('tag_id').eq('article_id', id)),
    q(sb.from('article_related').select('related_id').eq('article_id', id).order('sort_order')),
  ]);
  return { article, tagIds: (at as any[]).map((r) => r.tag_id), relatedIds: (rel as any[]).map((r) => r.related_id), cats, tags, all };
}

export function ArticleEditor({ id }: { id: string }) {
  const { data, loading, error, reload } = useLoad(() => loadEditor(id), [id]);
  return loading ? <div class="panel"><Loading rows={8} /></div>
    : error ? <div class="panel"><ErrorState text={error} retry={reload} /></div>
    : data && <EditorForm key={id} id={id} init={data} />;
}

function EditorForm({ id, init }: { id: string; init: any }) {
  const toast = useToast();
  const isNew = id === 'baru';
  const [a, setA] = useState<Art>(() => {
    const src = { ...EMPTY, ...init.article };
    for (const k of COLUMNS) if (src[k] === null && typeof EMPTY[k] === 'string') src[k] = '';
    return src;
  });
  const [tagIds, setTagIds] = useState<string[]>(init.tagIds);
  const [relatedIds, setRelatedIds] = useState<string[]>(init.relatedIds);
  const [tags, setTags] = useState<any[]>(init.tags);
  const [newTag, setNewTag] = useState('');
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [mode, setMode] = useState<'tulis' | 'pratinjau'>('tulis');
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const snapshot = useRef(JSON.stringify([a, tagIds, relatedIds]));
  const dirty = JSON.stringify([a, tagIds, relatedIds]) !== snapshot.current;
  useUnsavedGuard(dirty);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: any) => setA((p) => ({ ...p, [k]: v }));
  const setTitle = (v: string) => setA((p) => ({ ...p, title: v, slug: slugTouched ? p.slug : slugify(v) }));
  const s = statusOf({ status: a.status, published_at: a.published_at });
  const preview = useMemo(() => (mode === 'pratinjau' ? renderArticle(a.content || '') : null), [mode, a.content]);

  // Sisipkan teks markdown di posisi kursor
  const insert = (before: string, after = '', placeholder = '') => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s0, selectionEnd: s1, value } = ta;
    const sel = value.slice(s0, s1) || placeholder;
    const next = value.slice(0, s0) + before + sel + after + value.slice(s1);
    set('content', next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s0 + before.length, s0 + before.length + sel.length); });
  };
  const insertImage = (url: string, alt = '') => insert(`\n\n![${alt || 'Deskripsi gambar'}](${url} "Keterangan gambar. Kredit: Nama")\n\n`);
  const onInlineFile = async (f?: File) => {
    if (!f) return;
    setUploading(true);
    try { insertImage(await uploadImage(f)); toast('Gambar disisipkan.'); }
    catch (e) { toast(errMsg(e), true); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const addTag = async () => {
    const name = newTag.trim();
    if (!name) return;
    const { data, error } = await sb.from('tags').insert({ name, slug: slugify(name) }).select().single();
    if (error) return toast(errMsg(error), true);
    setTags((t) => [...t, data].sort((x, y) => x.name.localeCompare(y.name)));
    setTagIds((t) => [...t, data.id]);
    setNewTag('');
  };

  const save = async (action: 'simpan' | 'terbit' | 'jadwal' | 'draft') => {
    if (!a.title.trim()) return toast('Judul wajib diisi.', true);
    const slug = slugify(a.slug || a.title);
    if (!slug) return toast('Slug tidak valid.', true);
    let status = a.status;
    let published_at = a.published_at;
    if (action === 'terbit') { status = 'published'; if (!published_at || new Date(published_at) > new Date()) published_at = new Date().toISOString(); }
    if (action === 'jadwal') {
      if (!published_at || new Date(published_at) <= new Date()) return toast('Isi tanggal terbit di masa depan untuk menjadwalkan.', true);
      status = 'scheduled';
    }
    if (action === 'draft') status = 'draft';

    const row: Art = {};
    for (const k of COLUMNS) row[k] = typeof a[k] === 'string' && a[k].trim() === '' && k !== 'content' ? null : a[k];
    Object.assign(row, { slug, status, published_at, category_id: a.category_id || null, reading_minutes: readingMinutes(a.content || '') });

    setSaving(true);
    try {
      let articleId = isNew ? null : id;
      if (articleId) {
        await q(sb.from('articles').update(row).eq('id', articleId).select('id').single());
      } else {
        const created: any = await q(sb.from('articles').insert(row).select('id').single());
        articleId = created.id;
      }
      // Hanya satu artikel unggulan
      if (row.is_featured) await q(sb.from('articles').update({ is_featured: false }).neq('id', articleId!).eq('is_featured', true));
      await q(sb.from('article_tags').delete().eq('article_id', articleId!));
      if (tagIds.length) await q(sb.from('article_tags').insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id }))));
      await q(sb.from('article_related').delete().eq('article_id', articleId!));
      if (relatedIds.length) await q(sb.from('article_related').insert(relatedIds.map((related_id, i) => ({ article_id: articleId, related_id, sort_order: i }))));

      const next = { ...a, slug, status, published_at };
      setA(next);
      snapshot.current = JSON.stringify([next, tagIds, relatedIds]);
      toast({ terbit: 'Artikel diterbitkan.', jadwal: 'Artikel dijadwalkan.', draft: 'Artikel dikembalikan ke draft.', simpan: 'Perubahan disimpan.' }[action]);
      if (isNew) location.hash = `#/artikel/${articleId}`;
    } catch (e) {
      toast(errMsg(e), true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Hapus artikel "${a.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await sb.from('articles').delete().eq('id', id);
    if (error) return toast(errMsg(error), true);
    snapshot.current = JSON.stringify([a, tagIds, relatedIds]);
    toast('Artikel dihapus.');
    location.hash = '#/artikel';
  };

  const live = !isNew && a.status !== 'draft' && a.published_at && new Date(a.published_at) <= new Date();
  const seoTitle = a.seo_title || a.title || 'Judul artikel';
  const seoDesc = a.seo_description || a.excerpt || 'Deskripsi artikel akan tampil di sini.';
  const others = (init.all as any[]).filter((x) => x.id !== id);

  return (
    <>
      <PageHead
        crumb={<><a href="#/artikel">Artikel</a> / {isNew ? 'Baru' : 'Edit'}</>}
        title={isNew ? 'Artikel baru' : a.title || 'Tanpa judul'}
        actions={<>
          {dirty && <span class="st st-scheduled">Belum disimpan</span>}
          {!isNew && <span class={`st ${s.cls}`}>{s.label}</span>}
          {live && <a class="btn btn-s" href={`/artikel/${a.slug}`} target="_blank" rel="noopener">Lihat di situs ↗</a>}
        </>}
      />
      <div class="split">
        <div>
          <Panel>
            <div class="panel-b">
              <TextField label="Judul" value={a.title} onInput={setTitle} required />
              <TextField label="Slug URL" value={a.slug} onInput={(v) => { setSlugTouched(true); set('slug', v); }} help={`Alamat: /artikel/${slugify(a.slug || a.title) || '…'}`} />
              <TextField label="Subjudul" value={a.subtitle} onInput={(v) => set('subtitle', v)} multiline rows={2} />
              <TextField label="Kutipan (excerpt)" value={a.excerpt} onInput={(v) => set('excerpt', v)} multiline rows={3} maxLen={240} help="Tampil di kartu artikel dan sebagai deskripsi bila SEO kosong." />
            </div>
          </Panel>
          <Panel title="Isi artikel" desc="Format Markdown. Gunakan ## untuk H2 dan ### untuk H3, daftar isi dibuat otomatis." actions={
            <div class="tabs">
              <button type="button" class={mode === 'tulis' ? 'on' : ''} onClick={() => setMode('tulis')}>Tulis</button>
              <button type="button" class={mode === 'pratinjau' ? 'on' : ''} onClick={() => setMode('pratinjau')}>Pratinjau</button>
            </div>
          }>
            {mode === 'tulis' ? (
              <>
                <div class="toolbar">
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('\n## ', '\n', 'Subjudul')}>H2</button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('\n### ', '\n', 'Sub-subjudul')}>H3</button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('**', '**', 'tebal')}><b>B</b></button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('*', '*', 'miring')}><i>I</i></button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('[', '](https://)', 'teks tautan')}>Tautan</button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('\n> ', '\n', 'Kutipan')}>Pull quote</button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => insert('\n- ', '\n', 'Butir')}>Daftar</button>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onChange={(e) => onInlineFile(e.currentTarget.files?.[0])} />
                  <button type="button" class="btn btn-s btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? 'Mengunggah…' : 'Unggah gambar'}</button>
                  <button type="button" class="btn btn-s btn-sm" onClick={() => setPicking(true)}>Gambar dari pustaka</button>
                </div>
                <div class="panel-b">
                  <textarea ref={taRef} class="inp code" aria-label="Isi artikel (Markdown)" value={a.content} onInput={(e) => set('content', e.currentTarget.value)} />
                  <div class="help">Gambar inline: <code>![alt](url "Keterangan. Kredit: Nama")</code> · ±{readingMinutes(a.content || '')} menit baca</div>
                </div>
              </>
            ) : (
              <div class="preview">
                {preview?.toc.length ? <p class="muted">Daftar isi: {preview.toc.map((t) => t.text).join(' · ')}</p> : null}
                <div dangerouslySetInnerHTML={{ __html: preview?.html || '<p class="muted">Belum ada isi.</p>' }} />
              </div>
            )}
          </Panel>
          <Panel title="SEO" desc="Kosongkan untuk memakai judul dan kutipan artikel.">
            <div class="panel-b">
              <TextField label="Judul SEO" value={a.seo_title} onInput={(v) => set('seo_title', v)} maxLen={60} />
              <TextField label="Meta description" value={a.seo_description} onInput={(v) => set('seo_description', v)} multiline rows={2} maxLen={160} />
              <TextField label="Canonical URL" value={a.canonical_url} onInput={(v) => set('canonical_url', v)} type="url" placeholder="Kosongkan untuk otomatis" />
              <ImageField label="Gambar share sosial" value={a.og_image_url} onChange={(v) => set('og_image_url', v)} help="Kosongkan untuk memakai gambar sampul." />
              <Check label="Jangan tampilkan di mesin pencari (noindex)" checked={a.noindex} onChange={(v) => set('noindex', v)} />
              <div class="fld mt"><span class="lbl">Pratinjau di Google</span>
                <div class="serp">
                  <div class="u">transbarawahyu › artikel › {slugify(a.slug || a.title) || '…'}</div>
                  <div class="t">{seoTitle.length > 60 ? seoTitle.slice(0, 60) + '…' : seoTitle}</div>
                  <div class="d">{seoDesc.length > 160 ? seoDesc.slice(0, 160) + '…' : seoDesc}</div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div>
          <Panel title="Publikasi" footer={!isNew && <button type="button" class="btn btn-d btn-sm" onClick={remove} style={{ marginRight: 'auto' }}>Hapus artikel</button>}>
            <div class="panel-b">
              <div class="fld">
                <label for="pub-at">Tanggal terbit</label>
                <input id="pub-at" class="inp" type="datetime-local" value={toLocalInput(a.published_at)} onInput={(e) => set('published_at', e.currentTarget.value ? new Date(e.currentTarget.value).toISOString() : null)} />
                <div class="help">Isi tanggal di masa depan lalu klik Jadwalkan untuk terbit otomatis.</div>
              </div>
              {!isNew && <p class="muted" style={{ fontSize: 12 }}>Terakhir diperbarui: {fmtDate(a.updated_at, true)}</p>}
              <div class="grid" style={{ gap: 8 }}>
                {a.status === 'draft' || isNew ? (
                  <>
                    <button type="button" class="btn btn-p" disabled={saving} onClick={() => save('terbit')}>{saving ? 'Menyimpan…' : 'Terbitkan sekarang'}</button>
                    <button type="button" class="btn btn-s" disabled={saving} onClick={() => save('jadwal')}>Jadwalkan</button>
                    <button type="button" class="btn btn-s" disabled={saving} onClick={() => save('simpan')}>Simpan draft</button>
                  </>
                ) : (
                  <>
                    <SaveBtn saving={saving} label="Simpan perubahan" onClick={() => save('simpan')} />
                    <button type="button" class="btn btn-s" disabled={saving} onClick={() => save('draft')}>Batalkan terbit (jadikan draft)</button>
                  </>
                )}
              </div>
            </div>
          </Panel>
          <Panel title="Sampul">
            <div class="panel-b">
              <ImageField label="Gambar sampul" value={a.cover_url} onChange={(v) => set('cover_url', v)} help="Kosongkan untuk memakai sampul tipografis." />
              <TextField label="Teks alternatif" value={a.cover_alt} onInput={(v) => set('cover_alt', v)} />
              <TextField label="Keterangan / kredit" value={a.cover_credit} onInput={(v) => set('cover_credit', v)} />
            </div>
          </Panel>
          <Panel title="Kategori & tag">
            <div class="panel-b">
              <SelectField label="Kategori" value={a.category_id ?? ''} onChange={(v) => set('category_id', v)}
                options={[{ value: '', label: '– Tanpa kategori –' }, ...(init.cats as any[]).map((c) => ({ value: c.id, label: c.name }))]} />
              <span class="lbl">Tag</span>
              <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                {tags.map((t) => <Check key={t.id} label={t.name} checked={tagIds.includes(t.id)} onChange={(on) => setTagIds((x) => (on ? [...x, t.id] : x.filter((y) => y !== t.id)))} />)}
              </div>
              <div class="row-inline mt">
                <input class="inp" placeholder="Tag baru" aria-label="Nama tag baru" value={newTag} onInput={(e) => setNewTag(e.currentTarget.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" class="btn btn-s" onClick={addTag}>Tambah</button>
              </div>
            </div>
          </Panel>
          <Panel title="Pengaturan konten">
            <div class="panel-b">
              <Check label="Jadikan artikel unggulan" checked={a.is_featured} onChange={(v) => set('is_featured', v)} />
              <p class="muted" style={{ fontSize: 12, margin: '0 0 8px 24px' }}>Tampil besar di Beranda dan halaman Artikel. Hanya satu artikel.</p>
              <Check label='Tandai sebagai "Contoh konten"' checked={a.is_sample} onChange={(v) => set('is_sample', v)} />
              <div class="fld mt">
                <span class="lbl">Artikel terkait ({relatedIds.length}/3)</span>
                <div class="help" style={{ marginBottom: 6 }}>Kosongkan untuk otomatis dari kategori yang sama.</div>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {others.length === 0 ? <span class="muted">Belum ada artikel lain.</span> : others.map((o) => (
                    <Check key={o.id} label={o.title} checked={relatedIds.includes(o.id)}
                      onChange={(on) => setRelatedIds((x) => (on ? (x.length >= 3 ? x : [...x, o.id]) : x.filter((y) => y !== o.id)))} />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
      {picking && <MediaPicker onClose={() => setPicking(false)} onPick={(url, alt) => { insertImage(url, alt); setPicking(false); }} />}
    </>
  );
}
