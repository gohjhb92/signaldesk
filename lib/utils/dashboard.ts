import type { ContentItem } from "../../types/domain";

export type DateRange = "all" | "today" | "7d" | "30d";

export type DashboardFilters = {
  asset: string;
  theme: string;
  analyst: string;
  sourceType: string;
  sentiment: string;
  priority: string;
  dateRange: DateRange;
};

export const defaultDashboardFilters: DashboardFilters = {
  asset: "all",
  theme: "all",
  analyst: "all",
  sourceType: "all",
  sentiment: "all",
  priority: "all",
  dateRange: "all"
};

// Kept outside React so dashboard behavior can be tested without a browser.
export function filterContentItems(
  items: ContentItem[],
  filters: DashboardFilters,
  now = new Date()
) {
  return items.filter((item) => matchesFilters(item, filters, now));
}

export function buildFilterOptions(items: ContentItem[]) {
  return {
    assets: toOptions([...new Set(items.flatMap((item) => item.assets))]),
    themes: toOptions([...new Set(items.flatMap((item) => item.tags))]),
    analysts: toOptions([...new Set(items.map((item) => item.analystName))]),
    sourceTypes: toOptions([...new Set(items.map((item) => item.sourceType))]),
    sentiments: toOptions([...new Set(items.map((item) => item.sentiment))]),
    priorities: toOptions([...new Set(items.map((item) => item.analystPriority))])
  };
}

export function countValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function matchesDateRange(item: ContentItem, dateRange: DateRange, now = new Date()) {
  if (dateRange === "all") {
    return true;
  }

  const itemDate = new Date(item.publishedAtIso);
  if (Number.isNaN(itemDate.getTime())) {
    return false;
  }

  if (dateRange === "today") {
    return itemDate.toDateString() === now.toDateString();
  }

  const ageDays = (now.getTime() - itemDate.getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays <= (dateRange === "7d" ? 7 : 30);
}

function matchesFilters(item: ContentItem, filters: DashboardFilters, now: Date) {
  return (
    (filters.asset === "all" || item.assets.includes(filters.asset)) &&
    (filters.theme === "all" || item.tags.includes(filters.theme)) &&
    (filters.analyst === "all" || item.analystName === filters.analyst) &&
    (filters.sourceType === "all" || item.sourceType === filters.sourceType) &&
    (filters.sentiment === "all" || item.sentiment === filters.sentiment) &&
    (filters.priority === "all" || item.analystPriority === filters.priority) &&
    matchesDateRange(item, filters.dateRange, now)
  );
}

function toOptions(values: string[]): Array<[string, string]> {
  return values.sort().map((value) => [value, value]);
}
