import Link from "next/link";
import type { ContentItem } from "@/types/domain";

export function AnalystUpdates({ items }: { items: ContentItem[] }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-ink p-5 text-white shadow-panel md:p-6">
      <h2 className="text-xl font-semibold tracking-tight">High-priority updates</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <Link
            href={`/items/${item.id}`}
            key={item.id}
            className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-teal-100">{item.analystName}</div>
            <div className="mt-1 text-sm leading-6 text-slate-200">{item.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
