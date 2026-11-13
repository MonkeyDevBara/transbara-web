-- ============================================================================
-- Tab "E-Book" di seksi Karya + poster untuk "Proyek Lainnya".
-- Jalankan di SQL Editor Supabase (Run), SETELAH 20261102000000_initial_schema.sql.
-- Idempotent. Tidak menghapus data. Hanya policy tabel ebooks yang di-drop lalu dibuat ulang.
--
--  projects.poster_url : poster potret kartu Proyek Lainnya (opsional; kosong = kartu tanpa gambar).
--  ebooks              : daftar e-book (judul, sampul potret, label, tautan baca/unduh).
-- ============================================================================
begin;

alter table public.projects
  add column if not exists poster_url text;

create table if not exists public.ebooks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  summary      text,
  tag          text,
  cover_url    text,
  url          text,
  is_published boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.ebooks
  add column if not exists summary text,
  add column if not exists tag text,
  add column if not exists cover_url text,
  add column if not exists url text,
  add column if not exists is_published boolean not null default true,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
create unique index if not exists ebooks_slug_key on public.ebooks (slug);
create index if not exists ebooks_sort_order_idx on public.ebooks (sort_order);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'ebooks_slug_format_check' and conrelid = 'public.ebooks'::regclass
  ) then
    alter table public.ebooks
      add constraint ebooks_slug_format_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') not valid;
  end if;
end $$;

drop trigger if exists ebooks_set_updated_at on public.ebooks;
create trigger ebooks_set_updated_at before update on public.ebooks
  for each row execute function public.set_updated_at();

revoke all on public.ebooks from anon, authenticated;
grant select on public.ebooks to anon;
grant select, insert, update, delete on public.ebooks to authenticated;

alter table public.ebooks enable row level security;

drop policy if exists ebooks_select_public on public.ebooks;
drop policy if exists ebooks_admin_all on public.ebooks;

create policy ebooks_select_public on public.ebooks
  for select to anon, authenticated
  using (is_published);

create policy ebooks_admin_all on public.ebooks
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Paksa PostgREST memuat ulang schema cache supaya kolom/tabel baru langsung dikenali API.
notify pgrst, 'reload schema';

commit;
