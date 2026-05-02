create table if not exists public.alert_history (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  alert_rule_id uuid references public.alert_rules(id) on delete set null,
  trigger_reason text not null,
  delivered_to text not null default 'telegram',
  delivered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (content_item_id)
);

create index if not exists alert_history_content_item_id_idx
on public.alert_history(content_item_id);

create index if not exists alert_history_delivered_at_idx
on public.alert_history(delivered_at desc);

alter table public.alert_history enable row level security;

create policy "single user can read alert history"
on public.alert_history for select
to authenticated
using (true);

create policy "single user can write alert history"
on public.alert_history for all
to authenticated
using (true)
with check (true);
