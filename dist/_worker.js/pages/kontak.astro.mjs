globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute, p as Fragment } from '../chunks/astro/server_YdRI9-rv.mjs';
import { e as getContent, $ as $$Base, S as SOCIAL_LABELS } from '../chunks/Base_BhL5kVFL.mjs';
export { renderers } from '../renderers.mjs';

const $$Kontak = createComponent(async ($$result, $$props, $$slots) => {
  const content = await getContent();
  const social = content.social;
  const purposes = [
    { value: "undangan_berbicara", label: "Undangan berbicara" },
    { value: "diskusi_pendidikan", label: "Diskusi pendidikan" },
    { value: "kolaborasi", label: "Kolaborasi" },
    { value: "lainnya", label: "Lainnya" }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Kontak", "description": "Hubungi Transbara Wahyu untuk diskusi, undangan berbicara, pertukaran ide, atau kolaborasi." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-head"> <div class="container"> <nav aria-label="Breadcrumb"><ol class="tw-breadcrumb"><li><a href="/">Beranda</a></li><li aria-current="page">Kontak</li></ol></nav> <span class="gold-rule"></span> <h1>Mari Terhubung.</h1> <p class="section-intro">Untuk diskusi, undangan berbicara, pertukaran ide, atau peluang kolaborasi, silakan hubungi saya.</p> </div> </section> <section class="section"> <div class="container"> <div class="row"> <div class="col-lg-7 mb-5 mb-lg-0"> <div id="form-alert" class="mb-4" aria-live="polite"></div> <form id="contact-form" novalidate> <div class="form-row"> <div class="form-group col-md-6"> <label class="form-label-tw" for="name">Nama</label> <input class="form-control" id="name" name="name" autocomplete="name" required minlength="2" maxlength="120"> <div class="invalid-feedback">Mohon isi nama Anda.</div> </div> <div class="form-group col-md-6"> <label class="form-label-tw" for="email">Email</label> <input class="form-control" id="email" name="email" type="email" autocomplete="email" required maxlength="200"> <div class="invalid-feedback">Mohon isi alamat email yang valid.</div> </div> </div> <div class="form-row"> <div class="form-group col-md-6"> <label class="form-label-tw" for="purpose">Jenis keperluan</label> <select class="form-control custom-select" id="purpose" name="purpose"> ${purposes.map((p) => renderTemplate`<option${addAttribute(p.value, "value")}>${p.label}</option>`)} </select> </div> <div class="form-group col-md-6"> <label class="form-label-tw" for="subject">Subjek</label> <input class="form-control" id="subject" name="subject" required minlength="2" maxlength="200"> <div class="invalid-feedback">Mohon isi subjek pesan.</div> </div> </div> <div class="form-group"> <label class="form-label-tw" for="message">Pesan</label> <textarea class="form-control" id="message" name="message" rows="6" required minlength="10" maxlength="5000"></textarea> <div class="invalid-feedback">Pesan minimal 10 karakter.</div> </div> <button type="submit" class="btn btn-primary" id="submit-btn">Kirim Pesan</button> </form> </div> <div class="col-lg-4 offset-lg-1"> <div class="contact-aside"> <span class="eyebrow">Kontak langsung</span> <dl> <dt>Email</dt> <dd>${content.contact.email ? renderTemplate`<a${addAttribute(`mailto:${content.contact.email}`, "href")}>${content.contact.email}</a>` : "Belum diatur (placeholder)"}</dd> ${Object.entries(SOCIAL_LABELS).map(([k, label]) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <dt>${label}</dt> <dd>${social[k] ? renderTemplate`<a${addAttribute(social[k], "href")} target="_blank" rel="noopener">${social[k]}</a>` : "Belum diatur (placeholder)"}</dd> ` })}`)} </dl> <p class="text-muted-tw mt-4" style="font-size:.875rem">Saya membaca setiap pesan dan akan membalas sesegera mungkin.</p> </div> </div> </div> </div> </section> ` })} ${renderScript($$result, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/kontak.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/kontak.astro", void 0);

const $$file = "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/pages/kontak.astro";
const $$url = "/kontak";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Kontak,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
