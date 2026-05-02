import type { AlertRuleView } from "@/types/alerts";

export const mockAlertRules: AlertRuleView[] = [
  {
    id: "rule-crypto",
    name: "High-signal crypto",
    keywords: ["ETF", "liquidity", "regulation"],
    assets: ["BTC", "ETH", "SOL"],
    minimumPriority: "medium",
    enabled: true
  },
  {
    id: "rule-macro",
    name: "Macro risk watch",
    keywords: ["Fed", "inflation", "recession", "oil"],
    assets: ["DXY", "TLT", "SPX"],
    minimumPriority: "medium",
    enabled: true
  },
  {
    id: "rule-defensive",
    name: "Portfolio defensives",
    keywords: ["breakout", "crash", "credit"],
    assets: ["GOLD", "OIL", "VIX"],
    minimumPriority: "low",
    enabled: false
  }
];
