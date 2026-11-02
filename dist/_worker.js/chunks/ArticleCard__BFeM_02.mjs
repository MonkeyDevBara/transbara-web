globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from './astro/server_YdRI9-rv.mjs';
import { f as formatDate } from './Base_BhL5kVFL.mjs';
import { $ as $$Motif } from './Motif_BIY51Jso.mjs';

const $$Astro$2 = createAstro("https://transbara-wahyu.pages.dev");
const $$Cover = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Cover;
  const { article, shape = "default", eager = false } = Astro2.props;
  const variant = ((article.category?.sort_order ?? 1) - 1) % 4;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["cover", `v${variant}`, shape !== "default" && `cover-${shape}`], "class:list")}> ${article.cover_url && renderTemplate`<img${addAttribute(article.cover_url, "src")}${addAttribute(article.cover_alt ?? "", "alt")}${addAttribute(eager ? "eager" : "lazy", "loading")}>`} ${!article.cover_url && renderTemplate`${renderComponent($$result, "Motif", $$Motif, {})}`} <span class="cover-cat">${article.category?.name ?? "Catatan"}</span> </div>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/Cover.astro", void 0);

const $$Astro$1 = createAstro("https://transbara-wahyu.pages.dev");
const $$SampleLabel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SampleLabel;
  const { text = "Contoh konten" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span class="sample-label" title="Konten ini contoh dan akan diganti dengan tulisan asli">${text}</span>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/SampleLabel.astro", void 0);

const $$Astro = createAstro("https://transbara-wahyu.pages.dev");
const $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ArticleCard;
  const { article, variant = "compact", headingLevel = "h3" } = Astro2.props;
  const href = `/artikel/${article.slug}`;
  const H = headingLevel;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(["a-card", `a-card-${variant}`], "class:list")}${addAttribute(article.category?.slug, "data-category")}> ${variant !== "text" && renderTemplate`<a${addAttribute(href, "href")} class="cover-link" tabindex="-1" aria-hidden="true"> ${renderComponent($$result, "Cover", $$Cover, { "article": article, "shape": variant === "feature" ? "wide" : "default" })} </a>`} <div> <div class="d-flex flex-wrap align-items-center" style="gap:.5rem; margin-top: 1rem;"> ${article.category && renderTemplate`<a class="badge-cat"${addAttribute(`/artikel?kategori=${article.category.slug}`, "href")}>${article.category.name}</a>`} ${article.is_sample && renderTemplate`${renderComponent($$result, "SampleLabel", $$SampleLabel, {})}`} </div> ${renderComponent($$result, "H", H, { "class": "a-title" }, { "default": ($$result2) => renderTemplate`<a${addAttribute(href, "href")}>${article.title}</a>` })} ${article.excerpt && renderTemplate`<p class="a-excerpt">${article.excerpt}</p>`} <div class="article-meta"> <span><time${addAttribute(article.published_at, "datetime")}>${formatDate(article.published_at)}</time></span> ${article.reading_minutes && renderTemplate`<span>${article.reading_minutes} menit baca</span>`} </div> </div> </article>`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/ArticleCard.astro", void 0);

export { $$SampleLabel as $, $$Cover as a, $$ArticleCard as b };
