import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentItem } from "@/types/domain";
import { ImportanceBadge } from "@/components/ui/importance-badge";
import { SentimentBadge } from "@/components/ui/sentiment-badge";

export function ContentFeed({ items }: { items: ContentItem[] }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 p-5 md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Latest content</h2>
        <p className="mt-1 text-sm text-slate-500">
          New research, podcasts, videos, and posts ready for review.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
            className="block p-5 transition hover:bg-slate-50 md:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SentimentBadge sentiment={item.sentiment} />
                  <ImportanceBadge score={item.importanceScore} />
                  <span className="text-xs font-medium text-slate-500">{item.publishedAt}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-7 text-ink">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {item.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.assets.map((asset) => (
                    <span
                      key={asset}
                      className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800"
                    >
                      {asset}
                    </span>
                  ))}
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-signal">
                Details
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
