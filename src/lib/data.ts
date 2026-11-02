import { supabase } from './supabase';

export type Category = { id: string; name: string; slug: string; description: string | null; sort_order: number };
export type Tag = { id: string; name: string; slug: string };

export type Article = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  cover_alt: string | null;
  cover_credit: string | null;
  status: 'draft' | 'scheduled' | 'published';
  is_featured: boolean;
  is_sample: boolean;
  reading_minutes: number | null;
  published_at: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  noindex: boolean;
  category: Category | null;
  tags: Tag[];
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  role: string | null;
  contributions: string[];
  logo_url: string | null;
  url: string | null;
  status: 'active' | 'exploring' | 'archived';
  is_featured: boolean;
};

export type Topic = { id: string; title: string; description: string | null; is_signature: boolean };

const ARTICLE_SELECT = '*, category:categories(*), article_tags(tag:tags(*))';

function normalize(row: any): Article {
  const { article_tags, ...rest } = row;
  return { ...rest, tags: (article_tags ?? []).map((t: any) => t.tag).filter(Boolean) };
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalize);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select(ARTICLE_SELECT).eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? normalize(data) : null;
}

export async function getRelatedIds(articleId: string): Promise<string[]> {
  const { data } = await supabase
    .from('article_related')
    .select('related_id')
    .eq('article_id', articleId)
    .order('sort_order');
  return (data ?? []).map((r) => r.related_id);
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase.from('speaking_topics').select('*').order('sort_order');
  if (error) throw error;
  return data ?? [];
}

/** Jalankan query, kembalikan fallback + flag error agar halaman bisa menampilkan error state. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<{ data: T; error: boolean }> {
  try {
    return { data: await fn(), error: false };
  } catch (e) {
    console.error(e);
    return { data: fallback, error: true };
  }
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
  threads: 'Threads',
};
