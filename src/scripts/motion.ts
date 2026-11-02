// Micro-animation v2 (A2-A14). Vanilla TS, tanpa library. Hanya transform/opacity.
// Semua animasi bisa dimatikan lewat toggle "Motion" atau prefers-reduced-motion.
(window as any).__mm = true;

const root = document.documentElement;
const KEY = 'tw-motion';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(pointer: fine)');
const wide = matchMedia('(min-width: 960px)');
const navWide = matchMedia('(min-width: 1100px)');
const fmt = new Intl.NumberFormat('id-ID');

const readPref = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const isOn = () => root.dataset.motion !== 'off';

// ---------- Toggle Motion (A14) ----------
function applyMotion(on: boolean, persist: boolean) {
  root.dataset.motion = on ? 'on' : 'off';
  if (persist) { try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* abaikan */ } }
  document.querySelectorAll<HTMLElement>('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(on));
    const l = b.querySelector('.mt-label');
    if (l) l.textContent = on ? 'Motion on' : 'Motion off';
  });
  if (!on) { revealAll(); finishCounters(); document.querySelectorAll<HTMLElement>('[data-parallax],[data-magnetic]').forEach((e) => (e.style.transform = '')); }
}

// ---------- Scroll reveal (A2) ----------
function revealAll() { document.querySelectorAll('.reveal:not(.in)').forEach((e) => e.classList.add('in')); }
document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((p) =>
  Array.from(p.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(Math.min(i, 8)))));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach((e) => io.observe(e));
} else revealAll();

// ---------- Count-up (A3) ----------
const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
const finalText = (el: HTMLElement) => fmt.format(Number(el.dataset.count));
function finishCounters() { counters.forEach((el) => { el.dataset.ready = '1'; el.dataset.done = '1'; el.textContent = finalText(el); }); }
function runCounter(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const to = Number(el.dataset.count);
  if (!isOn()) { el.textContent = fmt.format(to); return; }
  const t0 = performance.now(), dur = 1200;
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
if (counters.length) {
  if (isOn() && 'IntersectionObserver' in window) {
    counters.forEach((el) => { el.textContent = '0'; el.dataset.ready = '1'; });
    const co = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { runCounter(e.target as HTMLElement); co.unobserve(e.target); }
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else finishCounters();
}

// ---------- Progress bar (A5) + parallax (A13) ----------
const bar = document.querySelector<HTMLElement>('.progress__bar');
const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const h = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    if (isOn() && wide.matches) {
      for (const el of parallaxEls) {
        const max = Number(el.dataset.parallax) || 24, r = el.getBoundingClientRect();
        const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${Math.max(-max, Math.min(max, -c * max * 1.5)).toFixed(1)}px, 0)`;
      }
    }
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();

// ---------- Scrollspy (A6) ----------
const spyLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-spy]'));
if (spyLinks.length && 'IntersectionObserver' in window) {
  const map = new Map<Element, HTMLAnchorElement>();
  // seksi tambahan (data-spy-also) dihitung sebagai bagian dari tautan menu yang sama
  spyLinks.forEach((l) => [l.dataset.spy!, ...(l.dataset.spyAlso?.split(' ') ?? [])].forEach((id) => { const s = document.getElementById(id); if (s) map.set(s, l); }));
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      spyLinks.forEach((l) => l.classList.remove('is-active'));
      map.get(e.target)?.classList.add('is-active');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, s) => spy.observe(s));
}

// ---------- Tombol magnetik (A9) ----------
if (fine.matches) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (!isOn()) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}

// ---------- Accordion (A12) ----------
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.acc__btn');
  if (!btn) return;
  const item = btn.closest<HTMLElement>('.acc__item')!;
  const open = !item.classList.contains('is-open');
  item.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', String(open));
  const panel = item.querySelector<HTMLElement>('.acc__panel');
  if (panel) panel.toggleAttribute('inert', !open);
});

// ---------- Menu mobile (A15) ----------
const menu = document.getElementById('menu');
const burger = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
if (menu && burger) {
  const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
  const open = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    setTimeout(() => focusables()[1]?.focus(), 30);
  };
  const close = (returnFocus = true) => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, isOn() ? 320 : 0);
    if (returnFocus) burger.focus();
  };
  burger.addEventListener('click', open);
  menu.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => close()));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close(false)));
  addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  navWide.addEventListener?.('change', () => { if (navWide.matches && !menu.hidden) close(false); });
}

// ---------- Inisialisasi mode gerak ----------
// Sengaja di akhir file: applyMotion memakai fungsi/variabel di atas (mis. counters) yang harus sudah terdeklarasi.
const pref = readPref();
applyMotion(pref ? pref === 'on' : !reduce.matches, false);
reduce.addEventListener?.('change', () => { if (!readPref()) applyMotion(!reduce.matches, false); });
document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest('[data-motion-toggle]');
  if (t) applyMotion(!isOn(), true);
});
