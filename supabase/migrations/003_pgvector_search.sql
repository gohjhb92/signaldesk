create extension if not exists vector;

alter table public.content_items
add column if not exists embedding vector(1536),
add column if not exists embedding_model text,
add column if not exists embedded_at timestamptz;

create index if not exists content_items_embedding_idx
on public.content_items
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create index if not exists content_items_text_search_idx
on public.content_items
using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' ||
    coalesce(summary, '') || ' ' ||
    coalesce(why_it_matters, '') || ' ' ||
    array_to_string(assets, ' ') || ' ' ||
    array_to_string(themes, ' ')
  )
);

create or replace function public.search_content_items(
  query_embedding vector(1536),
  query_text text,
  match_count int default 12
)
returns table (
  id uuid,
  title text,
  url text,
  source_type text,
  published_at timestamptz,
  summary text,
  why_it_matters text,
  sentiment text,
  importance_score numeric,
  assets text[],
  themes text[],
  analyst_name text,
  vector_score double precision,
  keyword_score real,
  combined_score double precision
)
language sql
stable
as $$
  with scored as (
    select
      ci.id,
      ci.title,
      ci.url,
      ci.source_type,
      ci.published_at,
      ci.summary,
      ci.why_it_matters,
      ci.sentiment,
      ci.importance_score,
      ci.assets,
      ci.themes,
      a.name as analyst_name,
      case
        when ci.embedding is null then 0
        else 1 - (ci.embedding <=> query_embedding)
      end as vector_score,
      ts_rank_cd(
        to_tsvector(
          'english',
          coalesce(ci.title, '') || ' ' ||
          coalesce(ci.summary, '') || ' ' ||
          coalesce(ci.why_it_matters, '') || ' ' ||
          array_to_string(ci.assets, ' ') || ' ' ||
          array_to_string(ci.themes, ' ')
        ),
        websearch_to_tsquery('english', query_text)
      ) as keyword_score
    from public.content_items ci
    join public.analysts a on a.id = ci.analyst_id
  )
  select
    scored.*,
    (scored.vector_score * 0.7 + scored.keyword_score * 0.3) as combined_score
  from scored
  where scored.vector_score > 0.2 or scored.keyword_score > 0
  order by combined_score desc, published_at desc nulls last
  limit match_count;
$$;
