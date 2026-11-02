globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_YdRI9-rv.mjs';
import { e as getContent } from './Base_BhL5kVFL.mjs';

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$Portrait = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Portrait;
  const { caption, eager = false } = Astro2.props;
  const { hero } = await getContent();
  return renderTemplate`${maybeRenderHead()}<figure class="portrait-frame"> <div class="portrait"> <img${addAttribute(hero.portrait, "src")}${addAttribute(hero.portrait_alt, "alt")} width="1600" height="2000"${addAttribute(eager ? "eager" : "lazy", "loading")}> </div> ${caption && renderTemplate`<figcaption>${caption}</figcaption>`} </figure>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/Portrait.astro", void 0);

export { $$Portrait as $ };
