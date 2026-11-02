globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent, q as renderSlot } from './astro/server_YdRI9-rv.mjs';
import { b as $$Icon } from './Base_BhL5kVFL.mjs';

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$StateBox = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StateBox;
  const { type = "empty", title, text } = Astro2.props;
  const defaults = {
    empty: { title: "Belum ada tulisan di sini", text: "Coba ubah kata kunci atau pilih kategori lain." },
    error: { title: "Konten belum bisa dimuat", text: "Terjadi kendala saat mengambil data. Silakan muat ulang halaman beberapa saat lagi." },
    loading: { title: "Memuat konten", text: "Sebentar, tulisan sedang disiapkan." }
  }[type];
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["state-box", type], "class:list")}${addAttribute(type === "error" ? "alert" : "status", "role")}> <span class="state-icon"> ${type === "loading" ? renderTemplate`<span class="spinner"></span>` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": type === "error" ? "alert" : "doc", "size": 22 })}`} </span> <h3>${title ?? defaults.title}</h3> <p class="mb-0">${text ?? defaults.text}</p> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/StateBox.astro", void 0);

export { $$StateBox as $ };
