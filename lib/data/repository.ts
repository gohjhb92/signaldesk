import { mockAnalysts, mockContentItems, mockSources, mockThemeSummaries } from "@/lib/data/mock";
import { activeTradeTheses } from "@/lib/data/theses";
import type { Analyst, ContentItem, Source, ThemeSummary, TradeThesis } from "@/types/domain";

// Repository functions currently return demo data so the portfolio app works immediately after clone.
// Supabase-backed reads can be swapped in here without changing the page components.
export async function getAnalysts(): Promise<Analyst[]> {
  return mockAnalysts;
}

export async function getSources(): Promise<Source[]> {
  return mockSources;
}

export async function getContentItems(): Promise<ContentItem[]> {
  return mockContentItems;
}

export async function getContentItemById(id: string): Promise<ContentItem | undefined> {
  return mockContentItems.find((item) => item.id === id);
}

export async function getThemeSummaries(): Promise<ThemeSummary[]> {
  return mockThemeSummaries;
}

export async function getTradeTheses(): Promise<TradeThesis[]> {
  return activeTradeTheses;
}
