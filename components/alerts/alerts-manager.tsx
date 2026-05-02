"use client";

import { useState } from "react";
import { Bell, Loader2, Plus, Send, ShieldCheck } from "lucide-react";
import type { AlertRuleView } from "@/types/alerts";

type ActionState = "idle" | "running" | "success" | "error";

export function AlertsManager({ initialRules }: { initialRules: AlertRuleView[] }) {
  const [rules, setRules] = useState(initialRules);
  const [form, setForm] = useState({
    name: "",
    keywords: "",
    assets: "",
    minimumPriority: "medium" as AlertRuleView["minimumPriority"],
    enabled: true
  });
  const [runState, setRunState] = useState<ActionState>("idle");
  const [testState, setTestState] = useState<ActionState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  function addRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    setRules((current) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        keywords: splitList(form.keywords),
        assets: splitList(form.assets).map((asset) => asset.toUpperCase()),
        minimumPriority: form.minimumPriority,
        enabled: form.enabled
      },
      ...current
    ]);
    setForm({
      name: "",
      keywords: "",
      assets: "",
      minimumPriority: "medium",
      enabled: true
    });
  }

  function toggleRule(id: string) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    );
  }

  async function runAlerts() {
    setRunState("running");
    setMessage(null);

    try {
      const response = await fetch("/api/alerts/run", { method: "POST" });
      const result = (await response.json()) as {
        sentCount?: number;
        evaluatedCount?: number;
        failedCount?: number;
        demo?: boolean;
        error?: string;
      };

      if (!response.ok && response.status !== 207) {
        throw new Error(result.error ?? "Alert run failed.");
      }

      setRunState((result.failedCount ?? 0) > 0 ? "error" : "success");
      setMessage(
        result.demo
          ? "Demo mode: alert evaluation is wired, but no Telegram messages were sent."
          : `Sent ${result.sentCount ?? 0} alerts after evaluating ${result.evaluatedCount ?? 0} items.`
      );
    } catch (error) {
      setRunState("error");
      setMessage(error instanceof Error ? error.message : "Alert run failed.");
    }
  }

  async function testTelegram() {
    setTestState("running");
    setMessage(null);

    try {
      const response = await fetch("/api/alerts/test", { method: "POST" });
      const result = (await response.json()) as { demo?: boolean; message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Telegram test failed.");
      }

      setTestState("success");
      setMessage(result.demo ? result.message ?? "Demo mode test complete." : "Telegram test sent.");
    } catch (error) {
      setTestState("error");
      setMessage(error instanceof Error ? error.message : "Telegram test failed.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-panel lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal">
            Telegram alerts
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Alert Rules
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Send Telegram messages when important content appears, watched assets are mentioned, or
            a high-priority analyst posts new research.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ActionButton state={runState} onClick={runAlerts} icon={Bell} label="Run Alerts" />
          <ActionButton
            state={testState}
            onClick={testTelegram}
            icon={Send}
            label="Test Telegram Alert"
            secondary
          />
        </div>
      </section>

      {message ? (
        <div
          className={
            runState === "error" || testState === "error"
              ? "rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700"
              : "rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-medium text-teal-800"
          }
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-panel">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Add alert rule</h2>
          <form className="mt-5 space-y-4" onSubmit={addRule}>
            <Field label="Name">
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="BTC liquidity watch"
              />
            </Field>
            <Field label="Keywords">
              <input
                value={form.keywords}
                onChange={(event) => setForm({ ...form, keywords: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="Fed, liquidity, ETF"
              />
            </Field>
            <Field label="Assets">
              <input
                value={form.assets}
                onChange={(event) => setForm({ ...form, assets: event.target.value })}
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="BTC, ETH, SPX"
              />
            </Field>
            <Field label="Minimum analyst priority">
              <select
                value={form.minimumPriority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    minimumPriority: event.target.value as AlertRuleView["minimumPriority"]
                  })
                }
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <span className="text-sm font-semibold text-slate-700">Enabled</span>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
                className="h-5 w-5 rounded border-slate-300 text-signal"
              />
            </label>
            <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              <Plus className="h-4 w-4" />
              Add rule
            </button>
          </form>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-panel">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-semibold tracking-tight text-ink">Rules</h2>
            <p className="mt-1 text-sm text-slate-500">
              Demo mode stores edits locally. Supabase persistence can reuse the same fields.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <div key={rule.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-signal" />
                      <h3 className="font-semibold text-ink">{rule.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      Priority: {rule.minimumPriority} / Keywords: {formatList(rule.keywords)} /
                      Assets: {formatList(rule.assets)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className={
                      rule.enabled
                        ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700"
                        : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    }
                  >
                    {rule.enabled ? "enabled" : "paused"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionButton({
  state,
  onClick,
  icon: Icon,
  label,
  secondary = false
}: {
  state: ActionState;
  onClick: () => void;
  icon: typeof Bell;
  label: string;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "running"}
      className={
        secondary
          ? "focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          : "focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {state === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
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

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatList(values: string[]) {
  return values.length ? values.join(", ") : "none";
}
