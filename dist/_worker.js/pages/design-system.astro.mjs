globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_YdRI9-rv.mjs';
import { s as safe, g as getArticles, d as getProjects, $ as $$Base, b as $$Icon } from '../chunks/Base_BhL5kVFL.mjs';
import { $ as $$SampleLabel, b as $$ArticleCard } from '../chunks/ArticleCard__BFeM_02.mjs';
import { $ as $$AuthorBlock } from '../chunks/AuthorBlock_Sxw4h5Uy.mjs';
import { $ as $$ProjectFeature } from '../chunks/ProjectFeature_CQZYr5E0.mjs';
import { $ as $$Newsletter } from '../chunks/Newsletter_DYmYQKwZ.mjs';
import { $ as $$StateBox } from '../chunks/StateBox_Bm-E_A6c.mjs';
export { renderers } from '../renderers.mjs';

const $$DesignSystem = createComponent(async ($$result, $$props, $$slots) => {
  const [{ data: articles }, { data: projects }] = await Promise.all([safe(getArticles, []), safe(getProjects, [])]);
  const colors = [
    ["Putih", "#FFFFFF", "Latar utama"],
    ["Off-white dingin", "#F6F8FB", "Latar seksi selang-seling"],
    ["Biru navy", "#16325C", "Heading, tombol primer, seksi gelap"],
    ["Biru tua", "#0D2140", "Hover, footer"],
    ["Biru lembut", "#E8EFF8", "Badge, highlight, area potret"],
    ["Charcoal kebiruan", "#1F2733", "Teks body"],
    ["Abu muted", "#6B7380", "Teks sekunder, meta"],
    ["List emas", "#C5A46D", "Garis aksen 1\u20132px saja"]
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Design System", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-head"> <div class="container"> <span class="gold-rule"></span> <h1>Design System</h1> <p class="section-intro">Halaman referensi komponen. Fondasi gaya dari Argon Design System (Bootstrap 4), dengan palet, tipografi, dan aturan list emas sesuai brief Transbara Wahyu.</p> </div> </section> <div class="container pb-5"> <section class="ds-section"> <span class="ds-label">Palet warna · 70% putih/off-white, 25% biru, 5% emas</span> <div class="row"> ${colors.map(([name, hex, use]) => renderTemplate`<div class="col-6 col-md-3 mb-4"> <div class="swatch"><div class="sw"${addAttribute(`background:${hex}`, "style")}></div><div class="sw-info"><strong>${name}</strong><br><code>${hex}</code><br><span class="text-muted-tw">${use}</span></div></div> </div>`)} </div> </section> <section class="ds-section"> <span class="ds-label">Tipografi · DM Serif Display (heading), Inter (body &amp; UI)</span> <h1 style="font-size:3.5rem">Heading 1 · Menjaga Makna</h1> <h2>Heading 2 · Pikiran yang Saya Bagikan</h2> <h3>Heading 3 · Tiga Hal yang Saya Tekuni</h3> <p class="lead-serif">Lead serif untuk paragraf pembuka editorial.</p> <p style="max-width: 40rem">Body Inter 16–18px, line-height 1.65–1.8. Teks body memakai charcoal kebiruan #1F2733 dengan kontras kuat di atas putih.</p> <p class="text-muted-tw" style="font-size:.875rem">Teks sekunder dan meta artikel memakai abu muted #6B7380.</p> <span class="eyebrow">Eyebrow label</span> </section> <section class="ds-section"> <span class="ds-label">List emas</span> <span class="gold-rule"></span> <blockquote class="pull-quote">Pull quote dengan border kiri emas 2px.</blockquote> <div class="bg-navy on-dark p-4 rounded"><span class="gold-rule"></span><span class="eyebrow">Teks emas hanya di atas navy</span><h3>Seksi gelap</h3></div> </section> <section class="ds-section"> <span class="ds-label">Tombol</span> <div class="d-flex flex-wrap align-items-center" style="gap:1rem"> <a href="#" class="btn btn-primary">Primary</a> <a href="#" class="btn btn-secondary">Secondary</a> <a href="#" class="text-link">Text link ${renderComponent($$result2, "Icon", $$Icon, { "name": "arrow", "size": 16 })}</a> <button class="btn btn-primary" disabled>Disabled</button> <span class="bg-navy p-3 rounded d-inline-flex on-dark" style="gap:.75rem"><a href="#" class="btn btn-light-tw">Di atas navy</a><a href="#" class="btn btn-outline-light-tw">Outline</a></span> </div> </section> <section class="ds-section"> <span class="ds-label">Badge &amp; label</span> <div class="d-flex flex-wrap" style="gap:.5rem"> <span class="badge-cat">Pendidikan &amp; Teknologi</span><span class="badge-cat">Muslimpreneur</span><span class="role-chip">Peran: Founder</span>${renderComponent($$result2, "SampleLabel", $$SampleLabel, {})} </div> </section> <section class="ds-section"> <span class="ds-label">Kartu artikel · feature, row, compact, text</span> ${articles[0] && renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": articles[0], "variant": "feature" })}`} <div class="row mt-5"> <div class="col-md-6 mb-5">${articles[1] && renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": articles[1], "variant": "row" })}`}</div> <div class="col-md-6 mb-5">${articles[2] && renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": articles[2], "variant": "compact" })}`}</div> </div> ${articles[3] && renderTemplate`${renderComponent($$result2, "ArticleCard", $$ArticleCard, { "article": articles[3], "variant": "text" })}`} </section> <section class="ds-section"> <span class="ds-label">Blok profil penulis</span> ${renderComponent($$result2, "AuthorBlock", $$AuthorBlock, {})} <div class="mt-4">${renderComponent($$result2, "AuthorBlock", $$AuthorBlock, { "variant": "card" })}</div> </section> <section class="ds-section"> <span class="ds-label">Kartu proyek</span> ${projects[0] && renderTemplate`${renderComponent($$result2, "ProjectFeature", $$ProjectFeature, { "project": projects[0] })}`} </section> <section class="ds-section"> <span class="ds-label">Breadcrumb, pencarian, pagination</span> <ol class="tw-breadcrumb"><li><a href="#">Beranda</a></li><li><a href="#">Artikel</a></li><li aria-current="page">Judul artikel</li></ol> <div class="search-input mb-4" style="max-width:360px">${renderComponent($$result2, "Icon", $$Icon, { "name": "search" })}<input type="search" class="form-control" placeholder="Cari judul atau topik…" aria-label="Cari"></div> <ul class="tw-pagination"><li><a href="#">‹</a></li><li><span class="current">1</span></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">›</a></li></ul> </section> <section class="ds-section"> <span class="ds-label">Form newsletter</span> ${renderComponent($$result2, "Newsletter", $$Newsletter, {})} </section> <section class="ds-section"> <span class="ds-label">State: kosong, memuat, error</span> <div class="row"> <div class="col-md-4 mb-4">${renderComponent($$result2, "StateBox", $$StateBox, { "type": "empty" })}</div> <div class="col-md-4 mb-4">${renderComponent($$result2, "StateBox", $$StateBox, { "type": "loading" })}<div class="skeleton mt-3" style="height:14px"></div><div class="skeleton mt-2" style="height:14px; width:70%"></div></div> <div class="col-md-4 mb-4">${renderComponent($$result2, "StateBox", $$StateBox, { "type": "error" })}</div> </div> </section> </div> ` })}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/design-system.astro", void 0);

const $$file = "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/design-system.astro";
const $$url = "/design-system";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DesignSystem,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
