import { AnalystManager } from "@/components/analysts/analyst-manager";
import { AppShell } from "@/components/layout/app-shell";
import { getAnalysts } from "@/lib/data/repository";

export default async function AnalystsPage() {
  const analysts = await getAnalysts();

  return (
    <AppShell>
      <AnalystManager initialAnalysts={analysts} />
    </AppShell>
  );
}
