import type { APIRoute } from 'astro';
import { getArticles, safe } from '../lib/data';
import { siteBase, abs } from '../lib/seo';

export const GET: APIRoute = async ({ site, url }) => {
  const base = siteBase({ site, url });
  const { data: articles } = await safe(getArticles, []);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const pages = ['/', '/tentang', '/proyek', '/artikel', '/kontak'].map((p) => ({ loc: abs(p, base), lastmod: undefined as string | undefined }));
  const posts = articles
    .filter((a) => a.status === 'published' && !a.noindex && !a.is_sample)
    .map((a) => ({ loc: abs(`/artikel/${a.slug}`, base), lastmod: (a.updated_at ?? a.published_at)?.slice(0, 10) }));
  const body = [...pages, ...posts]
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
