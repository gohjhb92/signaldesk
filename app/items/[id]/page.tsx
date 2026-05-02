import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ImportanceBadge } from "@/components/ui/importance-badge";
import { SentimentBadge } from "@/components/ui/sentiment-badge";
import { getContentItemById } from "@/lib/data/repository";

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const item = await getContentItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <AppShell>
      <article className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-panel md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <SentimentBadge sentiment={item.sentiment} />
            <ImportanceBadge score={item.importanceScore} />
            <span className="text-sm text-slate-500">{item.publishedAt}</span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {item.title}
          </h1>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="font-semibold text-ink">Source:</span> {item.sourceName}
            </div>
            <div>
              <span className="font-semibold text-ink">Analyst:</span> {item.analystName}
            </div>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open original
            <ExternalLink className="h-4 w-4" />
          </a>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              AI summary placeholder
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">{item.summary}</p>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tags
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Assets
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.assets.map((asset) => (
                  <span
                    key={asset}
                    className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </article>
    </AppShell>
  );
}
