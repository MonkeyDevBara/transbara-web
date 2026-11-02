globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_YdRI9-rv.mjs';
import { s as safe, d as getProjects, $ as $$Base } from '../chunks/Base_BhL5kVFL.mjs';
import { $ as $$ProjectFeature } from '../chunks/ProjectFeature_CQZYr5E0.mjs';
import { $ as $$StateBox } from '../chunks/StateBox_Bm-E_A6c.mjs';
import { $ as $$CtaBand } from '../chunks/CtaBand_CMMHlquO.mjs';
export { renderers } from '../renderers.mjs';

const $$Proyek = createComponent(async ($$result, $$props, $$slots) => {
  const projects = await safe(getProjects, []);
  const featured = projects.data.filter((p) => p.status === "active");
  const exploring = projects.data.filter((p) => p.status === "exploring");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Proyek", "description": "Proyek dan eksplorasi Transbara Wahyu, dengan SIDIGS sebagai proyek utama." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-head"> <div class="container"> <nav aria-label="Breadcrumb"><ol class="tw-breadcrumb"><li><a href="/">Beranda</a></li><li aria-current="page">Proyek</li></ol></nav> <span class="gold-rule"></span> <h1>Hal yang Sedang Saya Bangun</h1> <p class="section-intro">Proyek-proyek ini adalah cara saya menerjemahkan gagasan menjadi kerja nyata. Fokusnya pada dampak dan proses, bukan sekadar hasil.</p> </div> </section> <section class="section"> <div class="container"> ${projects.error && renderTemplate`${renderComponent($$result2, "StateBox", $$StateBox, { "type": "error" })}`} ${!projects.error && featured.length === 0 && renderTemplate`${renderComponent($$result2, "StateBox", $$StateBox, { "type": "empty", "title": "Belum ada proyek", "text": "Proyek akan ditampilkan di sini." })}`} ${featured.map((p) => renderTemplate`${renderComponent($$result2, "ProjectFeature", $$ProjectFeature, { "project": p, "detailed": true })}`)} </div> </section> ${exploring.length > 0 && renderTemplate`<section class="section bg-offwhite"> <div class="container"> <span class="gold-rule"></span> <h2 class="section-title">Sedang Dieksplorasi</h2> <p class="section-intro mb-5">Gagasan dan pertanyaan yang sedang saya pelajari. Belum menjadi produk, tetapi terus saya pikirkan.</p> <div class="row"> ${exploring.map((p) => renderTemplate`<div class="col-md-6 mb-4"> <div class="explore-item"> <span class="status">Eksplorasi</span> <h3 class="mt-2">${p.name}</h3> ${p.summary && renderTemplate`<p class="mb-2" style="color:#3A4452">${p.summary}</p>`} ${p.description && renderTemplate`<p class="text-muted-tw mb-0" style="font-size:.9375rem">${p.description}</p>`} </div> </div>`)} </div> </div> </section>`}${renderComponent($$result2, "CtaBand", $$CtaBand, { "title": "Punya gagasan untuk dikerjakan bersama?", "text": "Saya terbuka untuk kolaborasi yang membawa dampak bagi pendidikan dan ekosistem bisnis yang bernilai." })} ` })}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/proyek.astro", void 0);

const $$file = "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/proyek.astro";
const $$url = "/proyek";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Proyek,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
