"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Analyst, AnalystPriority } from "@/types/domain";

const categories = ["analyst", "trader", "investor", "podcaster", "researcher"];
const priorityRank: Record<AnalystPriority, number> = {
  low: 1,
  medium: 2,
  high: 3
};

export function AnalystManager({ initialAnalysts }: { initialAnalysts: Analyst[] }) {
  const [analysts, setAnalysts] = useState(initialAnalysts);
  const [form, setForm] = useState({
    name: "",
    category: "analyst",
    priority: "medium" as AnalystPriority,
    notes: "",
    website: "",
    xHandle: ""
  });

  const sortedAnalysts = useMemo(
    () => [...analysts].sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]),
    [analysts]
  );

  function addAnalyst(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    setAnalysts((current) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category,
        priority: form.priority,
        notes: form.notes.trim(),
        website: form.website.trim(),
        xHandle: form.xHandle.trim()
      },
      ...current
    ]);

    setForm({
      name: "",
      category: "analyst",
      priority: "medium",
      notes: "",
      website: "",
      xHandle: ""
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel md:p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Add analyst</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Track the people whose market commentary matters to your workflow.
        </p>

        <form className="mt-6 space-y-4" onSubmit={addAnalyst}>
          <Field label="Name">
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              placeholder="Lyn Alden"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value as AnalystPriority })
                }
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <option value="low">Low - watch</option>
                <option value="medium">Medium - useful</option>
                <option value="high">High - high signal</option>
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="focus-ring min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2.5"
              placeholder="Macro liquidity, rates, Bitcoin cycles..."
            />
          </Field>

          <Field label="Website">
            <input
              value={form.website}
              onChange={(event) => setForm({ ...form, website: event.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              placeholder="https://example.com"
            />
          </Field>

          <Field label="X handle">
            <input
              value={form.xHandle}
              onChange={(event) => setForm({ ...form, xHandle: event.target.value })}
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              placeholder="@handle"
            />
          </Field>

          <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            <Plus className="h-4 w-4" />
            Add analyst
          </button>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-200 p-5 md:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Tracked analysts</h2>
          <p className="mt-2 text-sm text-slate-500">Stored locally in mock state for now.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {sortedAnalysts.map((analyst) => (
            <div key={analyst.id} className="p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{analyst.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{analyst.notes}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {analyst.priority}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">{analyst.category}</span>
                {analyst.website ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">{analyst.website}</span>
                ) : null}
                {analyst.xHandle ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1">{analyst.xHandle}</span>
                ) : null}
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
