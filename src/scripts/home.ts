import { initContactForm } from './contact-form';
// Interaksi khusus beranda: filter karya (A16), dialog logo, video, form kontak.
const motionOn = () => document.documentElement.dataset.motion !== 'off';

// ---------- Filter karya (A16) ----------
const area = document.getElementById('work-area');
const filterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
if (area && filterBtns.length) {
  const match = (el: HTMLElement, cat: string) => cat === 'all' || (el.dataset.cat || '').split(' ').includes(cat);
  const apply = (cat: string) => {
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    const items = Array.from(area.querySelectorAll<HTMLElement>('[data-cat]'));
    const toHide = items.filter((el) => !el.hidden && !match(el, cat));
    const toShow = items.filter((el) => el.hidden && match(el, cat));
    if (!motionOn()) { toHide.forEach((el) => (el.hidden = true)); toShow.forEach((el) => { el.hidden = false; el.classList.add('in'); }); return; }
    toHide.forEach((el) => el.classList.add('is-out'));
    setTimeout(() => {
      toHide.forEach((el) => { el.hidden = true; el.classList.remove('is-out'); });
      toShow.forEach((el, i) => { el.hidden = false; el.classList.add('is-out'); el.style.setProperty('--i', String(Math.min(i, 5))); });
      requestAnimationFrame(() => requestAnimationFrame(() => toShow.forEach((el) => { el.classList.remove('is-out'); el.classList.add('in'); })));
    }, toHide.length ? 160 : 0);
  };
  filterBtns.forEach((b) => b.addEventListener('click', () => { if (b.getAttribute('aria-pressed') !== 'true') apply(b.dataset.filter || 'all'); }));
}

// ---------- Dialog semua logo ----------
const dlg = document.getElementById('logos-dialog') as HTMLDialogElement | null;
if (dlg) {
  document.querySelectorAll('[data-open-logos]').forEach((b) => b.addEventListener('click', () => { dlg.showModal(); document.body.style.overflow = 'hidden'; }));
  dlg.querySelector('[data-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
}

// ---------- Form kontak ----------
const openForm = (focus = true) => {
  const item = document.getElementById('form-item');
  if (!item) return;
  item.classList.add('is-open');
  item.querySelector('.acc__btn')?.setAttribute('aria-expanded', 'true');
  item.querySelector('.acc__panel')?.removeAttribute('inert');
  if (focus) setTimeout(() => (document.getElementById('f-name') as HTMLInputElement | null)?.focus({ preventScroll: false }), 380);
};
document.querySelectorAll<HTMLElement>('[data-open-form]').forEach((b) => b.addEventListener('click', (e) => {
  e.preventDefault();
  const sel = document.getElementById('f-purpose') as HTMLSelectElement | null;
  if (sel && b.dataset.purpose && Array.from(sel.options).some((o) => o.value === b.dataset.purpose)) sel.value = b.dataset.purpose;
  openForm();
  document.getElementById('form-item')?.scrollIntoView({ block: 'center' });
}));

// ---------- Video: baru dimuat dari YouTube setelah ditekan (tanpa autoplay saat halaman dibuka) ----------
document.querySelectorAll<HTMLElement>('[data-video]').forEach((frame) => {
  const poster = frame.querySelector<HTMLAnchorElement>('.video__poster');
  poster?.addEventListener('click', (e) => {
    e.preventDefault();
    const ifr = document.createElement('iframe');
    ifr.src = `https://www.youtube-nocookie.com/embed/${frame.dataset.video}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    ifr.title = frame.dataset.title || 'Video';
    ifr.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    ifr.allowFullscreen = true;
    ifr.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(ifr);
    ifr.focus();
  });
});

initContactForm({ source: 'beranda', onPreset: () => openForm(false) });
