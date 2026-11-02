globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, k as renderComponent, h as addAttribute, r as renderTemplate } from './astro/server_YdRI9-rv.mjs';
import { $ as $$Motif } from './Motif_BIY51Jso.mjs';
import { e as getContent } from './Base_BhL5kVFL.mjs';

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$CtaBand = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CtaBand;
  const { cta } = await getContent();
  const {
    title = cta.title,
    text = cta.text,
    label = cta.button_label,
    href = cta.button_href
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="cta-band section on-dark"> ${renderComponent($$result, "Motif", $$Motif, {})} <div class="container position-relative"> <span class="gold-rule center"></span> <h2>${title}</h2> <p>${text}</p> <a${addAttribute(href, "href")} class="btn btn-light-tw">${label}</a> </div> </section>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/CtaBand.astro", void 0);

export { $$CtaBand as $ };
