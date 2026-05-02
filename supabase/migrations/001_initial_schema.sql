create extension if not exists "pgcrypto";

create table if not exists public.analysts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  notes text,
  website text,
  x_handle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  analyst_id uuid not null references public.analysts(id) on delete cascade,
  source_type text not null check (
    source_type in ('rss', 'blog', 'substack', 'podcast', 'youtube', 'report', 'x_manual')
  ),
  source_url text not null,
  active boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  analyst_id uuid not null references public.analysts(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  title text not null,
  url text unique not null,
  source_type text,
  published_at timestamptz,
  raw_text text,
  summary text,
  why_it_matters text,
  sentiment text not null default 'unknown' check (
    sentiment in ('bullish', 'bearish', 'neutral', 'mixed', 'unknown')
  ),
  importance_score numeric not null default 0,
  assets text[] not null default '{}',
  themes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.content_tags (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  tag text not null,
  tag_type text not null default 'theme',
  created_at timestamptz not null default now(),
  unique (content_item_id, tag)
);

create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  keywords text[] not null default '{}',
  assets text[] not null default '{}',
  minimum_priority text check (minimum_priority in ('low', 'medium', 'high')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists analysts_set_updated_at on public.analysts;
create trigger analysts_set_updated_at
before update on public.analysts
for each row
execute function public.set_updated_at();

create index if not exists analysts_priority_idx on public.analysts(priority);
create index if not exists sources_analyst_id_idx on public.sources(analyst_id);
create index if not exists sources_active_idx on public.sources(active);
create index if not exists sources_source_url_idx on public.sources(source_url);
create index if not exists content_items_analyst_id_idx on public.content_items(analyst_id);
create index if not exists content_items_source_id_idx on public.content_items(source_id);
create index if not exists content_items_published_at_idx on public.content_items(published_at desc);
create index if not exists content_items_importance_score_idx on public.content_items(importance_score desc);
create index if not exists content_items_assets_idx on public.content_items using gin(assets);
create index if not exists content_items_themes_idx on public.content_items using gin(themes);
create index if not exists content_tags_content_item_id_idx on public.content_tags(content_item_id);
create index if not exists alert_rules_enabled_idx on public.alert_rules(enabled);

alter table public.analysts enable row level security;
alter table public.sources enable row level security;
alter table public.content_items enable row level security;
alter table public.content_tags enable row level security;
alter table public.alert_rules enable row level security;

create policy "single user can read analysts"
on public.analysts for select
to authenticated
using (true);

create policy "single user can write analysts"
on public.analysts for all
to authenticated
using (true)
with check (true);

create policy "single user can read sources"
on public.sources for select
to authenticated
using (true);

create policy "single user can write sources"
on public.sources for all
to authenticated
using (true)
with check (true);

create policy "single user can read content items"
on public.content_items for select
to authenticated
using (true);

create policy "single user can write content items"
on public.content_items for all
to authenticated
using (true)
with check (true);

create policy "single user can read content tags"
on public.content_tags for select
to authenticated
using (true);

create policy "single user can write content tags"
on public.content_tags for all
to authenticated
using (true)
with check (true);

create policy "single user can read alert rules"
on public.alert_rules for select
to authenticated
using (true);

create policy "single user can write alert rules"
on public.alert_rules for all
to authenticated
using (true)
with check (true);
