import { AppShell } from "@/components/layout/app-shell";

export default function SearchLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        <div className="h-96 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
      </div>
    </AppShell>
  );
}
