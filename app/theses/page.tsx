import { AppShell } from "@/components/layout/app-shell";
import { ThesisManager } from "@/components/theses/thesis-manager";
import { getContentItems, getTradeTheses } from "@/lib/data/repository";

export default async function ThesesPage() {
  const [theses, items] = await Promise.all([getTradeTheses(), getContentItems()]);

  return (
    <AppShell>
      <ThesisManager initialTheses={theses} items={items} />
    </AppShell>
  );
}
