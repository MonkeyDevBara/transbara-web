// Lightbox sederhana untuk galeri: <button class="doc" data-full="..." data-cap="..."> membuka <dialog id="lightbox">.
const dlg = document.getElementById('lightbox') as HTMLDialogElement | null;
const img = dlg?.querySelector('img');
if (dlg && img) {
  document.querySelectorAll<HTMLElement>('[data-full]').forEach((b) => b.addEventListener('click', () => {
    img.src = b.dataset.full!;
    img.alt = b.dataset.cap || '';
    dlg.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dlg.querySelector('[data-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; img.removeAttribute('src'); });
}
