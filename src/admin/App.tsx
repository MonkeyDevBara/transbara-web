import { Component, type ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { Session } from '@supabase/supabase-js';
import { sb, errMsg } from './sb';
import { ToastProvider } from './ui';
import Dashboard from './views/Dashboard';
import ContentView from './views/Content';
import { ArticleList, ArticleEditor } from './views/Articles';
import Taxonomy from './views/Taxonomy';
import Projects from './views/Projects';
import Ebooks from './views/Ebooks';
import Topics from './views/Topics';
import Media from './views/Media';
import { Messages, Newsletter } from './views/Inbox';
import './admin.css';

const NAV = [
  { grp: 'Umum' },
  { route: '', label: 'Ringkasan' },
  { grp: 'Situs' },
  { route: 'beranda', label: 'Halaman Beranda' },
  { route: 'halaman', label: 'Halaman Lain' },
  { route: 'pengaturan', label: 'Pengaturan Website' },
  { grp: 'Konten' },
  { route: 'artikel', label: 'Artikel' },
  { route: 'kategori', label: 'Kategori & Tag' },
  { route: 'proyek', label: 'Proyek' },
  { route: 'ebook', label: 'E-Book' },
  { route: 'topik', label: 'Topik Bicara' },
  { route: 'media', label: 'Pustaka Media' },
  { grp: 'Interaksi' },
  { route: 'pesan', label: 'Pesan Masuk', badge: true },
  { route: 'newsletter', label: 'Newsletter' },
] as const;

// Catat tipe tautan auth (undangan / reset password) sebelum supabase-js membersihkan URL.
const authType = typeof location !== 'undefined' ? new URLSearchParams(location.hash.slice(1)).get('type') : null;

function parseRoute() {
  const h = location.hash;
  if (h.includes('access_token') || h.includes('error_description')) return { parts: [] as string[], query: new URLSearchParams() };
  const [path, qs] = h.replace(/^#\/?/, '').split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs) };
}

/** Tampilkan pesan error alih-alih layar putih bila ada komponen yang gagal. */
class ErrorBoundary extends Component<{ children: ComponentChildren }, { error: Error | null }> {
  state = { error: null as Error | null };
  componentDidCatch(error: Error) {
    console.error(error);
    this.setState({ error });
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div class="login"><div class="login-card">
        <h1>Terjadi kesalahan</h1>
        <p class="sub">Admin gagal dimuat. Kirimkan pesan di bawah ini ke pengembang bila masalah berulang.</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, background: 'var(--offwhite)', padding: 10, borderRadius: 6, maxHeight: 200, overflow: 'auto' }}>{String(error?.stack || error)}</pre>
        <div class="flex mt">
          <button class="btn btn-p" onClick={() => location.reload()}>Muat ulang</button>
          <button class="btn btn-s" onClick={() => sb.auth.signOut().finally(() => location.reload())}>Keluar</button>
        </div>
      </div></div>
    );
  }
}

export default function App() {
  return <ErrorBoundary><AdminApp /></ErrorBoundary>;
}

function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [adminError, setAdminError] = useState(false);
  const [needPassword, setNeedPassword] = useState(authType === 'invite' || authType === 'recovery');

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setNeedPassword(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAdmin(null); return; }
    sb.rpc('is_admin').then(({ data, error }) => {
      if (error) console.error('is_admin gagal. Apakah migrasi database sudah dijalankan?', error);
      setAdminError(!!error);
      setAdmin(!error && data === true);
    });
  }, [session?.user?.id]);

  if (!ready || (session && admin === null)) return <div class="login"><span class="spin" style={{ color: '#fff' }} /></div>;
  if (!session) return <Login />;
  if (needPassword) return <SetPassword onDone={() => { setNeedPassword(false); history.replaceState(null, '', '/admin'); }} />;
  if (!admin) return (
    <div class="login"><div class="login-card">
      <h1>{adminError ? 'Tidak dapat memeriksa akses' : 'Akses ditolak'}</h1>
      <p class="sub">{adminError
        ? 'Server database tidak merespons pemeriksaan admin. Pastikan migrasi database sudah dijalankan, lalu muat ulang.'
        : <>Akun <strong>{session.user.email}</strong> belum terdaftar sebagai admin situs ini.</>}</p>
      <button class="btn btn-s" onClick={() => sb.auth.signOut()}>Keluar</button>
    </div></div>
  );
  return <ToastProvider><Shell email={session.user.email ?? ''} /></ToastProvider>;
}

