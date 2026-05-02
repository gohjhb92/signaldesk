import { AppShell } from "@/components/layout/app-shell";

export default function LoadingTheses() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-[1.5rem] bg-white/80" />
        <div className="grid gap-6 xl:grid-cols-[minmax(340px,0.75fr)_minmax(0,1.25fr)]">
          <div className="h-[42rem] animate-pulse rounded-[1.5rem] bg-white/80" />
          <div className="space-y-4">
            <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/80" />
            <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/80" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
