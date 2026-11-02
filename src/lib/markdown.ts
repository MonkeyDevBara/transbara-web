import { Marked } from 'marked';

export type TocItem = { id: string; text: string; depth: 2 | 3 };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/** Render markdown artikel menjadi HTML, sekaligus membangun daftar isi dari H2/H3. */
export function renderArticle(md: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        // H1 dipakai judul halaman, jadi heading di isi artikel mulai dari H2.
        const level = Math.max(2, depth);
        let id = slugify(text) || 'bagian';
        while (used.has(id)) id += '-2';
        used.add(id);
        if (level <= 3) toc.push({ id, text: text.replace(/<[^>]+>/g, ''), depth: level as 2 | 3 });
        return `<h${level} id="${id}">${text}</h${level}>`;
      },
      image({ href, title, text }) {
        const [caption, credit] = (title ?? '').split(/\s*Kredit:\s*/);
        return `<figure class="article-figure"><img src="${href}" alt="${text}" loading="lazy" />${
          caption || credit
            ? `<figcaption>${caption ?? ''}${credit ? ` <span class="credit">Kredit: ${credit}</span>` : ''}</figcaption>`
            : ''
        }</figure>`;
      },
      paragraph({ tokens }) {
        // Hindari <figure> dibungkus <p>.
        if (tokens.length === 1 && tokens[0].type === 'image') return this.parser.parseInline(tokens);
        return `<p>${this.parser.parseInline(tokens)}</p>`;
      },
      blockquote({ tokens }) {
        return `<blockquote class="pull-quote">${this.parser.parse(tokens)}</blockquote>`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, toc };
}
