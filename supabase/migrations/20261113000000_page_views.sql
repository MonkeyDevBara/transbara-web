-- ============================================================================
-- Transbara Wahyu: statistik kunjungan situs (traffic)
-- ============================================================================
-- Idempotent. Tidak ada DROP TABLE / DROP COLUMN / TRUNCATE / DELETE.
-- Jalankan di Supabase Dashboard > SQL Editor SETELAH ..._initial_schema.sql
-- (memakai public.is_admin()).
--
-- Alur: browser pengunjung -> POST /api/hit (server Astro) -> insert ke page_views.
-- Privasi: tidak ada IP, cookie, atau user-agent mentah yang disimpan. visitor_hash
-- = SHA-256(garam rahasia server + tanggal + IP + user-agent), berganti tiap hari,
-- sehingga pengunjung tidak bisa dilacak lintas hari.
-- ============================================================================

begin;

create table if not exists public.page_views (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  path          text not null,
  referrer_host text,
  visitor_hash  text not null,
  device        text not null default 'desktop'
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx       on public.page_views (path, created_at desc);

do $$
declare c record;
begin
  for c in
    select * from (values
      ('page_views_path_check',     'check (path like ''/%'' and char_length(path) <= 300)'),
      ('page_views_referrer_check', 'check (referrer_host is null or char_length(referrer_host) <= 253)'),
      ('page_views_visitor_check',  'check (char_length(visitor_hash) between 16 and 64)'),
      ('page_views_device_check',   'check (device in (''desktop'', ''mobile'', ''tablet''))')
    ) as t(name, def)
  loop
    if not exists (
      select 1 from pg_constraint
      where conname = c.name and conrelid = 'public.page_views'::regclass
    ) then
      execute format('alter table public.page_views add constraint %I %s', c.name, c.def);
    end if;
  end loop;
end $$;

-- Hak akses: pengunjung hanya boleh menulis (lewat server), admin boleh membaca.
revoke all on public.page_views from anon, authenticated;
grant insert on public.page_views to anon;
grant select on public.page_views to authenticated;

alter table public.page_views enable row level security;

drop policy if exists page_views_insert_public on public.page_views;
create policy page_views_insert_public on public.page_views
  for insert to anon
  with check (true);

drop policy if exists page_views_select_admin on public.page_views;
create policy page_views_select_admin on public.page_views
  for select to authenticated
  using ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- Ringkasan untuk dashboard admin. Satu panggilan, seluruh agregasi di database
-- (menghindari batas 1000 baris PostgREST). Hari dihitung zona Asia/Jakarta.
-- "visitors" = pengunjung unik per hari, dijumlahkan sepanjang rentang.
-- ----------------------------------------------------------------------------
create or replace function public.analytics_overview(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  tz       constant text := 'Asia/Jakarta';
  d        integer := least(greatest(coalesce(p_days, 30), 1), 365);
  today    date := (now() at time zone tz)::date;
  start_ts timestamptz;
  prev_ts  timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  start_ts := ((today - (d - 1))::timestamp) at time zone tz;
  prev_ts  := ((today - (2 * d - 1))::timestamp) at time zone tz;

  return (
    with daily_raw as (
      select (created_at at time zone tz)::date as dt,
             count(*) as views,
             count(distinct visitor_hash) as visitors
      from public.page_views
      where created_at >= prev_ts
      group by 1
    )
    select jsonb_build_object(
      'days', d,
      'views',          coalesce((select sum(views)    from daily_raw where dt >  today - d), 0),
      'visitors',       coalesce((select sum(visitors) from daily_raw where dt >  today - d), 0),
      'prev_views',     coalesce((select sum(views)    from daily_raw where dt <= today - d), 0),
      'prev_visitors',  coalesce((select sum(visitors) from daily_raw where dt <= today - d), 0),
      'today_views',    coalesce((select views    from daily_raw where dt = today), 0),
      'today_visitors', coalesce((select visitors from daily_raw where dt = today), 0),
      'daily', (
        select jsonb_agg(
                 jsonb_build_object('day', g.dt, 'views', coalesce(r.views, 0), 'visitors', coalesce(r.visitors, 0))
                 order by g.dt)
        from (select today - (d - 1) + i as dt from generate_series(0, d - 1) as i) g
        left join daily_raw r on r.dt = g.dt
      ),
      'pages', coalesce((
        select jsonb_agg(jsonb_build_object('path', path, 'views', views, 'visitors', visitors) order by views desc, path)
        from (
          select path, count(*) as views, count(distinct visitor_hash) as visitors
          from public.page_views
          where created_at >= start_ts
          group by path
          order by views desc, path
          limit 10
        ) p
      ), '[]'::jsonb),
      'referrers', coalesce((
        select jsonb_agg(jsonb_build_object('host', referrer_host, 'views', views) order by views desc, referrer_host)
        from (
          select referrer_host, count(*) as views
          from public.page_views
          where created_at >= start_ts and referrer_host is not null
          group by referrer_host
          order by views desc, referrer_host
          limit 8
        ) r
      ), '[]'::jsonb),
      'devices', coalesce((
        select jsonb_agg(jsonb_build_object('device', device, 'views', views) order by views desc, device)
        from (
          select device, count(*) as views
          from public.page_views
          where created_at >= start_ts
          group by device
        ) v
      ), '[]'::jsonb)
    )
  );
end;
$$;

revoke all on function public.analytics_overview(integer) from public, anon;
grant execute on function public.analytics_overview(integer) to authenticated;

commit;
