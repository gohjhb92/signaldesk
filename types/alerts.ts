import type { AnalystPriority } from "@/types/domain";

export type AlertRuleView = {
  id: string;
  name: string;
  keywords: string[];
  assets: string[];
  minimumPriority: AnalystPriority | "none";
  enabled: boolean;
};
