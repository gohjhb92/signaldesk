"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <AppShell>
      <div className="rounded-[1.5rem] border border-rose-100 bg-white p-8 shadow-panel">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Dashboard failed to load
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          SignalDesk could not prepare the dashboard data. In demo mode, try again; with Supabase,
          check your environment variables and database connection.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </AppShell>
  );
}
