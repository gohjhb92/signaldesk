import Link from "next/link";
import { BarChart3, Bell, Database, RadioTower, Search, Target, UsersRound } from "lucide-react";
import { isDemoMode } from "@/lib/config/demo-mode";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/theses", label: "Theses", icon: Target },
  { href: "/search", label: "Search", icon: Search },
  { href: "/analysts", label: "Analysts", icon: UsersRound },
  { href: "/sources", label: "Sources", icon: RadioTower },
  { href: "/alerts", label: "Alerts", icon: Bell }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const demoMode = isDemoMode();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-ink">SignalDesk</div>
              <div className="text-xs font-medium text-slate-500">Personal market intel</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-ink hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        {demoMode ? (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-800">
            Public demo mode: using bundled sample data. Connect Supabase to ingest live sources.
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
