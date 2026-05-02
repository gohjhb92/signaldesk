"use client";

import { useMemo, useState } from "react";
import { Loader2, Play, Plus } from "lucide-react";
import type { Analyst, Source, SourceType } from "@/types/domain";

const sourceTypes: SourceType[] = [
  "rss",
  "blog",
  "substack",
  "podcast",
  "youtube",
  "report",
  "x_manual"
];

export function SourceManager({
  analysts,
  initialSources
}: {
  analysts: Analyst[];
  initialSources: Source[];
}) {
  const [sources, setSources] = useState(initialSources);
  const [ingestionState, setIngestionState] = useState<"idle" | "running" | "success" | "error">(
    "idle"
  );
  const [ingestionResult, setIngestionResult] = useState<IngestionResponse | null>(null);
  const [ingestionError, setIngestionError] = useState<string | null>(null);
  const [form, setForm] = useState({
    analystId: analysts[0]?.id ?? "",
    sourceType: "rss" as SourceType,
    sourceUrl: "",
    active: true
  });

  const analystById = useMemo(
    () => new Map(analysts.map((analyst) => [analyst.id, analyst])),
    [analysts]
  );

  function addSource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.analystId || !form.sourceUrl.trim()) {
      return;
    }

    const analyst = analystById.get(form.analystId);

    setSources((current) => [
      {
        id: crypto.randomUUID(),
        analystId: form.analystId,
        analystName: analyst?.name ?? "Unknown analyst",
        sourceType: form.sourceType,
        sourceUrl: form.sourceUrl.trim(),
        active: form.active
      },
      ...current
    ]);

    setForm({
      analystId: analysts[0]?.id ?? "",
      sourceType: "rss",
      sourceUrl: "",
      active: true
    });
  }

  async function runIngestion() {
    setIngestionState("running");
    setIngestionError(null);
    setIngestionResult(null);

    try {
      const response = await fetch("/api/ingest/rss", {
        method: "POST"
      });
      const result = (await response.json()) as IngestionResponse;

      if (!response.ok && response.status !== 207) {
        throw new Error(result.error ?? "RSS ingestion failed.");
      }

      setIngestionResult(result);
      setIngestionState((result.failedCount ?? 0) > 0 ? "error" : "success");
    } catch (error) {
      setIngestionError(error instanceof Error ? error.message : "RSS ingestion failed.");
      setIngestionState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Add source</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Connect RSS feeds, YouTube channel feeds, podcasts, blogs, and Substack sources to
          analysts.
        </p>

        <form className="mt-6 space-y-4" onSubmit={addSource}>
          <Field label="Analyst">
            <select
              value={form.analystId}
              onChange={(event) => setForm({ ...form, analystId: event.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
            >
              {analysts.map((analyst) => (
                <option key={analyst.id} value={analyst.id}>
                  {analyst.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Source type">
            <select
              value={form.sourceType}
              onChange={(event) =>
                setForm({ ...form, sourceType: event.target.value as SourceType })
              }
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
            >
              {sourceTypes.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceType}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Source URL">
            <input
              value={form.sourceUrl}
              onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              placeholder="https://example.com/feed"
            />
          </Field>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
            <span>
              <span className="block text-sm font-semibold text-slate-700">Active</span>
              <span className="block text-xs text-slate-500">Include this source in ingestion.</span>
            </span>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-signal"
            />
          </label>

          <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            <Plus className="h-4 w-4" />
            Add source
          </button>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-200 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Connected sources</h2>
              <p className="mt-2 text-sm text-slate-500">
                Run manual RSS ingestion for active RSS-like sources.
              </p>
            </div>
            <button
              type="button"
              onClick={runIngestion}
              disabled={ingestionState === "running"}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {ingestionState === "running" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {ingestionState === "running" ? "Running..." : "Run Ingestion"}
            </button>
          </div>

          {ingestionState !== "idle" ? (
            <IngestionResultPanel
              state={ingestionState}
              result={ingestionResult}
              error={ingestionError}
            />
          ) : null}
        </div>
        <div className="divide-y divide-slate-100">
          {sources.map((source) => (
            <div key={source.id} className="p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-ink">{source.analystName}</h3>
                  <p className="mt-1 break-all text-sm text-slate-500">{source.sourceUrl}</p>
                </div>
                <span
                  className={
                    source.active
                      ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700"
                      : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  }
                >
                  {source.active ? "active" : "paused"}
                </span>
              </div>
              <div className="mt-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {source.sourceType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

type IngestionSourceResult = {
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

type IngestionResponse = {
  ok?: boolean;
  error?: string;
  sourceCount?: number;
  insertedCount?: number;
  duplicateCount?: number;
  skippedCount?: number;
  failedCount?: number;
  results?: IngestionSourceResult[];
};

function IngestionResultPanel({
  state,
  result,
  error
}: {
  state: "idle" | "running" | "success" | "error";
  result: IngestionResponse | null;
  error: string | null;
}) {
  if (state === "running") {
    return (
      <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-medium text-teal-800">
        Fetching feeds and inserting new content items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">
        {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div
      className={
        state === "success"
          ? "mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4"
          : "mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4"
      }
    >
      <div className="grid gap-3 text-sm sm:grid-cols-5">
        <Metric label="Sources" value={result.sourceCount ?? 0} />
        <Metric label="Inserted" value={result.insertedCount ?? 0} />
        <Metric label="Duplicates" value={result.duplicateCount ?? 0} />
        <Metric label="Skipped" value={result.skippedCount ?? 0} />
        <Metric label="Failed" value={result.failedCount ?? 0} />
      </div>

      {result.results?.length ? (
        <div className="mt-4 space-y-2">
          {result.results.map((sourceResult) => (
            <div
              key={sourceResult.sourceId}
              className="rounded-xl border border-white/80 bg-white/70 p-3 text-xs text-slate-600"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="break-all font-semibold text-slate-800">
                  {sourceResult.sourceUrl}
                </span>
                <span
                  className={
                    sourceResult.ok
                      ? "font-semibold text-teal-700"
                      : "font-semibold text-rose-700"
                  }
                >
                  {sourceResult.ok ? "ok" : "failed"}
                </span>
              </div>
              <div className="mt-1">
                fetched {sourceResult.fetchedCount}, inserted {sourceResult.insertedCount},
                duplicates {sourceResult.duplicateCount}, skipped {sourceResult.skippedCount}
              </div>
              {sourceResult.error ? (
                <div className="mt-1 font-medium text-rose-700">{sourceResult.error}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-ink">{value}</div>
    </div>
  );
}
