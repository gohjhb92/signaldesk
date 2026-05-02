import type { Database, Sentiment } from "@/types/database";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const SUMMARY_MODEL = "gpt-4o-mini";
const WATCHED_ASSETS = ["BTC", "ETH", "SOL", "SPX", "QQQ", "DXY", "GOLD", "TLT", "NVDA", "OIL"];
const MARKET_MOVING_THEMES = [
  "Fed",
  "ETF",
  "liquidity",
  "inflation",
  "oil",
  "earnings",
  "regulation",
  "recession",
  "breakout",
  "crash"
];

export type SummarizableContentItem = Pick<
  Database["public"]["Tables"]["content_items"]["Row"],
  "id" | "title" | "url" | "raw_text" | "published_at" | "source_type"
> & {
  analyst_priority?: string | null;
  analyst_name?: string | null;
};

export type ContentItemSummary = {
  summary: string[];
  why_it_matters: string;
  sentiment: Sentiment;
  assets: string[];
  themes: string[];
  importance_score: number;
};

const summarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "why_it_matters", "sentiment", "assets", "themes", "importance_score"],
  properties: {
    summary: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "string"
      }
    },
    why_it_matters: {
      type: "string"
    },
    sentiment: {
      type: "string",
      enum: ["bullish", "bearish", "neutral", "mixed", "unknown"]
    },
    assets: {
      type: "array",
      items: {
        type: "string"
      }
    },
    themes: {
      type: "array",
      items: {
        type: "string"
      }
    },
    importance_score: {
      type: "number",
      minimum: 0,
      maximum: 10
    }
  }
};

export async function summarizeContentItem(
  item: SummarizableContentItem
): Promise<ContentItemSummary> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: SUMMARY_MODEL,
      input: buildPrompt(item),
      text: {
        format: {
          type: "json_schema",
          name: "signaldesk_content_summary",
          strict: true,
          schema: summarySchema
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI summarization failed: ${response.status} ${errorText}`);
  }

  const body = (await response.json()) as OpenAIResponse;
  const outputText = extractOutputText(body);

  if (!outputText) {
    throw new Error("OpenAI response did not include output text.");
  }

  return parseSummaryJson(outputText);
}

function buildPrompt(item: SummarizableContentItem) {
  return `You are SignalDesk, a market-intelligence assistant for one active trader.

Summarize the content item below into trader-useful intelligence. Focus on market relevance,
possible directional implications, timing, assets mentioned, and risks. Do not invent facts.

Importance score rules:
- Return a number from 0 to 10.
- Score higher if analyst priority is high.
- Score higher if the item mentions watched assets: ${WATCHED_ASSETS.join(", ")}.
- Score higher if published recently.
- Score higher if it contains market-moving themes: ${MARKET_MOVING_THEMES.join(", ")}.
- Keep low-signal commentary below 4.

Return only valid JSON matching this exact shape:
{
  "summary": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "why_it_matters": "short trader-focused explanation",
  "sentiment": "bullish | bearish | neutral | mixed | unknown",
  "assets": ["BTC", "ETH", "SPX", "QQQ", "DXY", "GOLD"],
  "themes": ["liquidity", "inflation", "ETF flows", "risk appetite"],
  "importance_score": 0-10
}

Content item:
Title: ${item.title}
URL: ${item.url}
Source type: ${item.source_type ?? "unknown"}
Analyst: ${item.analyst_name ?? "unknown"}
Analyst priority: ${item.analyst_priority ?? "unknown"}
Published at: ${item.published_at ?? "unknown"}
Raw text or excerpt:
${item.raw_text?.slice(0, 8000) ?? "No raw text available."}`;
}

function parseSummaryJson(outputText: string): ContentItemSummary {
  try {
    const parsed = JSON.parse(outputText) as Partial<ContentItemSummary>;
    return validateSummary(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON parse error";
    throw new Error(`Invalid JSON from OpenAI: ${message}`);
  }
}

function validateSummary(value: Partial<ContentItemSummary>): ContentItemSummary {
  if (
    !Array.isArray(value.summary) ||
    value.summary.length !== 5 ||
    !value.summary.every((bullet) => typeof bullet === "string")
  ) {
    throw new Error("Invalid JSON from OpenAI: summary must contain exactly five strings.");
  }

  if (typeof value.why_it_matters !== "string") {
    throw new Error("Invalid JSON from OpenAI: why_it_matters must be a string.");
  }

  if (!isSentiment(value.sentiment)) {
    throw new Error("Invalid JSON from OpenAI: sentiment is not allowed.");
  }

  if (!Array.isArray(value.assets) || !value.assets.every((asset) => typeof asset === "string")) {
    throw new Error("Invalid JSON from OpenAI: assets must be an array of strings.");
  }

  if (!Array.isArray(value.themes) || !value.themes.every((theme) => typeof theme === "string")) {
    throw new Error("Invalid JSON from OpenAI: themes must be an array of strings.");
  }

  if (typeof value.importance_score !== "number" || Number.isNaN(value.importance_score)) {
    throw new Error("Invalid JSON from OpenAI: importance_score must be a number.");
  }

  return {
    summary: value.summary,
    why_it_matters: value.why_it_matters,
    sentiment: value.sentiment,
    assets: normalizeList(value.assets),
    themes: normalizeList(value.themes),
    importance_score: clampImportance(value.importance_score)
  };
}

function isSentiment(value: unknown): value is Sentiment {
  return (
    value === "bullish" ||
    value === "bearish" ||
    value === "neutral" ||
    value === "mixed" ||
    value === "unknown"
  );
}

function normalizeList(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function clampImportance(value: number) {
  return Math.min(10, Math.max(0, Math.round(value * 10) / 10));
}

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function extractOutputText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  return response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((text): text is string => Boolean(text))
    .join("")
    .trim();
}
