// Helper SEO: URL situs, JSON-LD (Person, Organization, WebSite, Breadcrumb, Article).
import type { Article } from './data';
import { PROFILE } from './profile';

const PROD_SITE = 'https://transbara.my.id';

/** Alamat dasar situs. Produksi: PUBLIC_SITE_URL, lalu domain resmi (di belakang Nginx origin-nya 127.0.0.1, jadi jangan dipakai). Dev: origin request. */
export function siteBase(astro: { site?: URL; url: URL }): string {
  if (import.meta.env.DEV) return astro.url.origin;
  const s = astro.site?.origin;
  return s && !/localhost|127\.0\.0\.1/.test(s) ? s : PROD_SITE;
}
export const abs = (path: string, base: string) => new URL(path, base).toString();

export function personLd(base: string, content: { site: { description: string } }) {
  return {
    '@type': 'Person', '@id': abs('/#person', base),
    name: PROFILE.fullName, jobTitle: 'Founder & CEO', description: content.site.description,
    url: abs('/', base), image: abs('/v2/img/portrait-768.webp', base),
    worksFor: { '@id': abs('/#sidigs', base) },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universitas Bina Nusantara' },
    address: { '@type': 'PostalAddress', addressLocality: 'Malang', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    knowsLanguage: ['id', 'en', 'ar'],
    sameAs: [PROFILE.linkedin, PROFILE.instagram],
  };
}
export function orgLd(base: string) {
  return {
    '@type': 'Organization', '@id': abs('/#sidigs', base),
    name: 'SIDIGS', legalName: 'CV. Pendekar Pendidikan Digital', slogan: 'Sekolah Jadi Mudah',
    url: PROFILE.sidigsUrl, founder: { '@id': abs('/#person', base) },
    address: { '@type': 'PostalAddress', addressLocality: 'Malang', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    sameAs: ['https://www.instagram.com/sidigs.id/'],
  };
}
export const websiteLd = (base: string, name: string) => ({ '@type': 'WebSite', '@id': abs('/#website', base), url: abs('/', base), name, inLanguage: 'id', publisher: { '@id': abs('/#person', base) } });

export function breadcrumbLd(base: string, crumbs: { name: string; href?: string }[], current: string) {
  return { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.href ?? current, base) })) };
}
export function articleLd(base: string, a: Article, image?: string | null) {
  return {
    '@type': 'Article', headline: a.title, description: a.seo_description ?? a.excerpt ?? undefined,
    image: image ? [abs(image, base)] : undefined, datePublished: a.published_at, dateModified: a.updated_at ?? a.published_at,
    mainEntityOfPage: abs(`/artikel/${a.slug}`, base), inLanguage: 'id',
    author: { '@id': abs('/#person', base) }, publisher: { '@id': abs('/#person', base) },
    articleSection: a.category?.name, keywords: a.tags.map((t) => t.name).join(', ') || undefined,
  };
}
/** Serialisasi aman untuk dimasukkan ke <script type="application/ld+json">. */
export const ldScript = (nodes: object[]) => JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
