"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  ExternalLink,
  Filter,
  Inbox,
  Loader2,
  RefreshCw,
  SearchX,
  ShieldAlert,
  Target
} from "lucide-react";
import type { Analyst, ContentItem, Source, TradeThesis } from "@/types/domain";
import { ImportanceBadge } from "@/components/ui/importance-badge";
import { SentimentBadge } from "@/components/ui/sentiment-badge";
import { SummarizeButton } from "@/components/dashboard/summarize-button";
import {
  buildFilterOptions,
  countValues,
  defaultDashboardFilters,
  filterContentItems,
  type DashboardFilters,
  type DateRange
} from "@/lib/utils/dashboard";
import { buildThesisEvidence, getThesisEvidenceCount, type ThesisEvidence } from "@/lib/utils/theses";

export function DashboardWorkspace({
  items,
  analysts,
  sources,
  theses
}: {
  items: ContentItem[];
  analysts: Analyst[];
  sources: Source[];
  theses: TradeThesis[];
}) {
  const [filters, setFilters] = useState(defaultDashboardFilters);
  const [loadState, setLoadState] = useState<"ready" | "loading" | "error">("ready");

  const filterOptions = useMemo(() => buildFilterOptions(items), [items]);
  const filteredItems = useMemo(
    () => filterContentItems(items, filters, new Date("2026-05-02T23:59:59+08:00")),
    [items, filters]
  );

  const highPrioritySignals = filteredItems
    .filter((item) => item.importanceScore >= 80 || item.analystPriority === "high")
    .slice(0, 5);
  const latestUpdates = [...filteredItems]
    .sort((a, b) => new Date(b.publishedAtIso).getTime() - new Date(a.publishedAtIso).getTime())
    .slice(0, 8);
  const unsummarizedItems = filteredItems.filter((item) => !item.summary.trim());
  const trendingThemes = countValues(filteredItems.flatMap((item) => item.tags)).slice(0, 6);
  const assetMentions = countValues(filteredItems.flatMap((item) => item.assets)).slice(0, 8);
  const sentimentCounts = countValues(filteredItems.map((item) => item.sentiment));
  const bullishCount = sentimentCounts.find((item) => item.name === "bullish")?.count ?? 0;
  const bearishCount = sentimentCounts.find((item) => item.name === "bearish")?.count ?? 0;
  const thesisEvidence = useMemo(() => buildThesisEvidence(theses, items), [theses, items]);

  function updateFilter<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) {
    setLoadState("loading");
    setFilters((current) => ({ ...current, [key]: value }));
    window.setTimeout(() => setLoadState("ready"), 180);
  }

  function clearFilters() {
    setLoadState("loading");
    setFilters(defaultDashboardFilters);
    window.setTimeout(() => setLoadState("ready"), 180);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Thesis-driven trading workflow
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            SignalDesk
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-graphite">
            Track whether new market intelligence strengthens, weakens, or changes your active
            multi-month trade theses.
          </p>
        </div>
        <SummarizeButton />
      </section>

      <Panel
        title="Active Trade Theses"
        subtitle="Your current watchlist, grouped by the actual trades you care about."
      >
        <ThesisGrid theses={theses} evidence={thesisEvidence} />
      </Panel>

      <FilterBar
        filters={filters}
        options={filterOptions}
        onChange={updateFilter}
        onClear={clearFilters}
      />

      {loadState === "error" ? (
        <StateCard
          icon={AlertTriangle}
          title="Dashboard data could not load"
          body="Check your Supabase connection or try refreshing the page."
        />
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Filtered items" value={filteredItems.length.toString()} detail={`${items.length} total`} />
        <MetricCard label="Trade theses" value={theses.length.toString()} detail="Active ideas" />
        <MetricCard label="Analysts" value={analysts.length.toString()} detail="Tracked people" />
        <MetricCard label="Active sources" value={sources.filter((source) => source.active).length.toString()} detail={`${sources.length} connected`} />
        <MetricCard label="High priority" value={highPrioritySignals.length.toString()} detail="Needs review" />
      </section>

      {loadState === "loading" ? (
        <StateCard icon={Loader2} title="Refreshing dashboard" body="Applying filters to your research stream." />
      ) : null}

      {filteredItems.length === 0 && loadState === "ready" ? (
        <StateCard
          icon={SearchX}
          title="No matching signals"
          body="Loosen a filter or clear the dashboard filters to bring more research back into view."
        />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <Panel title="Today's High Priority Signals" subtitle="Items most likely to matter before the next trade.">
          <SignalList items={highPrioritySignals} empty="No high-priority signals match these filters." />
        </Panel>

        <Panel title="Bullish vs Bearish Views" subtitle="Directional tone across filtered updates.">
          <SentimentSplit bullish={bullishCount} bearish={bearishCount} total={filteredItems.length} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Panel title="Latest Analyst Updates" subtitle="Recent source items with original links.">
          <UpdatesTable items={latestUpdates} />
        </Panel>

        <div className="space-y-6">
          <Panel title="Trending Themes" subtitle="Repeated ideas in the current research set.">
            <RankedList rows={trendingThemes} empty="No themes found for this filter set." />
          </Panel>
          <Panel title="Asset Mentions" subtitle="Tickers and markets showing up most often.">
            <RankedList rows={assetMentions} empty="No asset mentions found yet." />
          </Panel>
        </div>
      </section>

      <Panel title="Unsummarized Items Queue" subtitle="Fresh items waiting for AI summarization.">
        <QueueTable items={unsummarizedItems} />
      </Panel>
    </div>
  );
}

function ThesisGrid({
  theses,
  evidence
}: {
  theses: TradeThesis[];
  evidence: Map<string, ThesisEvidence>;
}) {
  if (theses.length === 0) {
    return <EmptyState icon={Target} message="No active trade theses yet." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {theses.map((thesis) => {
        const matchingItems = evidence.get(thesis.id);
        const evidenceCount = getThesisEvidenceCount(matchingItems);

        return (
          <article key={thesis.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {thesis.category}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                    {thesis.horizon}
                  </span>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                    {thesis.status}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {thesis.conviction} conviction
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-7 text-ink">{thesis.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{thesis.bullCase}</p>
              </div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-signal">
                <Target className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {thesis.assets.map((asset) => (
                <button
                  key={asset}
                  type="button"
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {asset}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <MiniList title="Catalysts" items={thesis.catalysts.slice(0, 3)} />
              <MiniList title="Invalidation" items={thesis.invalidationSignals.slice(0, 3)} />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Evidence for / against
              </div>
              {evidenceCount ? (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
                      {matchingItems?.supporting.length ?? 0} for
                    </span>
                    <span className="rounded-lg bg-rose-50 px-2 py-1 text-rose-700">
                      {matchingItems?.opposing.length ?? 0} against
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-600">
                      {matchingItems?.neutral.length ?? 0} mixed
                    </span>
                  </div>
                  {[...(matchingItems?.supporting ?? []), ...(matchingItems?.opposing ?? []), ...(matchingItems?.neutral ?? [])]
                    .slice(0, 2)
                    .map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.id}`}
                      className="block text-sm font-semibold leading-5 text-ink hover:text-signal"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No matching demo evidence yet.</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <ul className="mt-2 space-y-1 text-sm leading-5 text-slate-600">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FilterBar({
  filters,
  options,
  onChange,
  onClear
}: {
  filters: DashboardFilters;
  options: ReturnType<typeof buildFilterOptions>;
  onChange: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  onClear: () => void;
}) {
  return (
    <section className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Filter className="h-4 w-4 text-signal" />
          Filters
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Select label="Asset" value={filters.asset} values={options.assets} onChange={(value) => onChange("asset", value)} />
        <Select label="Theme" value={filters.theme} values={options.themes} onChange={(value) => onChange("theme", value)} />
        <Select label="Analyst" value={filters.analyst} values={options.analysts} onChange={(value) => onChange("analyst", value)} />
        <Select label="Source" value={filters.sourceType} values={options.sourceTypes} onChange={(value) => onChange("sourceType", value)} />
        <Select label="Sentiment" value={filters.sentiment} values={options.sentiments} onChange={(value) => onChange("sentiment", value)} />
        <Select label="Priority" value={filters.priority} values={options.priorities} onChange={(value) => onChange("priority", value)} />
        <Select
          label="Date"
          value={filters.dateRange}
          values={[
            ["all", "All"],
            ["today", "Today"],
            ["7d", "7 days"],
            ["30d", "30 days"]
          ]}
          onChange={(value) => onChange("dateRange", value as DateRange)}
        />
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
      >
        <option value="all">All</option>
        {values.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function Panel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function SignalList({ items, empty }: { items: ContentItem[]; empty: string }) {
  if (items.length === 0) {
    return <EmptyState icon={ShieldAlert} message={empty} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SentimentBadge sentiment={item.sentiment} />
                <ImportanceBadge score={item.importanceScore} />
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {item.analystPriority} priority
                </span>
              </div>
              <Link href={`/items/${item.id}`} className="mt-3 block text-lg font-semibold leading-7 text-ink hover:text-signal">
                {item.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {item.summary || "Waiting for AI summary."}
              </p>
            </div>
            <OriginalLink url={item.url} />
          </div>
        </div>
      ))}
    </div>
  );
}

function UpdatesTable({ items }: { items: ContentItem[] }) {
  if (items.length === 0) {
    return <EmptyState icon={Inbox} message="No analyst updates match this filter set." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="border-b border-slate-200 pb-3">Item</th>
            <th className="border-b border-slate-200 pb-3">Analyst</th>
            <th className="border-b border-slate-200 pb-3">Type</th>
            <th className="border-b border-slate-200 pb-3">Tone</th>
            <th className="border-b border-slate-200 pb-3">Source</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border-b border-slate-100 py-4 pr-4">
                <Link href={`/items/${item.id}`} className="font-semibold text-ink hover:text-signal">
                  {item.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {item.publishedAt}
                </div>
              </td>
              <td className="border-b border-slate-100 py-4 pr-4 text-slate-600">{item.analystName}</td>
              <td className="border-b border-slate-100 py-4 pr-4 text-slate-600">{item.sourceType}</td>
              <td className="border-b border-slate-100 py-4 pr-4">
                <SentimentBadge sentiment={item.sentiment} />
              </td>
              <td className="border-b border-slate-100 py-4">
                <OriginalLink url={item.url} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QueueTable({ items }: { items: ContentItem[] }) {
  if (items.length === 0) {
    return <EmptyState icon={Inbox} message="The queue is clear. All matching items have summaries." />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold leading-6 text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.analystName} / {item.sourceType} / {item.publishedAt}
              </p>
            </div>
            <OriginalLink url={item.url} compact />
          </div>
        </div>
      ))}
    </div>
  );
}

function SentimentSplit({ bullish, bearish, total }: { bullish: number; bearish: number; total: number }) {
  if (total === 0) {
    return <EmptyState icon={BarChart3} message="No sentiment data available for these filters." />;
  }

  const bullishWidth = Math.round((bullish / Math.max(total, 1)) * 100);
  const bearishWidth = Math.round((bearish / Math.max(total, 1)) * 100);

  return (
    <div className="space-y-5">
      <SentimentBar label="Bullish" value={bullish} width={bullishWidth} className="bg-emerald-500" />
      <SentimentBar label="Bearish" value={bearish} width={bearishWidth} className="bg-rose-500" />
      <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        Mixed and neutral views stay in the latest updates table so the directional split stays easy
        to scan.
      </div>
    </div>
  );
}

function SentimentBar({ label, value, width, className }: { label: string; value: number; width: number; className: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-medium text-slate-500">{value} views</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function RankedList({ rows, empty }: { rows: Array<{ name: string; count: number }>; empty: string }) {
  if (rows.length === 0) {
    return <EmptyState icon={Inbox} message={empty} />;
  }

  const max = Math.max(...rows.map((row) => row.count));

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">{row.name}</span>
            <span className="text-slate-500">{row.count}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-signal" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{detail}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: typeof Inbox; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <Icon className="mx-auto h-5 w-5 text-slate-400" />
      <p className="mt-2 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

function StateCard({ icon: Icon, title, body }: { icon: typeof AlertTriangle; title: string; body: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        <div className="text-sm text-slate-500">{body}</div>
      </div>
    </div>
  );
}

function OriginalLink({ url, compact = false }: { url: string; compact?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-signal hover:text-signal"
    >
      {compact ? null : "Open"}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
