create table if not exists public.trade_theses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  status text not null default 'watching' check (status in ('watching', 'building', 'active', 'trimming', 'exited')),
  horizon text,
  conviction text not null default 'medium' check (conviction in ('low', 'medium', 'high')),
  assets text[] not null default '{}',
  themes text[] not null default '{}',
  bull_case text,
  bear_case text,
  catalysts text[] not null default '{}',
  invalidation_signals text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trade_theses_status_idx on public.trade_theses (status);
create index if not exists trade_theses_conviction_idx on public.trade_theses (conviction);
create index if not exists trade_theses_assets_idx on public.trade_theses using gin (assets);
create index if not exists trade_theses_themes_idx on public.trade_theses using gin (themes);

drop trigger if exists set_trade_theses_updated_at on public.trade_theses;
create trigger set_trade_theses_updated_at
before update on public.trade_theses
for each row execute function public.set_updated_at();

alter table public.trade_theses enable row level security;

create policy "Single user can read trade theses"
on public.trade_theses for select
using (true);

create policy "Single user can insert trade theses"
on public.trade_theses for insert
with check (true);

create policy "Single user can update trade theses"
on public.trade_theses for update
using (true)
with check (true);

create policy "Single user can delete trade theses"
on public.trade_theses for delete
using (true);
