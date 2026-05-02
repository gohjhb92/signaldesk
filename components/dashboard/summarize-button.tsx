"use client";

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";

type SummarizationResult = {
  ok?: boolean;
  error?: string;
  attemptedCount?: number;
  summarizedCount?: number;
  failedCount?: number;
  results?: Array<{
    itemId: string;
    title: string;
    ok: boolean;
    error?: string;
  }>;
};

export function SummarizeButton() {
  const [state, setState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [result, setResult] = useState<SummarizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function summarizeNewItems() {
    setState("running");
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST"
      });
      const nextResult = (await response.json()) as SummarizationResult;

      if (!response.ok && response.status !== 207) {
        throw new Error(nextResult.error ?? "Summarization failed.");
      }

      setResult(nextResult);
      setState((nextResult.failedCount ?? 0) > 0 ? "error" : "success");
    } catch (summarizeError) {
      setError(summarizeError instanceof Error ? summarizeError.message : "Summarization failed.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:items-end">
      <button
        type="button"
        onClick={summarizeNewItems}
        disabled={state === "running"}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "running" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        {state === "running" ? "Summarizing..." : "Summarize New Items"}
      </button>

      {state !== "idle" ? (
        <div
          className={
            state === "success"
              ? "max-w-md rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800"
              : state === "running"
                ? "max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                : "max-w-md rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }
        >
          {state === "running" ? "Generating trader-focused summaries..." : null}
          {error ? error : null}
          {result ? (
            <div>
              Summarized {result.summarizedCount ?? 0} of {result.attemptedCount ?? 0} items.
              {(result.failedCount ?? 0) > 0 ? ` Failed: ${result.failedCount}.` : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
