import { AppShell } from "@/components/layout/app-shell";
import { SourceManager } from "@/components/sources/source-manager";
import { getAnalysts, getSources } from "@/lib/data/repository";

export default async function SourcesPage() {
  const [sources, analysts] = await Promise.all([getSources(), getAnalysts()]);

  return (
    <AppShell>
      <SourceManager analysts={analysts} initialSources={sources} />
    </AppShell>
  );
}
