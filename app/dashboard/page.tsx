import { AppShell } from "@/components/layout/app-shell";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { getAnalysts, getContentItems, getSources, getTradeTheses } from "@/lib/data/repository";

export default async function DashboardPage() {
  const [items, analysts, sources, theses] = await Promise.all([
    getContentItems(),
    getAnalysts(),
    getSources(),
    getTradeTheses()
  ]);

  return (
    <AppShell>
      <DashboardWorkspace items={items} analysts={analysts} sources={sources} theses={theses} />
    </AppShell>
  );
}
