import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AnalystPriority } from "@/types/database";
import { sendTelegramMessage } from "@/lib/alerts/telegram";

type SignalDeskSupabaseClient = SupabaseClient<Database>;
type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
type Analyst = Database["public"]["Tables"]["analysts"]["Row"];
type Source = Database["public"]["Tables"]["sources"]["Row"];
type AlertRule = Database["public"]["Tables"]["alert_rules"]["Row"];

type AlertCandidate = ContentItem & {
  analyst?: Pick<Analyst, "name" | "priority">;
  source?: Pick<Source, "source_type" | "source_url"> | null;
};

export type AlertRunResult = {
  ok: boolean;
  evaluatedCount: number;
  sentCount: number;
  skippedCount: number;
  failedCount: number;
  results: Array<{
    itemId: string;
    title: string;
    sent: boolean;
    reason?: string;
    error?: string;
  }>;
};

const priorityRank: Record<AnalystPriority, number> = {
  low: 1,
  medium: 2,
  high: 3
};

export async function runAlertEvaluation(
  supabase: SignalDeskSupabaseClient
): Promise<AlertRunResult> {
  console.info("[alerts] Starting alert evaluation");

  const [items, rules, alertedIds] = await Promise.all([
    loadRecentContentItems(supabase),
    loadEnabledAlertRules(supabase),
    loadAlertedItemIds(supabase)
  ]);

  const candidates = items.filter((item) => !alertedIds.has(item.id));
  const results: AlertRunResult["results"] = [];

  for (const item of candidates) {
    const trigger = evaluateAlertTrigger(item, rules);

    if (!trigger) {
      results.push({
        itemId: item.id,
        title: item.title,
        sent: false,
        reason: "No alert rule matched"
      });
      continue;
    }

    try {
      await sendTelegramMessage(formatTelegramAlert(item, trigger.reason));

      const { error } = await supabase.from("alert_history").insert({
        content_item_id: item.id,
        alert_rule_id: trigger.ruleId,
        trigger_reason: trigger.reason,
        delivered_to: "telegram"
      });

      if (error && error.code !== "23505") {
        throw new Error(`Failed to record alert history: ${error.message}`);
      }

      results.push({
        itemId: item.id,
        title: item.title,
        sent: true,
        reason: trigger.reason
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown alert error";
      console.error("[alerts] Failed to alert item", { itemId: item.id, error: message });
      results.push({
        itemId: item.id,
        title: item.title,
        sent: false,
        reason: trigger.reason,
        error: message
      });
    }
  }

  const summary = {
    ok: results.every((result) => !result.error),
    evaluatedCount: candidates.length,
    sentCount: results.filter((result) => result.sent).length,
    skippedCount: results.filter((result) => !result.sent && !result.error).length,
    failedCount: results.filter((result) => result.error).length,
    results
  };

  console.info("[alerts] Finished alert evaluation", summary);
  return summary;
}

export function evaluateAlertTrigger(item: AlertCandidate, rules: AlertRule[]) {
  if (item.importance_score >= 8) {
    return {
      ruleId: null,
      reason: "Importance score >= 8"
    };
  }

  if (item.analyst?.priority === "high") {
    return {
      ruleId: null,
      reason: "High-priority analyst posted new content"
    };
  }

  for (const rule of rules) {
    const keywordMatch = rule.keywords.some((keyword) => textMatches(item, keyword));
    const assetMatch = rule.assets.some((asset) => item.assets.includes(asset));
    const priorityMatch =
      !rule.minimum_priority ||
      priorityRank[item.analyst?.priority ?? "low"] >= priorityRank[rule.minimum_priority];

    if (priorityMatch && (keywordMatch || assetMatch)) {
      return {
        ruleId: rule.id,
        reason: `Matched alert rule: ${rule.name}`
      };
    }
  }

  return null;
}

export function formatTelegramAlert(item: AlertCandidate, reason?: string) {
  return [
    "🚨 SignalDesk Alert",
    `Analyst: ${item.analyst?.name ?? "Unknown"}`,
    `Source: ${item.source?.source_type ?? item.source_type ?? "Unknown"}`,
    `Title: ${item.title}`,
    `Assets: ${item.assets.length ? item.assets.join(", ") : "None detected"}`,
    `Themes: ${item.themes.length ? item.themes.join(", ") : "None detected"}`,
    `Sentiment: ${item.sentiment}`,
    `Importance: ${item.importance_score}/10`,
    `Why it matters: ${item.why_it_matters ?? item.summary ?? reason ?? "No summary available."}`,
    `Link: ${item.url}`
  ].join("\n");
}

async function loadRecentContentItems(supabase: SignalDeskSupabaseClient): Promise<AlertCandidate[]> {
  const { data: items, error } = await supabase
    .from("content_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to load content_items: ${error.message}`);
  }

  const analystIds = [...new Set((items ?? []).map((item) => item.analyst_id))];
  const sourceIds = [
    ...new Set((items ?? []).map((item) => item.source_id).filter((id): id is string => Boolean(id)))
  ];
  const [analysts, sources] = await Promise.all([
    loadAnalystsById(supabase, analystIds),
    loadSourcesById(supabase, sourceIds)
  ]);

  return (items ?? []).map((item) => ({
    ...item,
    analyst: analysts.get(item.analyst_id),
    source: item.source_id ? sources.get(item.source_id) ?? null : null
  }));
}

async function loadEnabledAlertRules(supabase: SignalDeskSupabaseClient) {
  const { data, error } = await supabase.from("alert_rules").select("*").eq("enabled", true);

  if (error) {
    throw new Error(`Failed to load alert_rules: ${error.message}`);
  }

  return data ?? [];
}

async function loadAlertedItemIds(supabase: SignalDeskSupabaseClient) {
  const { data, error } = await supabase.from("alert_history").select("content_item_id");

  if (error) {
    throw new Error(`Failed to load alert_history: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.content_item_id));
}

async function loadAnalystsById(supabase: SignalDeskSupabaseClient, ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, Pick<Analyst, "name" | "priority">>();
  }

  const { data, error } = await supabase.from("analysts").select("id, name, priority").in("id", ids);

  if (error) {
    throw new Error(`Failed to load analysts: ${error.message}`);
  }

  return new Map((data ?? []).map((analyst) => [analyst.id, analyst]));
}

async function loadSourcesById(supabase: SignalDeskSupabaseClient, ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, Pick<Source, "source_type" | "source_url">>();
  }

  const { data, error } = await supabase
    .from("sources")
    .select("id, source_type, source_url")
    .in("id", ids);

  if (error) {
    throw new Error(`Failed to load sources: ${error.message}`);
  }

  return new Map((data ?? []).map((source) => [source.id, source]));
}

function textMatches(item: AlertCandidate, keyword: string) {
  const needle = keyword.toLowerCase();
  const haystack = [
    item.title,
    item.summary,
    item.why_it_matters,
    item.raw_text,
    item.themes.join(" "),
    item.assets.join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}
