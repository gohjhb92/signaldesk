import { AppShell } from "@/components/layout/app-shell";

export default function SourcesLoading() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[520px] animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        <div className="h-[520px] animate-pulse rounded-[1.5rem] bg-slate-200/70" />
      </div>
    </AppShell>
  );
}
