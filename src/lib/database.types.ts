// Tipe skema database. Ditulis tangan mengikuti supabase/migrations/*.sql dalam format
// yang sama dengan `supabase gen types typescript`; bila CLI tersedia, boleh digantikan hasil generate.
// Perbarui bersamaan dengan migrasi.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Rel = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type ArticleStatus = 'draft' | 'scheduled' | 'published';
export type ProjectStatus = 'active' | 'exploring' | 'archived';
export type ContactPurpose = 'undangan_berbicara' | 'diskusi_pendidikan' | 'kolaborasi' | 'lainnya';

type Table<Row, Insert, Relationships extends Rel[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: Relationships;
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<
        { id: string; email: string; created_at: string },
        { id?: string; email: string; created_at?: string }
      >;
      categories: Table<
        { id: string; name: string; slug: string; description: string | null; sort_order: number; created_at: string },
        { id?: string; name: string; slug: string; description?: string | null; sort_order?: number; created_at?: string }
      >;
      tags: Table<
        { id: string; name: string; slug: string; created_at: string },
        { id?: string; name: string; slug: string; created_at?: string }
      >;
      articles: Table<
        {
          id: string; title: string; slug: string; subtitle: string | null; excerpt: string | null; content: string;
          cover_url: string | null; cover_alt: string | null; cover_credit: string | null; category_id: string | null;
          status: ArticleStatus; is_featured: boolean; is_sample: boolean; reading_minutes: number | null;
          published_at: string | null; seo_title: string | null; seo_description: string | null;
          canonical_url: string | null; og_image_url: string | null; noindex: boolean;
          created_at: string; updated_at: string;
        },
        {
          id?: string; title: string; slug: string; subtitle?: string | null; excerpt?: string | null; content?: string;
          cover_url?: string | null; cover_alt?: string | null; cover_credit?: string | null; category_id?: string | null;
          status?: ArticleStatus; is_featured?: boolean; is_sample?: boolean; reading_minutes?: number | null;
          published_at?: string | null; seo_title?: string | null; seo_description?: string | null;
          canonical_url?: string | null; og_image_url?: string | null; noindex?: boolean;
          created_at?: string; updated_at?: string;
        },
        [{ foreignKeyName: 'articles_category_id_fkey'; columns: ['category_id']; referencedRelation: 'categories'; referencedColumns: ['id'] }]
      >;
      article_tags: Table<
        { article_id: string; tag_id: string },
        { article_id: string; tag_id: string },
        [
          { foreignKeyName: 'article_tags_article_id_fkey'; columns: ['article_id']; referencedRelation: 'articles'; referencedColumns: ['id'] },
          { foreignKeyName: 'article_tags_tag_id_fkey'; columns: ['tag_id']; referencedRelation: 'tags'; referencedColumns: ['id'] },
        ]
      >;
      article_related: Table<
        { article_id: string; related_id: string; sort_order: number },
        { article_id: string; related_id: string; sort_order?: number },
        [
          { foreignKeyName: 'article_related_article_id_fkey'; columns: ['article_id']; referencedRelation: 'articles'; referencedColumns: ['id'] },
          { foreignKeyName: 'article_related_related_id_fkey'; columns: ['related_id']; referencedRelation: 'articles'; referencedColumns: ['id'] },
        ]
      >;
      media: Table<
        { id: string; url: string; alt: string | null; width: number | null; height: number | null; created_at: string },
        { id?: string; url: string; alt?: string | null; width?: number | null; height?: number | null; created_at?: string }
      >;
      projects: Table<
        {
          id: string; name: string; slug: string; summary: string | null; description: string | null; role: string | null;
          contributions: string[]; logo_url: string | null; poster_url: string | null; url: string | null; status: ProjectStatus;
          is_featured: boolean; is_published: boolean; sort_order: number; created_at: string; updated_at: string;
        },
        {
          id?: string; name: string; slug: string; summary?: string | null; description?: string | null; role?: string | null;
          contributions?: string[]; logo_url?: string | null; poster_url?: string | null; url?: string | null; status?: ProjectStatus;
          is_featured?: boolean; is_published?: boolean; sort_order?: number; created_at?: string; updated_at?: string;
        }
      >;
      ebooks: Table<
        {
          id: string; title: string; slug: string; summary: string | null; tag: string | null; cover_url: string | null;
          url: string | null; is_published: boolean; sort_order: number; created_at: string; updated_at: string;
        },
        {
          id?: string; title: string; slug: string; summary?: string | null; tag?: string | null; cover_url?: string | null;
          url?: string | null; is_published?: boolean; sort_order?: number; created_at?: string; updated_at?: string;
        }
      >;
      speaking_topics: Table<
        {
          id: string; title: string; description: string | null; is_signature: boolean; is_published: boolean;
          sort_order: number; created_at: string; updated_at: string;
        },
        {
          id?: string; title: string; description?: string | null; is_signature?: boolean; is_published?: boolean;
          sort_order?: number; created_at?: string; updated_at?: string;
        }
      >;
      site_settings: Table<
        { key: string; value: Json; is_public: boolean; updated_at: string },
        { key: string; value?: Json; is_public?: boolean; updated_at?: string }
      >;
      contact_messages: Table<
        {
          id: string; name: string; email: string; subject: string; purpose: ContactPurpose;
          message: string; is_read: boolean; created_at: string;
        },
        {
          id?: string; name: string; email: string; subject: string; purpose?: ContactPurpose;
          message: string; is_read?: boolean; created_at?: string;
        }
      >;
      newsletter_subscribers: Table<
        { id: string; email: string; status: 'subscribed' | 'unsubscribed'; created_at: string },
        { id?: string; email: string; status?: 'subscribed' | 'unsubscribed'; created_at?: string }
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
