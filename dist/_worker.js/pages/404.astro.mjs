globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_YdRI9-rv.mjs';
import { $ as $$Base } from '../chunks/Base_BhL5kVFL.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Halaman tidak ditemukan", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <div class="container text-center" style="max-width: 40rem;"> <span class="gold-rule center"></span> <h1 class="section-title">Halaman ini tidak ditemukan.</h1> <p class="section-intro mx-auto mb-4">Mungkin tautannya sudah berubah. Silakan kembali ke beranda atau jelajahi tulisan terbaru.</p> <div class="hero-ctas justify-content-center"> <a href="/" class="btn btn-primary">Ke Beranda</a> <a href="/artikel" class="btn btn-secondary">Baca Artikel</a> </div> </div> </section> ` })}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/404.astro", void 0);

const $$file = "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
