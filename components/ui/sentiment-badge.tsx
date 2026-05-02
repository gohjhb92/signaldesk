import type { Sentiment } from "@/types/domain";

const sentimentClass: Record<Sentiment, string> = {
  bullish: "border-emerald-100 bg-emerald-50 text-emerald-700",
  bearish: "border-rose-100 bg-rose-50 text-rose-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  mixed: "border-indigo-100 bg-indigo-50 text-indigo-700",
  unknown: "border-slate-200 bg-white text-slate-500"
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${sentimentClass[sentiment]}`}
    >
      {sentiment}
    </span>
  );
}
