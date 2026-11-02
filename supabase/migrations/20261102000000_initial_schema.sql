-- ============================================================================
-- Transbara Wahyu: skema database, RLS, dan otorisasi admin
-- ============================================================================
-- Idempotent: aman dijalankan pada database kosong MAUPUN database yang sudah
-- berisi data. Tidak ada DROP TABLE / DROP COLUMN / TRUNCATE / DELETE.
-- Hanya policy (aturan akses) yang di-drop lalu dibuat ulang.
--
-- Skema diturunkan dari pemakaian nyata di kode:
--   src/lib/data.ts, src/lib/content.ts, src/admin/views/*, src/pages/kontak.astro,
--   src/components/Newsletter.astro, src/admin/sb.ts
-- Jalankan di Supabase Dashboard > SQL Editor, SEBELUM file ..._storage.sql.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Fungsi bantu
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. Tabel
-- ----------------------------------------------------------------------------

-- 2.1 Admin: daftar email yang boleh mengelola konten.
-- Diisi HANYA lewat SQL Editor (lihat SUPABASE_SETUP.md). Tidak ada policy tulis,
-- jadi tidak ada user (termasuk admin) yang bisa menambah admin lewat API.
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  created_at timestamptz not null default now()
);
alter table public.admin_users
  add column if not exists email text,
  add column if not exists created_at timestamptz not null default now();
create unique index if not exists admin_users_email_lower_key on public.admin_users (lower(email));

-- 2.2 Kategori artikel
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.categories
  add column if not exists description text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now();
create unique index if not exists categories_slug_key on public.categories (slug);

-- 2.3 Tag
create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);
alter table public.tags
  add column if not exists created_at timestamptz not null default now();
create unique index if not exists tags_slug_key on public.tags (slug);

-- 2.4 Artikel
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  subtitle        text,
  excerpt         text,
  content         text not null default '',
  cover_url       text,
  cover_alt       text,
  cover_credit    text,
  category_id     uuid references public.categories (id) on delete set null,
  status          text not null default 'draft',
  is_featured     boolean not null default false,
  is_sample       boolean not null default false,
  reading_minutes integer,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  canonical_url   text,
  og_image_url    text,
  noindex         boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.articles
  add column if not exists subtitle text,
  add column if not exists excerpt text,
  add column if not exists content text not null default '',
  add column if not exists cover_url text,
  add column if not exists cover_alt text,
  add column if not exists cover_credit text,
  add column if not exists category_id uuid,
  add column if not exists status text not null default 'draft',
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_sample boolean not null default false,
  add column if not exists reading_minutes integer,
  add column if not exists published_at timestamptz,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists canonical_url text,
  add column if not exists og_image_url text,
  add column if not exists noindex boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
create unique index if not exists articles_slug_key on public.articles (slug);
create index if not exists articles_published_at_idx on public.articles (published_at desc) where status <> 'draft';
create index if not exists articles_updated_at_idx   on public.articles (updated_at desc);
create index if not exists articles_category_id_idx  on public.articles (category_id);
create index if not exists articles_featured_idx     on public.articles (is_featured) where is_featured;

-- 2.5 Relasi artikel <-> tag
create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id     uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);
create index if not exists article_tags_tag_id_idx on public.article_tags (tag_id);

-- 2.6 Artikel terkait (pilihan manual, berurutan)
create table if not exists public.article_related (
  article_id uuid not null references public.articles (id) on delete cascade,
  related_id uuid not null references public.articles (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (article_id, related_id)
);
alter table public.article_related
  add column if not exists sort_order integer not null default 0;
create index if not exists article_related_related_id_idx on public.article_related (related_id);

-- 2.7 Pustaka media (catatan file yang diunggah ke Storage bucket "media")
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  alt        text,
  width      integer,
  height     integer,
  created_at timestamptz not null default now()
);
alter table public.media
  add column if not exists alt text,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists created_at timestamptz not null default now();
create index if not exists media_created_at_idx on public.media (created_at desc);

-- 2.8 Proyek
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  summary       text,
  description   text,
  role          text,
  contributions text[] not null default '{}',
  logo_url      text,
  url           text,
  status        text not null default 'active',
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.projects
  add column if not exists summary text,
  add column if not exists description text,
  add column if not exists role text,
  add column if not exists contributions text[] not null default '{}',
  add column if not exists logo_url text,
  add column if not exists url text,
  add column if not exists status text not null default 'active',
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_published boolean not null default true,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
create unique index if not exists projects_slug_key on public.projects (slug);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- 2.9 Topik bicara
create table if not exists public.speaking_topics (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  is_signature boolean not null default false,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.speaking_topics
  add column if not exists description text,
  add column if not exists is_signature boolean not null default false,
  add column if not exists is_published boolean not null default true,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
create index if not exists speaking_topics_sort_order_idx on public.speaking_topics (sort_order);

-- 2.10 Pengaturan situs (key/value JSON). Semua konten landing page + identitas, kontak, sosmed.
-- is_public = false untuk pengaturan internal yang tidak boleh dibaca pengunjung.
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  is_public  boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.site_settings
  add column if not exists value jsonb not null default '{}'::jsonb,
  add column if not exists is_public boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

-- 2.11 Pesan dari formulir Kontak
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  purpose    text not null default 'lainnya',
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages
  add column if not exists purpose text not null default 'lainnya',
  add column if not exists is_read boolean not null default false,
  add column if not exists created_at timestamptz not null default now();
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_unread_idx on public.contact_messages (created_at desc) where not is_read;

-- 2.12 Pelanggan newsletter
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  status     text not null default 'subscribed',
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers
  add column if not exists status text not null default 'subscribed',
  add column if not exists created_at timestamptz not null default now();
-- Mencegah langganan ganda tanpa membedakan huruf besar/kecil. Form publik mengandalkan kode error 23505.
create unique index if not exists newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));
create index if not exists newsletter_subscribers_created_at_idx on public.newsletter_subscribers (created_at desc);

-- ----------------------------------------------------------------------------
-- 3. CHECK constraint (NOT VALID: berlaku untuk data baru, tidak memindai /
--    menolak data lama. Jalankan VALIDATE CONSTRAINT bila data lama sudah bersih)
-- ----------------------------------------------------------------------------
do $$
declare c record;
begin
  for c in
    select * from (values
      ('articles',  'articles_status_check',          'check (status in (''draft'', ''scheduled'', ''published''))'),
      ('articles',  'articles_published_date_check',  'check (status = ''draft'' or published_at is not null)'),
      ('articles',  'articles_reading_minutes_check', 'check (reading_minutes is null or reading_minutes > 0)'),
      ('articles',  'articles_slug_format_check',     'check (slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$'')'),
      ('categories','categories_slug_format_check',   'check (slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$'')'),
      ('tags',      'tags_slug_format_check',         'check (slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$'')'),
      ('projects',  'projects_slug_format_check',     'check (slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$'')'),
      ('projects',  'projects_status_check',          'check (status in (''active'', ''exploring'', ''archived''))'),
      ('article_related', 'article_related_not_self_check', 'check (article_id <> related_id)'),
      ('contact_messages', 'contact_messages_purpose_check',
         'check (purpose in (''undangan_berbicara'', ''diskusi_pendidikan'', ''kolaborasi'', ''lainnya''))'),
      ('contact_messages', 'contact_messages_length_check',
         'check (char_length(btrim(name)) between 1 and 200 and char_length(btrim(subject)) between 1 and 300 and char_length(btrim(message)) between 1 and 10000)'),
      ('contact_messages', 'contact_messages_email_check',
         'check (char_length(email) <= 254 and email ~ ''^[^@\s]+@[^@\s]+\.[^@\s]+$'')'),
      ('newsletter_subscribers', 'newsletter_subscribers_email_check',
         'check (char_length(email) <= 254 and email ~ ''^[^@\s]+@[^@\s]+\.[^@\s]+$'')'),
      ('newsletter_subscribers', 'newsletter_subscribers_status_check',
         'check (status in (''subscribed'', ''unsubscribed''))')
    ) as t(tbl, name, def)
  loop
    if not exists (
      select 1 from pg_constraint
      where conname = c.name and conrelid = format('public.%I', c.tbl)::regclass
    ) then
      execute format('alter table public.%I add constraint %I %s not valid', c.tbl, c.name, c.def);
    end if;
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 4. Trigger updated_at
-- ----------------------------------------------------------------------------
drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists speaking_topics_set_updated_at on public.speaking_topics;
create trigger speaking_topics_set_updated_at before update on public.speaking_topics
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Otorisasi admin
-- ----------------------------------------------------------------------------
-- Admin = akun Supabase Auth yang emailnya sudah TERKONFIRMASI dan tercatat di
-- public.admin_users. Dicocokkan ke auth.users (bukan klaim JWT yang dikirim klien).
-- SECURITY DEFINER agar bisa membaca auth.users; search_path dikosongkan agar tidak
-- bisa dibajak. Mengembalikan false untuk anon / pengguna biasa.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 6. Hak akses tingkat tabel (lapisan kedua di bawah RLS)
-- ----------------------------------------------------------------------------
-- Cabut semua hak bawaan, lalu beri hanya yang dibutuhkan. RLS tetap menentukan baris mana.
revoke all on public.admin_users, public.categories, public.tags, public.articles,
  public.article_tags, public.article_related, public.media, public.projects,
  public.speaking_topics, public.site_settings, public.contact_messages,
  public.newsletter_subscribers
from anon, authenticated;

-- Pengunjung: baca konten publik, kirim pesan, daftar newsletter.
grant select on public.categories, public.tags, public.articles, public.article_tags,
  public.article_related, public.projects, public.speaking_topics, public.site_settings
to anon;
grant insert on public.contact_messages, public.newsletter_subscribers to anon;

-- Pengguna login: hak dasar sama; baris yang boleh disentuh dibatasi policy (is_admin()).
grant select, insert, update, delete on public.categories, public.tags, public.articles,
  public.article_tags, public.article_related, public.media, public.projects,
  public.speaking_topics, public.site_settings, public.contact_messages,
  public.newsletter_subscribers
to authenticated;
-- admin_users: hanya baca (dan hanya admin yang lolos policy). Tidak ada hak tulis via API.
grant select on public.admin_users to authenticated;

-- ----------------------------------------------------------------------------
-- 7. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.admin_users            enable row level security;
alter table public.categories             enable row level security;
alter table public.tags                   enable row level security;
alter table public.articles               enable row level security;
alter table public.article_tags           enable row level security;
alter table public.article_related        enable row level security;
alter table public.media                  enable row level security;
alter table public.projects               enable row level security;
alter table public.speaking_topics        enable row level security;
alter table public.site_settings          enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Bersihkan policy lama (nama apa pun) pada tabel aplikasi supaya tidak ada policy longgar yang tertinggal.
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('admin_users','categories','tags','articles','article_tags','article_related',
                        'media','projects','speaking_topics','site_settings','contact_messages','newsletter_subscribers')
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- 7.1 admin_users: hanya admin yang boleh melihat daftar. Tidak ada policy INSERT/UPDATE/DELETE.
create policy admin_users_select_admin on public.admin_users
  for select to authenticated
  using ((select public.is_admin()));

-- 7.2 Konten publik (baca) ----------------------------------------------------
create policy categories_select_public on public.categories
  for select to anon, authenticated using (true);

create policy tags_select_public on public.tags
  for select to anon, authenticated using (true);

-- Artikel tampil bila bukan draft dan tanggal terbitnya sudah lewat.
-- ("scheduled" yang tanggalnya sudah lewat dianggap terbit, sama dengan logika admin.)
create policy articles_select_public on public.articles
  for select to anon, authenticated
  using (status in ('published', 'scheduled') and published_at <= now());

-- Tag & artikel terkait hanya terlihat bila artikelnya sendiri terlihat
-- (sub-query ikut tunduk pada RLS articles).
create policy article_tags_select_public on public.article_tags
  for select to anon, authenticated
  using (exists (select 1 from public.articles a where a.id = article_tags.article_id));

create policy article_related_select_public on public.article_related
  for select to anon, authenticated
  using (
    exists (select 1 from public.articles a where a.id = article_related.article_id)
    and exists (select 1 from public.articles r where r.id = article_related.related_id)
  );

create policy projects_select_public on public.projects
  for select to anon, authenticated
  using (is_published and status in ('active', 'exploring'));

create policy speaking_topics_select_public on public.speaking_topics
  for select to anon, authenticated
  using (is_published);

create policy site_settings_select_public on public.site_settings
  for select to anon, authenticated
  using (is_public);

-- 7.3 Formulir publik (hanya tulis, tidak bisa baca) --------------------------
create policy contact_messages_insert_public on public.contact_messages
  for insert to anon, authenticated
  with check (is_read = false);

create policy newsletter_subscribers_insert_public on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (status = 'subscribed');

-- 7.4 Admin: akses penuh ------------------------------------------------------
create policy categories_admin_all on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy tags_admin_all on public.tags
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy articles_admin_all on public.articles
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy article_tags_admin_all on public.article_tags
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy article_related_admin_all on public.article_related
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy media_admin_all on public.media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy projects_admin_all on public.projects
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy speaking_topics_admin_all on public.speaking_topics
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy site_settings_admin_all on public.site_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy contact_messages_admin_all on public.contact_messages
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy newsletter_subscribers_admin_all on public.newsletter_subscribers
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

commit;
