import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-50 text-signal">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight text-ink">{value}</div>
    </div>
  );
}
