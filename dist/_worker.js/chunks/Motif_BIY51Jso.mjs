globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_YdRI9-rv.mjs';

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$Motif = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Motif;
  const { class: cls = "motif", color = "currentColor" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(cls, "class")} viewBox="0 0 200 200" fill="none"${addAttribute(color, "stroke")} stroke-width="1" aria-hidden="true"> <rect x="45" y="45" width="110" height="110"></rect> <rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)"></rect> <circle cx="100" cy="100" r="38"></circle> <rect x="70" y="70" width="60" height="60"></rect> <rect x="70" y="70" width="60" height="60" transform="rotate(45 100 100)"></rect> </svg>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/Motif.astro", void 0);

export { $$Motif as $ };
