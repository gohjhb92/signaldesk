import type { ThemeSummary } from "@/types/domain";

export function ThemePanel({ themes }: { themes: ThemeSummary[] }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink">Top themes</h2>
      <div className="mt-5 space-y-4">
        {themes.map((theme) => (
          <div key={theme.name}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-700">{theme.name}</span>
              <span className="font-medium text-slate-500">{theme.count} items</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-signal"
                style={{ width: `${theme.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
