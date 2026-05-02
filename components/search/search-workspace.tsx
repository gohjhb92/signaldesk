"use client";

import { useState } from "react";
import { Brain, ExternalLink, Loader2, Search, Sparkles } from "lucide-react";
import { SentimentBadge } from "@/components/ui/sentiment-badge";
import { ImportanceBadge } from "@/components/ui/importance-badge";
import type { Sentiment } from "@/types/domain";

type SearchResult = {
  id: string;
  title: string;
  url: string;
  analystName: string;
  sourceType: string;
  publishedAt: string;
  summary: string;
  assets: string[];
  themes: string[];
  sentiment: Sentiment;
  importanceScore: number;
  score: number;
};

const exampleQueries = [
  "What are analysts saying about BTC liquidity?",
  "Who is bearish on QQQ this week?",
  "What changed around oil, gold, and inflation?",
  "Summarize recent ETF flow commentary."
];

export function SearchWorkspace() {
  const [query, setQuery] = useState(exampleQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [embeddingState, setEmbeddingState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function runSearch(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!query.trim()) {
      return;
    }

    setState("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const body = (await response.json()) as { results?: SearchResult[]; error?: string; demo?: boolean };

      if (!response.ok) {
        throw new Error(body.error ?? "Search failed.");
      }

      setResults(body.results ?? []);
      setState("success");
      setMessage(body.demo ? "Demo mode: showing keyword-ranked sample data." : null);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Search failed.");
    }
  }

  async function generateEmbeddings() {
    setEmbeddingState("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/embeddings/generate", { method: "POST" });
      const body = (await response.json()) as {
        demo?: boolean;
        embeddedCount?: number;
        attemptedCount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error ?? "Embedding generation failed.");
      }

      setEmbeddingState("success");
      setMessage(
        body.demo
          ? "Demo mode: embeddings are skipped until Supabase and OpenAI are configured."
          : `Generated embeddings for ${body.embeddedCount ?? 0} of ${body.attemptedCount ?? 0} items.`
      );
    } catch (error) {
      setEmbeddingState("error");
      setMessage(error instanceof Error ? error.message : "Embedding generation failed.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
              Semantic research
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Ask the market stream
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Search across analyst summaries using keywords plus OpenAI embeddings and pgvector.
            </p>
          </div>
          <button
            type="button"
            onClick={generateEmbeddings}
            disabled={embeddingState === "loading"}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {embeddingState === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            Generate Missing Embeddings
          </button>
        </div>

        <form onSubmit={runSearch} className="mt-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-ink"
              placeholder="Ask about BTC liquidity, ETF flows, QQQ sentiment..."
            />
          </div>
          <button
            disabled={state === "loading"}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {exampleQueries.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setQuery(example)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-signal hover:text-signal"
            >
              {example}
            </button>
          ))}
        </div>

        {message ? (
          <div
            className={
              state === "error" || embeddingState === "error"
                ? "mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700"
                : "mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-medium text-teal-800"
            }
          >
            {message}
          </div>
        ) : null}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Results</h2>
          <p className="mt-1 text-sm text-slate-500">
            Results show source links, analyst, date, summary, assets, themes, sentiment, and score.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {state === "idle" ? (
            <EmptySearch message="Run a search to explore the intelligence stream." />
          ) : null}
          {state === "loading" ? <EmptySearch message="Searching summaries and embeddings..." /> : null}
          {state === "success" && results.length === 0 ? (
            <EmptySearch message="No matching commentary found. Try a broader asset or theme." />
          ) : null}
          {results.map((result) => (
            <article key={result.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SentimentBadge sentiment={result.sentiment} />
                    <ImportanceBadge score={result.importanceScore} />
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Score {result.score}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{result.publishedAt}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-7 text-ink">{result.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {result.analystName} / {result.sourceType}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{result.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.assets.map((asset) => (
                      <span key={asset} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                        {asset}
                      </span>
                    ))}
                    {result.themes.map((theme) => (
                      <span key={theme} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-signal hover:text-signal"
                >
                  Source
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmptySearch({ message }: { message: string }) {
  return <div className="p-8 text-center text-sm font-medium text-slate-500">{message}</div>;
}
