export type AnalystPriority = "low" | "medium" | "high";
export type Sentiment = "bullish" | "bearish" | "neutral" | "mixed" | "unknown";
export type SourceType = "rss" | "blog" | "substack" | "podcast" | "youtube" | "report" | "x_manual";
export type ThesisStatus = "watching" | "building" | "active" | "trimming" | "exited";

export type Analyst = {
  id: string;
  name: string;
  category: string;
  priority: AnalystPriority;
  notes: string;
  website: string;
  xHandle: string;
};

export type Source = {
  id: string;
  analystId: string;
  analystName: string;
  sourceType: SourceType;
  sourceUrl: string;
  active: boolean;
};

export type ContentItem = {
  id: string;
  title: string;
  sourceName: string;
  sourceType: SourceType;
  analystName: string;
  analystPriority: AnalystPriority;
  url: string;
  publishedAt: string;
  publishedAtIso: string;
  summary: string;
  tags: string[];
  assets: string[];
  sentiment: Sentiment;
  importanceScore: number;
};

export type ThemeSummary = {
  name: string;
  count: number;
  weight: number;
};

export type TradeThesis = {
  id: string;
  name: string;
  category: string;
  status: ThesisStatus;
  horizon: string;
  conviction: AnalystPriority;
  assets: string[];
  themes: string[];
  bullCase: string;
  bearCase: string;
  catalysts: string[];
  invalidationSignals: string[];
  notes: string;
};
