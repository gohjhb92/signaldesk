import assert from "node:assert/strict";
import test from "node:test";
import {
  buildFilterOptions,
  countValues,
  defaultDashboardFilters,
  filterContentItems,
  matchesDateRange
} from "../lib/utils/dashboard.js";
import { buildThesisEvidence, contentMatchesThesis } from "../lib/utils/theses.js";
import type { ContentItem, TradeThesis } from "../types/domain.js";

const now = new Date("2026-05-02T23:59:59+08:00");

const btcItem = makeItem({
  id: "btc",
  analystName: "Lyn Alden",
  analystPriority: "high",
  assets: ["BTC", "SPX"],
  tags: ["liquidity", "macro"],
  sentiment: "bullish",
  sourceType: "blog",
  publishedAtIso: "2026-05-02T08:40:00+08:00"
});

const oilItem = makeItem({
  id: "oil",
  analystName: "Kobeissi Letter",
  analystPriority: "medium",
  assets: ["OIL", "DXY"],
  tags: ["inflation", "commodities"],
  sentiment: "bearish",
  sourceType: "rss",
  publishedAtIso: "2026-04-20T08:40:00+08:00"
});

test("filterContentItems combines asset, theme, sentiment, and date filters", () => {
  const result = filterContentItems(
    [btcItem, oilItem],
    {
      ...defaultDashboardFilters,
      asset: "BTC",
      theme: "liquidity",
      sentiment: "bullish",
      dateRange: "today"
    },
    now
  );

  assert.deepEqual(
    result.map((item) => item.id),
    ["btc"]
  );
});

test("matchesDateRange excludes stale items from seven-day view", () => {
  assert.equal(matchesDateRange(btcItem, "7d", now), true);
  assert.equal(matchesDateRange(oilItem, "7d", now), false);
});

test("countValues sorts by frequency then name", () => {
  assert.deepEqual(countValues(["rates", "liquidity", "rates", "ETF flows"]), [
    { name: "rates", count: 2 },
    { name: "ETF flows", count: 1 },
    { name: "liquidity", count: 1 }
  ]);
});

test("buildFilterOptions returns unique sorted options", () => {
  const options = buildFilterOptions([btcItem, oilItem]);

  assert.deepEqual(options.assets, [
    ["BTC", "BTC"],
    ["DXY", "DXY"],
    ["OIL", "OIL"],
    ["SPX", "SPX"]
  ]);
});

test("contentMatchesThesis matches assets and themes", () => {
  const thesis = makeThesis({
    assets: ["BTC"],
    themes: ["liquidity"]
  });

  assert.equal(contentMatchesThesis(btcItem, thesis), true);
  assert.equal(contentMatchesThesis(oilItem, thesis), false);
});

test("buildThesisEvidence groups matching research by sentiment", () => {
  const thesis = makeThesis({
    assets: ["BTC", "OIL"],
    themes: []
  });
  const evidence = buildThesisEvidence([thesis], [btcItem, oilItem]).get(thesis.id);

  assert.equal(evidence?.supporting.length, 1);
  assert.equal(evidence?.opposing.length, 1);
  assert.equal(evidence?.neutral.length, 0);
});

function makeItem(overrides: Partial<ContentItem>): ContentItem {
  return {
    id: "item",
    title: "Sample item",
    sourceName: "Source",
    sourceType: "rss",
    analystName: "Analyst",
    analystPriority: "medium",
    url: "https://example.com",
    publishedAt: "Today",
    publishedAtIso: "2026-05-02T00:00:00+08:00",
    summary: "Summary",
    tags: [],
    assets: [],
    sentiment: "neutral",
    importanceScore: 5,
    ...overrides
  };
}

function makeThesis(overrides: Partial<TradeThesis>): TradeThesis {
  return {
    id: "thesis",
    name: "Sample thesis",
    category: "Crypto",
    status: "active",
    horizon: "6-24 months",
    conviction: "medium",
    assets: [],
    themes: [],
    bullCase: "Bull case",
    bearCase: "Bear case",
    catalysts: [],
    invalidationSignals: [],
    notes: "",
    ...overrides
  };
}