function Shell({ email }: { email: string }) {
  const [route, setRoute] = useState(parseRoute);
  const [menu, setMenu] = useState(false);
  const [unread, setUnread] = useState(0);
  const refreshUnread = () => sb.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false).then(({ count }) => setUnread(count ?? 0));

  useEffect(() => {
    const on = () => { setRoute(parseRoute()); setMenu(false); window.scrollTo(0, 0); };
    addEventListener('hashchange', on);
    refreshUnread();
    return () => removeEventListener('hashchange', on);
  }, []);

  const [section, id] = route.parts;
  const view = (() => {
    switch (section ?? '') {
      case '': return <Dashboard />;
      case 'beranda': return <ContentView key="b" group="beranda" />;
      case 'halaman': return <ContentView key="h" group="halaman" />;
      case 'pengaturan': return <ContentView key="g" group="global" />;
      case 'artikel': return id ? <ArticleEditor id={id} /> : <ArticleList query={route.query} />;
      case 'kategori': return <Taxonomy />;
      case 'proyek': return <Projects />;
      case 'ebook': return <Ebooks />;
      case 'topik': return <Topics />;
      case 'media': return <Media />;
      case 'pesan': return <Messages onChange={refreshUnread} />;
      case 'newsletter': return <Newsletter />;
      default: return <div class="state"><strong>Halaman tidak ditemukan</strong><a href="#/">Kembali ke Ringkasan</a></div>;
    }
  })();

  return (
    <div class="adm">
      <aside class={`adm-side ${menu ? 'open' : ''}`} aria-label="Menu admin">
        <div class="adm-brand"><strong>Transbara Wahyu</strong><span>Admin konten</span></div>
        <nav class="adm-nav">
          {NAV.map((n, i) => 'grp' in n
            ? <div class="grp" key={i}>{n.grp}</div>
            : <a key={n.route} href={`#/${n.route}`} class={(section ?? '') === n.route ? 'active' : ''} aria-current={(section ?? '') === n.route ? 'page' : undefined}>
                {n.label}{'badge' in n && unread > 0 && <span class="count">{unread}</span>}
              </a>)}
        </nav>
        <div class="adm-side-foot">
          <div style={{ marginBottom: 6, wordBreak: 'break-all' }}>{email}</div>
          <a href="/" target="_blank" rel="noopener">Lihat situs</a> · <button onClick={() => sb.auth.signOut()}>Keluar</button>
        </div>
      </aside>
      <div class="adm-main">
        <div class="adm-top"><strong>Admin</strong><button onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu</button></div>
        <main class="adm-page" onClick={() => menu && setMenu(false)}>{view}</main>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [forgot, setForgot] = useState(false);

  const submit = async (e: Event) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (forgot) {
      const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin` });
      setMsg(error ? { text: errMsg(error) } : { ok: true, text: 'Jika email terdaftar, tautan reset password sudah dikirim.' });
    } else {
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMsg({ text: /invalid/i.test(error.message) ? 'Email atau password salah.' : errMsg(error) });
    }
    setBusy(false);
  };

  return (
    <div class="login">
      <form class="login-card" onSubmit={submit}>
        <h1>{forgot ? 'Reset password' : 'Masuk admin'}</h1>
        <p class="sub">{forgot ? 'Kami akan mengirim tautan untuk membuat password baru.' : 'Kelola konten website Transbara Wahyu.'}</p>
        {msg && <div class={`alert ${msg.ok ? 'ok' : 'err'}`} role="alert">{msg.text}</div>}
        <div class="fld"><label for="em">Email</label><input id="em" class="inp" type="email" autocomplete="username" required value={email} onInput={(e) => setEmail(e.currentTarget.value)} /></div>
        {!forgot && <div class="fld"><label for="pw">Password</label><input id="pw" class="inp" type="password" autocomplete="current-password" required value={password} onInput={(e) => setPassword(e.currentTarget.value)} /></div>}
        <button class="btn btn-p" disabled={busy}>{busy ? <span class="spin" /> : forgot ? 'Kirim tautan reset' : 'Masuk'}</button>
        <p class="mt" style={{ textAlign: 'center', marginBottom: 0 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setForgot(!forgot); setMsg(null); }}>{forgot ? 'Kembali ke login' : 'Lupa password?'}</a>
        </p>
      </form>
    </div>
  );
}

function SetPassword({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e: Event) => {
    e.preventDefault();
    if (pw.length < 8) return setErr('Password minimal 8 karakter.');
    if (pw !== pw2) return setErr('Konfirmasi password tidak sama.');
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(errMsg(error));
    onDone();
  };
  return (
    <div class="login">
      <form class="login-card" onSubmit={submit}>
        <h1>Buat password</h1>
        <p class="sub">Atur password untuk masuk ke admin berikutnya.</p>
        {err && <div class="alert err" role="alert">{err}</div>}
        <div class="fld"><label for="np">Password baru</label><input id="np" class="inp" type="password" autocomplete="new-password" value={pw} onInput={(e) => setPw(e.currentTarget.value)} /></div>
        <div class="fld"><label for="np2">Ulangi password</label><input id="np2" class="inp" type="password" autocomplete="new-password" value={pw2} onInput={(e) => setPw2(e.currentTarget.value)} /></div>
        <button class="btn btn-p" disabled={busy}>{busy ? <span class="spin" /> : 'Simpan password'}</button>
      </form>
    </div>
  );
}
