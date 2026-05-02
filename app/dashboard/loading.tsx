import { AppShell } from "@/components/layout/app-shell";

export default function DashboardLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[1.25rem] bg-slate-200/70" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
          <div className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        </div>
      </div>
    </AppShell>
  );
}
