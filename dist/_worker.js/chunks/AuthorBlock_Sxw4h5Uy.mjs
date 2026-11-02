globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_YdRI9-rv.mjs';
import { e as getContent } from './Base_BhL5kVFL.mjs';

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$AuthorBlock = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AuthorBlock;
  const { variant = "inline" } = Astro2.props;
  const { hero } = await getContent();
  return renderTemplate`${variant === "inline" ? renderTemplate`${maybeRenderHead()}<div class="author-block"><span class="avatar-tw"><img${addAttribute(hero.portrait, "src")} alt=""></span><span><span class="a-name">Transbara Wahyu</span><span class="a-role">Founder SIDIGS · Mantan kepala sekolah</span></span></div>` : renderTemplate`<aside class="author-card author-block" aria-label="Tentang penulis"><span class="avatar-tw"><img${addAttribute(hero.portrait, "src")} alt="Potret Transbara Wahyu"></span><div><span class="eyebrow" style="margin-bottom:.35rem">Ditulis oleh</span><h3 class="h4 mb-2">Transbara Wahyu</h3><p class="mb-3" style="color:#3A4452">Founder SIDIGS dan mantan kepala sekolah. Menulis tentang pendidikan, teknologi, kewirausahaan, dan bertumbuh sebagai Muslimpreneur.</p><a href="/tentang" class="text-link">Kenali saya lebih jauh <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a></div></aside>`}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/AuthorBlock.astro", void 0);

export { $$AuthorBlock as $ };
