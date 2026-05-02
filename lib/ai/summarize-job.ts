import type { SupabaseClient } from "@supabase/supabase-js";
import { summarizeContentItem, type SummarizableContentItem } from "@/lib/ai/summarize";
import type { Database } from "@/types/database";

type SignalDeskSupabaseClient = SupabaseClient<Database>;
type ContentItemRow = Database["public"]["Tables"]["content_items"]["Row"];
type AnalystRow = Database["public"]["Tables"]["analysts"]["Row"];

export type SummarizationItemResult = {
  itemId: string;
  title: string;
  ok: boolean;
  error?: string;
};

export type SummarizationJobResult = {
  ok: boolean;
  attemptedCount: number;
  summarizedCount: number;
  failedCount: number;
  results: SummarizationItemResult[];
};

export async function summarizeNewContentItems(
  supabase: SignalDeskSupabaseClient,
  limit = 10
): Promise<SummarizationJobResult> {
  console.info("[summarize] Starting summarization job", { limit });

  const { data: items, error } = await supabase
    .from("content_items")
    .select("id, analyst_id, title, url, source_type, published_at, raw_text, summary")
    .is("summary", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("[summarize] Failed to load unsummarized items", error);
    throw new Error(`Failed to load unsummarized content_items: ${error.message}`);
  }

  const analystIds = [...new Set((items ?? []).map((item) => item.analyst_id))];
  const analystsById = await loadAnalystsById(supabase, analystIds);
  const results: SummarizationItemResult[] = [];

  for (const item of items ?? []) {
    const result = await summarizeOneItem(supabase, item, analystsById.get(item.analyst_id));
    results.push(result);
  }

  const jobResult = {
    ok: results.every((result) => result.ok),
    attemptedCount: results.length,
    summarizedCount: results.filter((result) => result.ok).length,
    failedCount: results.filter((result) => !result.ok).length,
    results
  };

  console.info("[summarize] Finished summarization job", jobResult);
  return jobResult;
}

async function summarizeOneItem(
  supabase: SignalDeskSupabaseClient,
  item: Pick<
    ContentItemRow,
    "id" | "analyst_id" | "title" | "url" | "source_type" | "published_at" | "raw_text" | "summary"
  >,
  analyst: Pick<AnalystRow, "name" | "priority"> | undefined
): Promise<SummarizationItemResult> {
  console.info("[summarize] Summarizing item", { itemId: item.id, title: item.title });

  try {
    const summarizableItem: SummarizableContentItem = {
      id: item.id,
      title: item.title,
      url: item.url,
      raw_text: item.raw_text,
      published_at: item.published_at,
      source_type: item.source_type,
      analyst_name: analyst?.name,
      analyst_priority: analyst?.priority
    };
    const summary = await summarizeContentItem(summarizableItem);

    const { error } = await supabase
      .from("content_items")
      .update({
        summary: summary.summary.map((bullet) => `- ${bullet}`).join("\n"),
        why_it_matters: summary.why_it_matters,
        sentiment: summary.sentiment,
        assets: summary.assets,
        themes: summary.themes,
        importance_score: summary.importance_score
      })
      .eq("id", item.id);

    if (error) {
      throw new Error(`Failed to save summary: ${error.message}`);
    }

    return {
      itemId: item.id,
      title: item.title,
      ok: true
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown summarization error";
    console.error("[summarize] Item failed", { itemId: item.id, error: message });

    return {
      itemId: item.id,
      title: item.title,
      ok: false,
      error: message
    };
  }
}

async function loadAnalystsById(supabase: SignalDeskSupabaseClient, analystIds: string[]) {
  if (analystIds.length === 0) {
    return new Map<string, Pick<AnalystRow, "name" | "priority">>();
  }

  const { data, error } = await supabase
    .from("analysts")
    .select("id, name, priority")
    .in("id", analystIds);

  if (error) {
    console.warn("[summarize] Failed to load analyst priority context", error);
    return new Map<string, Pick<AnalystRow, "name" | "priority">>();
  }

  return new Map((data ?? []).map((analyst) => [analyst.id, analyst]));
}
