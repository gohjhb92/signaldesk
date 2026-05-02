export function ImportanceBadge({ score }: { score: number }) {
  const tone =
    score >= 85
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : score >= 70
        ? "bg-teal-50 text-teal-700 border-teal-100"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {score}/100
    </span>
  );
}
