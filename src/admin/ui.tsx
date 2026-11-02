import { createContext, type ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useRef, useState } from 'preact/hooks';
import type { Field } from '../lib/content';
import { sb, uploadImage, errMsg } from './sb';

// ---------- Toast ----------
type Toast = { id: number; text: string; err?: boolean };
const ToastCtx = createContext<(text: string, err?: boolean) => void>(() => {});
export function ToastProvider({ children }: { children: ComponentChildren }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, err = false) => {
    const id = Date.now() + Math.random();
    setItems((t) => [...t, { id, text, err }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), err ? 6000 : 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div class="toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} class={`toast ${t.err ? 'err' : ''}`}>{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

// ---------- Data loader ----------
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try { setState({ data: await fn(), loading: false, error: null }); }
    catch (e) { setState({ data: null, loading: false, error: errMsg(e) }); }
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}

/** Pembungkus hasil query Supabase: lempar error bila ada. */
export async function q<T>(p: PromiseLike<{ data: T | null; error: any }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw error;
  return data as T;
}

// ---------- States ----------
export const Loading = ({ rows = 4 }: { rows?: number }) => (
  <div class="panel-b" aria-busy="true" aria-label="Memuat">{Array.from({ length: rows }, (_, i) => <div key={i} class="skel" style={{ width: `${90 - i * 12}%` }} />)}</div>
);
export const Empty = ({ title, text, children }: { title: string; text?: string; children?: ComponentChildren }) => (
  <div class="state"><strong>{title}</strong>{text}{children && <div class="mt">{children}</div>}</div>
);
export const ErrorState = ({ text, retry }: { text: string; retry?: () => void }) => (
  <div class="state err" role="alert"><strong>Gagal memuat data</strong>{text}{retry && <div class="mt"><button class="btn btn-s" onClick={retry}>Coba lagi</button></div>}</div>
);

export function Panel({ title, desc, actions, children, footer }: { title?: string; desc?: string; actions?: ComponentChildren; children: ComponentChildren; footer?: ComponentChildren }) {
  return (
    <section class="panel">
      {title && <div class="panel-h"><div><h2>{title}</h2>{desc && <p>{desc}</p>}</div>{actions && <div class="flex">{actions}</div>}</div>}
      {children}
      {footer && <div class="panel-f">{footer}</div>}
    </section>
  );
}

export function PageHead({ title, desc, crumb, actions }: { title: string; desc?: string; crumb?: ComponentChildren; actions?: ComponentChildren }) {
  return (
    <div class="adm-head">
      <div>{crumb && <div class="crumb">{crumb}</div>}<h1>{title}</h1>{desc && <p>{desc}</p>}</div>
      {actions && <div class="flex">{actions}</div>}
    </div>
  );
}

export const SaveBtn = ({ saving, dirty = true, label = 'Simpan', onClick }: { saving: boolean; dirty?: boolean; label?: string; onClick?: () => void }) => (
  <button type={onClick ? 'button' : 'submit'} class="btn btn-p" disabled={saving || !dirty} onClick={onClick}>
    {saving ? <><span class="spin" /> Menyimpan…</> : label}
  </button>
);

// ---------- Field dasar ----------
let uid = 0;
const useId = () => useRef(`f${++uid}`).current;

export function TextField({ label, value, onInput, help, type = 'text', multiline, rows, maxLen, placeholder, required, code }: {
  label: string; value: string; onInput: (v: string) => void; help?: string; type?: string; multiline?: boolean; rows?: number; maxLen?: number; placeholder?: string; required?: boolean; code?: boolean;
}) {
  const id = useId();
  const props = { id, class: `inp ${code ? 'code' : ''}`, value: value ?? '', placeholder, required, onInput: (e: any) => onInput(e.currentTarget.value) };
  return (
    <div class="fld">
      <label for={id}>{label}{maxLen && <span class="cnt">{(value ?? '').length}/{maxLen}</span>}</label>
      {multiline ? <textarea {...props} rows={rows ?? 3} /> : <input {...props} type={type} />}
      {help && <div class="help">{help}</div>}
    </div>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label class="chk"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />{label}</label>;
}

export function SelectField({ label, value, onChange, options, help }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; help?: string }) {
  const id = useId();
  return (
    <div class="fld">
      <label for={id}>{label}</label>
      <select id={id} class="inp" value={value} onChange={(e) => onChange(e.currentTarget.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {help && <div class="help">{help}</div>}
    </div>
  );
}

export function StringsField({ label, value, onChange, help, multiline }: { label: string; value: string[]; onChange: (v: string[]) => void; help?: string; multiline?: boolean }) {
  const list = value ?? [];
  const set = (i: number, v: string) => onChange(list.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: number) => { const a = [...list]; const [x] = a.splice(i, 1); a.splice(i + d, 0, x); onChange(a); };
  return (
    <div class="fld">
      <span class="lbl">{label}</span>
      {list.map((v, i) => (
        <div class="row-inline" key={i}>
          {multiline
            ? <textarea class="inp" rows={3} value={v} aria-label={`${label} ${i + 1}`} onInput={(e) => set(i, e.currentTarget.value)} />
            : <input class="inp" value={v} aria-label={`${label} ${i + 1}`} onInput={(e) => set(i, e.currentTarget.value)} />}
          <button type="button" class="btn btn-s btn-sm btn-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naikkan">↑</button>
          <button type="button" class="btn btn-s btn-sm btn-icon" disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label="Turunkan">↓</button>
          <button type="button" class="btn btn-d btn-sm btn-icon" onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Hapus">×</button>
        </div>
      ))}
      <button type="button" class="btn btn-s btn-sm" onClick={() => onChange([...list, ''])}>+ Tambah</button>
      {help && <div class="help">{help}</div>}
    </div>
  );
}

// ---------- Gambar ----------
export function ImageField({ label, value, onChange, help }: { label: string; value: string; onChange: (v: string) => void; help?: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadImage(f)); toast('Gambar diunggah.'); }
    catch (e) { toast(errMsg(e), true); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  };
  return (
    <div class="fld">
      <span class="lbl">{label}</span>
      <div class="img-field">
        <div class="img-prev" style={value ? { backgroundImage: `url("${value}")` } : undefined}>{!value && 'Belum ada gambar'}</div>
        <div class="side">
          <input class="inp" value={value ?? ''} placeholder="https://… atau /images/…" aria-label={`${label}: URL`} onInput={(e) => onChange(e.currentTarget.value)} />
          <div class="flex">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" onChange={(e) => onFile(e.currentTarget.files?.[0])} />
            <button type="button" class="btn btn-s btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? <><span class="spin" /> Mengunggah…</> : 'Unggah'}</button>
            <button type="button" class="btn btn-s btn-sm" onClick={() => setPicking(true)}>Pilih dari pustaka</button>
            {value && <button type="button" class="btn btn-g btn-sm" onClick={() => onChange('')}>Kosongkan</button>}
          </div>
        </div>
      </div>
      {help && <div class="help">{help}</div>}
      {picking && <MediaPicker onClose={() => setPicking(false)} onPick={(url) => { onChange(url); setPicking(false); }} />}
    </div>
  );
}

export function MediaPicker({ onPick, onClose }: { onPick: (url: string, alt?: string) => void; onClose: () => void }) {
  const { data, loading, error, reload } = useLoad(() => q(sb.from('media').select('*').order('created_at', { ascending: false })));
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return (
    <div class="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="modal" role="dialog" aria-modal="true" aria-label="Pilih gambar">
        <div class="panel-h"><div><h2>Pustaka Media</h2><p>Klik gambar untuk memilih.</p></div><button class="btn btn-g" onClick={onClose} aria-label="Tutup">✕</button></div>
        {loading ? <Loading /> : error ? <ErrorState text={error} retry={reload} /> : !data?.length ? <Empty title="Pustaka masih kosong" text="Unggah gambar lewat tombol Unggah atau menu Pustaka Media." /> : (
          <div class="panel-b"><div class="media-grid">
            {(data as any[]).map((m) => (
              <button type="button" key={m.id} class="media-card pick" style={{ padding: 0, textAlign: 'left' }} onClick={() => onPick(m.url, m.alt)}>
                <div class="thumb" style={{ backgroundImage: `url("${m.url}")` }} />
                <div class="meta"><span>{m.alt || 'Tanpa alt'}</span></div>
              </button>
            ))}
          </div></div>
        )}
      </div>
    </div>
  );
}

// ---------- Form dari skema konten ----------
export function SchemaFields({ fields, value, onChange }: { fields: Field[]; value: Record<string, any>; onChange: (v: Record<string, any>) => void }) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  return (
    <>
      {fields.map((f) => {
        const v = value?.[f.key];
        switch (f.type) {
          case 'textarea': return <TextField key={f.key} label={f.label} help={f.help} multiline rows={3} value={v ?? ''} onInput={(x) => set(f.key, x)} />;
          case 'url': return <TextField key={f.key} label={f.label} help={f.help} type="url" placeholder="https://" value={v ?? ''} onInput={(x) => set(f.key, x)} />;
          case 'number': return <TextField key={f.key} label={f.label} help={f.help} type="number" value={String(v ?? '')} onInput={(x) => set(f.key, x === '' ? '' : Number(x))} />;
          case 'image': return <ImageField key={f.key} label={f.label} help={f.help} value={v ?? ''} onChange={(x) => set(f.key, x)} />;
          case 'strings': return <StringsField key={f.key} label={f.label} help={f.help} multiline={f.key === 'paragraphs'} value={v ?? []} onChange={(x) => set(f.key, x)} />;
          case 'list': return <ListField key={f.key} field={f} value={v ?? []} onChange={(x) => set(f.key, x)} />;
          case 'select': return <SelectField key={f.key} label={f.label} help={f.help} value={v ?? f.options?.[0]?.value ?? ''} options={f.options ?? []} onChange={(x) => set(f.key, x)} />;
          default: return <TextField key={f.key} label={f.label} help={f.help} value={v ?? ''} onInput={(x) => set(f.key, x)} />;
        }
      })}
    </>
  );
}

function ListField({ field, value, onChange }: { field: Field; value: Record<string, any>[]; onChange: (v: Record<string, any>[]) => void }) {
  const move = (i: number, d: number) => { const a = [...value]; const [x] = a.splice(i, 1); a.splice(i + d, 0, x); onChange(a); };
  const blank = Object.fromEntries((field.itemFields ?? []).map((f) => [f.key, f.type === 'strings' ? [] : f.type === 'select' ? (f.options?.[0]?.value ?? '') : '']));
  return (
    <div class="fld">
      <span class="lbl">{field.label}</span>
      {value.map((item, i) => (
        <div class="list-item" key={i}>
          <div class="list-item-h">
            <span>Item {i + 1}</span>
            <span class="flex">
              <button type="button" class="btn btn-s btn-sm btn-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naikkan">↑</button>
              <button type="button" class="btn btn-s btn-sm btn-icon" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Turunkan">↓</button>
              <button type="button" class="btn btn-d btn-sm" onClick={() => onChange(value.filter((_, j) => j !== i))}>Hapus</button>
            </span>
          </div>
          <SchemaFields fields={field.itemFields ?? []} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
        </div>
      ))}
      <button type="button" class="btn btn-s btn-sm" onClick={() => onChange([...value, { ...blank }])}>+ Tambah item</button>
      {field.help && <div class="help">{field.help}</div>}
    </div>
  );
}

export const fmtDate = (iso?: string | null, withTime = false) =>
  iso ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}), timeZone: 'Asia/Jakarta' }).format(new Date(iso)) : '–';

/** Konfirmasi sebelum meninggalkan halaman dengan perubahan belum disimpan. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    addEventListener('beforeunload', h);
    return () => removeEventListener('beforeunload', h);
  }, [dirty]);
}
