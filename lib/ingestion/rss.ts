import Parser from "rss-parser";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SourceType } from "@/types/database";

const RSS_SOURCE_TYPES: SourceType[] = ["rss", "blog", "substack", "podcast", "youtube"];

type SourceRow = Database["public"]["Tables"]["sources"]["Row"];
type ContentItemInsert = Database["public"]["Tables"]["content_items"]["Insert"];
type SignalDeskSupabaseClient = SupabaseClient<Database>;

type FeedItem = {
  title?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
};

const parser = new Parser<Record<string, unknown>, FeedItem>({
  timeout: 15000,
  customFields: {
    item: [
      ["media:description", "mediaDescription"],
      ["itunes:summary", "itunesSummary"]
    ]
  }
});

export type SourceIngestionResult = {
  sourceId: string;
  sourceUrl: string;
  sourceType: SourceType;
  ok: boolean;
  fetchedCount: number;
  insertedCount: number;
  duplicateCount: number;
  skippedCount: number;
  error?: string;
};

export type RssIngestionResult = {
  ok: boolean;
  startedAt: string;
  finishedAt: string;
  sourceCount: number;
  insertedCount: number;
  duplicateCount: number;
  skippedCount: number;
  failedCount: number;
  results: SourceIngestionResult[];
};

export async function runRssIngestion(
  supabase: SignalDeskSupabaseClient
): Promise<RssIngestionResult> {
  const startedAt = new Date().toISOString();
  console.info("[rss-ingest] Starting RSS ingestion", { startedAt });

  const { data: sources, error } = await supabase
    .from("sources")
    .select("*")
    .eq("active", true)
    .in("source_type", RSS_SOURCE_TYPES);

  if (error) {
    console.error("[rss-ingest] Failed to load active sources", error);
    throw new Error(`Failed to load active sources: ${error.message}`);
  }

  const results: SourceIngestionResult[] = [];

  for (const source of sources ?? []) {
    const result = await ingestSource(supabase, source);
    results.push(result);
  }

  const finishedAt = new Date().toISOString();
  const summary: RssIngestionResult = {
    ok: results.every((result) => result.ok),
    startedAt,
    finishedAt,
    sourceCount: results.length,
    insertedCount: results.reduce((total, result) => total + result.insertedCount, 0),
    duplicateCount: results.reduce((total, result) => total + result.duplicateCount, 0),
    skippedCount: results.reduce((total, result) => total + result.skippedCount, 0),
    failedCount: results.filter((result) => !result.ok).length,
    results
  };

  console.info("[rss-ingest] Finished RSS ingestion", summary);
  return summary;
}

async function ingestSource(
  supabase: SignalDeskSupabaseClient,
  source: SourceRow
): Promise<SourceIngestionResult> {
  console.info("[rss-ingest] Checking source", {
    sourceId: source.id,
    sourceType: source.source_type,
    sourceUrl: source.source_url
  });

  const baseResult: SourceIngestionResult = {
    sourceId: source.id,
    sourceUrl: source.source_url,
    sourceType: source.source_type,
    ok: false,
    fetchedCount: 0,
    insertedCount: 0,
    duplicateCount: 0,
    skippedCount: 0
  };

  try {
    const feed = await parser.parseURL(source.source_url);
    const items = feed.items ?? [];
    baseResult.fetchedCount = items.length;

    for (const item of items) {
      const url = normalizeUrl(item.link ?? item.guid);
      const title = normalizeText(item.title);

      if (!url || !title) {
        baseResult.skippedCount += 1;
        continue;
      }

      const { data: existing, error: lookupError } = await supabase
        .from("content_items")
        .select("id")
        .eq("url", url)
        .maybeSingle();

      if (lookupError) {
        console.warn("[rss-ingest] URL lookup failed", {
          sourceId: source.id,
          url,
          error: lookupError.message
        });
        baseResult.skippedCount += 1;
        continue;
      }

      if (existing) {
        baseResult.duplicateCount += 1;
        continue;
      }

      const insert: ContentItemInsert = {
        analyst_id: source.analyst_id,
        source_id: source.id,
        title,
        url,
        source_type: source.source_type,
        published_at: parseDate(item.isoDate ?? item.pubDate),
        raw_text: extractRawText(item),
        sentiment: "unknown",
        importance_score: 0
      };

      const { error: insertError } = await supabase.from("content_items").insert(insert);

      if (insertError) {
        if (insertError.code === "23505") {
          baseResult.duplicateCount += 1;
          continue;
        }

        console.warn("[rss-ingest] Insert failed", {
          sourceId: source.id,
          url,
          error: insertError.message
        });
        baseResult.skippedCount += 1;
        continue;
      }

      baseResult.insertedCount += 1;
    }

    await markSourceChecked(supabase, source.id);

    console.info("[rss-ingest] Source complete", baseResult);
    return {
      ...baseResult,
      ok: true
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RSS ingestion error";
    console.error("[rss-ingest] Source failed", {
      sourceId: source.id,
      sourceUrl: source.source_url,
      error: message
    });

    await markSourceChecked(supabase, source.id);

    return {
      ...baseResult,
      ok: false,
      error: message
    };
  }
}

async function markSourceChecked(supabase: SignalDeskSupabaseClient, sourceId: string) {
  const { error } = await supabase
    .from("sources")
    .update({ last_checked_at: new Date().toISOString() })
    .eq("id", sourceId);

  if (error) {
    console.warn("[rss-ingest] Failed to update last_checked_at", {
      sourceId,
      error: error.message
    });
  }
}

function normalizeUrl(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.startsWith("http") ? trimmed : null;
}

function normalizeText(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim() || null;
}

function parseDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function extractRawText(item: FeedItem) {
  const candidate =
    item.contentSnippet ??
    item.summary ??
    item.content ??
    (item as FeedItem & { mediaDescription?: string; itunesSummary?: string }).mediaDescription ??
    (item as FeedItem & { mediaDescription?: string; itunesSummary?: string }).itunesSummary;

  return normalizeText(stripHtml(candidate));
}

function stripHtml(value: string | undefined) {
  return value?.replace(/<[^>]*>/g, " ");
}
