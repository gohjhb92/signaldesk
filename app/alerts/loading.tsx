import { AppShell } from "@/components/layout/app-shell";

export default function AlertsLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
          <div className="h-96 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        </div>
      </div>
    </AppShell>
  );
}
