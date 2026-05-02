"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Target, TrendingDown, TrendingUp } from "lucide-react";
import type { AnalystPriority, ContentItem, ThesisStatus, TradeThesis } from "@/types/domain";
import { buildThesisEvidence, getThesisEvidenceCount } from "@/lib/utils/theses";
import { SentimentBadge } from "@/components/ui/sentiment-badge";

const statuses: ThesisStatus[] = ["watching", "building", "active", "trimming", "exited"];
const convictions: AnalystPriority[] = ["low", "medium", "high"];

export function ThesisManager({
  initialTheses,
  items
}: {
  initialTheses: TradeThesis[];
  items: ContentItem[];
}) {
  const [theses, setTheses] = useState(initialTheses);
  const [form, setForm] = useState({
    name: "",
    category: "Crypto",
    status: "watching" as ThesisStatus,
    horizon: "6-24 months",
    conviction: "medium" as AnalystPriority,
    assets: "",
    themes: "",
    bullCase: "",
    bearCase: "",
    catalysts: "",
    invalidationSignals: "",
    notes: ""
  });

  const evidence = useMemo(() => buildThesisEvidence(theses, items), [theses, items]);
  const sortedTheses = useMemo(
    () =>
      [...theses].sort((a, b) => {
        const statusScore = statusRank(b.status) - statusRank(a.status);
        if (statusScore !== 0) {
          return statusScore;
        }

        return convictionRank(b.conviction) - convictionRank(a.conviction);
      }),
    [theses]
  );

  function addThesis(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.bullCase.trim()) {
      return;
    }

    setTheses((current) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category.trim() || "General",
        status: form.status,
        horizon: form.horizon.trim() || "Unspecified",
        conviction: form.conviction,
        assets: splitList(form.assets),
        themes: splitList(form.themes),
        bullCase: form.bullCase.trim(),
        bearCase: form.bearCase.trim(),
        catalysts: splitList(form.catalysts),
        invalidationSignals: splitList(form.invalidationSignals),
        notes: form.notes.trim()
      },
      ...current
    ]);

    setForm({
      name: "",
      category: "Crypto",
      status: "watching",
      horizon: "6-24 months",
      conviction: "medium",
      assets: "",
      themes: "",
      bullCase: "",
      bearCase: "",
      catalysts: "",
      invalidationSignals: "",
      notes: ""
    });
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Thesis cockpit
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Trade Theses</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-graphite">
            Keep each active trade tied to a bull case, invalidation, catalysts, and live evidence
            from your research stream.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-signal hover:text-signal"
        >
          Dashboard
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(340px,0.75fr)_minmax(0,1.25fr)]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Add thesis</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This demo stores new theses in browser state. Supabase persistence is wired through the
            migration added with this page.
          </p>

          <form className="mt-6 space-y-4" onSubmit={addThesis}>
            <Field label="Name">
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="HYPE 6-24 month macro trade"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                  placeholder="Crypto"
                />
              </Field>
              <Field label="Horizon">
                <input
                  value={form.horizon}
                  onChange={(event) => setForm({ ...form, horizon: event.target.value })}
                  className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                  placeholder="6-24 months"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as ThesisStatus })}
                  className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Conviction">
                <select
                  value={form.conviction}
                  onChange={(event) =>
                    setForm({ ...form, conviction: event.target.value as AnalystPriority })
                  }
                  className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                >
                  {convictions.map((conviction) => (
                    <option key={conviction} value={conviction}>
                      {conviction}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Assets">
              <input
                value={form.assets}
                onChange={(event) => setForm({ ...form, assets: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="HYPE, BTC, PURR"
              />
            </Field>

            <Field label="Themes">
              <input
                value={form.themes}
                onChange={(event) => setForm({ ...form, themes: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="liquidity, perps, risk appetite"
              />
            </Field>

            <Field label="Bull case">
              <textarea
                value={form.bullCase}
                onChange={(event) => setForm({ ...form, bullCase: event.target.value })}
                className="focus-ring min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="What has to be true for this trade to work?"
              />
            </Field>

            <Field label="Bear case">
              <textarea
                value={form.bearCase}
                onChange={(event) => setForm({ ...form, bearCase: event.target.value })}
                className="focus-ring min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="What would make you wrong?"
              />
            </Field>

            <Field label="Catalysts">
              <textarea
                value={form.catalysts}
                onChange={(event) => setForm({ ...form, catalysts: event.target.value })}
                className="focus-ring min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="ETF flows, protocol revenue, stablecoin supply"
              />
            </Field>

            <Field label="Invalidation signals">
              <textarea
                value={form.invalidationSignals}
                onChange={(event) => setForm({ ...form, invalidationSignals: event.target.value })}
                className="focus-ring min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="Volume decay, failed breakout, policy shock"
              />
            </Field>

            <Field label="Notes">
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                className="focus-ring min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="Position sizing, source gaps, review cadence..."
              />
            </Field>

            <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              <Plus className="h-4 w-4" />
              Add thesis
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {sortedTheses.map((thesis) => {
            const thesisEvidence = evidence.get(thesis.id);
            const evidenceCount = getThesisEvidenceCount(thesisEvidence);

            return (
              <article
                key={thesis.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel md:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill>{thesis.category}</Pill>
                      <Pill>{thesis.status}</Pill>
                      <Pill>{thesis.horizon}</Pill>
                      <Pill>{thesis.conviction} conviction</Pill>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                      {thesis.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{thesis.bullCase}</p>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-signal">
                    <Target className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {thesis.assets.map((asset) => (
                    <span key={asset} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {asset}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <InfoBlock title="Bear case / invalidation frame" body={thesis.bearCase} />
                  <InfoList title="Catalysts" items={thesis.catalysts} />
                  <InfoList title="Invalidation signals" items={thesis.invalidationSignals} />
                  <InfoList title="Themes" items={thesis.themes} />
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">Matched research evidence</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {evidenceCount} matching items from assets and themes.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {thesisEvidence?.supporting.length ?? 0} for
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                        <TrendingDown className="h-3.5 w-3.5" />
                        {thesisEvidence?.opposing.length ?? 0} against
                      </span>
                    </div>
                  </div>

                  {evidenceCount ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[...(thesisEvidence?.supporting ?? []), ...(thesisEvidence?.opposing ?? []), ...(thesisEvidence?.neutral ?? [])]
                        .slice(0, 4)
                        .map((item) => (
                          <Link
                            key={item.id}
                            href={`/items/${item.id}`}
                            className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-signal"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <SentimentBadge sentiment={item.sentiment} />
                              <span className="text-xs font-medium text-slate-500">
                                {item.publishedAt}
                              </span>
                            </div>
                            <div className="mt-2 text-sm font-semibold leading-5 text-ink">
                              {item.title}
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      No evidence matched yet. Add sources or broaden thesis assets/themes.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
      {children}
    </span>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body || "Not defined yet."}</p>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
          {items.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Not defined yet.</p>
      )}
    </div>
  );
}

function splitList(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function convictionRank(value: AnalystPriority) {
  return { low: 1, medium: 2, high: 3 }[value];
}

function statusRank(value: ThesisStatus) {
  return { exited: 0, watching: 1, trimming: 2, building: 3, active: 4 }[value];
}
