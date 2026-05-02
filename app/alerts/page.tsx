import { AppShell } from "@/components/layout/app-shell";
import { AlertsManager } from "@/components/alerts/alerts-manager";
import { mockAlertRules } from "@/lib/data/alerts";

export default function AlertsPage() {
  return (
    <AppShell>
      <AlertsManager initialRules={mockAlertRules} />
    </AppShell>
  );
}
