import type { TradeThesis } from "@/types/domain";

export const activeTradeTheses: TradeThesis[] = [
  {
    id: "thesis-crypto-hyperliquid",
    name: "Crypto / Hyperliquid cycle",
    category: "Crypto",
    status: "active",
    horizon: "6-24 months",
    conviction: "high",
    assets: ["HYPE", "BTC", "PURR"],
    themes: ["liquidity", "crypto", "risk appetite", "perps", "ETF flows"],
    bullCase: "On-chain liquidity, perps volume, protocol revenue, and crypto risk appetite could compound if the cycle broadens.",
    bearCase: "The trade weakens if BTC loses cycle leadership, Hyperliquid volumes fade, or regulation hits on-chain perps.",
    catalysts: [
      "Hyperliquid volume and fee growth",
      "BTC liquidity cycle confirmation",
      "Stablecoin supply expansion",
      "Token unlocks, incentives, or regulatory pressure",
      "CryptoUB, Pierre, LSDinmycoffee, LomahCrypto, ColdBloodShill, and TraderMayne chart context"
    ],
    invalidationSignals: [
      "Protocol exploit or sustained volume decay",
      "BTC cycle weakens materially",
      "Regulatory action hits on-chain perps"
    ],
    notes: "Core 6-24 month crypto trade. TA sources are tracked manually until X ingestion is added."
  },
  {
    id: "thesis-psychedelics",
    name: "Psychedelic therapeutics policy/catalyst trade",
    category: "Biotech",
    status: "building",
    horizon: "1-3 years",
    conviction: "medium",
    assets: ["DFTX", "GHRS", "ATAI"],
    themes: ["FDA", "policy", "clinical trials", "biotech"],
    bullCase: "FDA guidance, approvals, trial readouts, or a friendlier policy environment could revive investor interest in psychedelic therapeutics.",
    bearCase: "Small-cap biotech financing risk can overwhelm good narratives if trial data or policy follow-through disappoints.",
    catalysts: [
      "FDA guidance or approval language",
      "Clinical trial readouts",
      "Trump/admin health policy comments",
      "Institutional coverage and financing conditions"
    ],
    invalidationSignals: [
      "Failed trials or restrictive FDA guidance",
      "Dilutive capital raises",
      "No policy follow-through"
    ],
    notes: "Needs more source discovery around FDA, trial calendars, and company-specific filings."
  },
  {
    id: "thesis-nuclear",
    name: "Nuclear energy / uranium structural demand",
    category: "Energy",
    status: "building",
    horizon: "1-5 years",
    conviction: "medium",
    assets: ["URNM"],
    themes: ["uranium", "AI power", "energy security", "utilities"],
    bullCase: "AI power demand, grid reliability, energy security, and reactor restarts can support uranium and nuclear supply-chain assets.",
    bearCase: "Policy delays, weak uranium pricing, or stalled reactor activity could turn this into dead capital.",
    catalysts: [
      "Utility contracting",
      "Reactor restart approvals",
      "Uranium spot and term price strength",
      "AI data-center power demand"
    ],
    invalidationSignals: [
      "Policy delays",
      "Uranium price breakdown",
      "Nuclear project cancellations"
    ],
    notes: "Good fit for weekly thesis review because catalysts are slower-moving."
  },
  {
    id: "thesis-gold",
    name: "Gold / hard-asset hedge",
    category: "Gold",
    status: "active",
    horizon: "6-24 months",
    conviction: "medium",
    assets: ["AGI", "Alamos Gold"],
    themes: ["gold", "real yields", "central banks", "geopolitics"],
    bullCase: "Real-rate pressure, geopolitical risk, central-bank buying, and fiscal concerns can support gold and quality miners.",
    bearCase: "A real-yield spike or miner cost inflation can break the miner catch-up setup even if the macro story sounds right.",
    catalysts: [
      "Gold breakout confirmation",
      "Real yields rolling over",
      "Central-bank buying",
      "Alamos execution and margin expansion",
      "Santiago Capital and Michael Every/Rabobank macro-risk updates"
    ],
    invalidationSignals: [
      "Real yields surge",
      "Gold fails at resistance",
      "Miner cost inflation overwhelms gold price"
    ],
    notes: "Track both bullion confirmation and Alamos-specific execution."
  },
  {
    id: "thesis-food-commodities",
    name: "Food commodities / supply shock",
    category: "Commodities",
    status: "watching",
    horizon: "6-18 months",
    conviction: "medium",
    assets: ["WEAT", "WisdomTree Wheat", "SUGA", "WisdomTree Sugar", "CORN", "WisdomTree Corn"],
    themes: ["food inflation", "war risk", "fertilizer", "weather", "commodities"],
    bullCase: "War risk, shipping disruption, energy/fertilizer cost pressure, and weather volatility can create a food-inflation trade.",
    bearCase: "The setup fades if geopolitical risk cools, inventories normalize, or futures fail to confirm the narrative.",
    catalysts: [
      "Iran/Middle East escalation",
      "Fertilizer and energy prices",
      "Black Sea or shipping disruption",
      "Weather-driven crop stress",
      "Macro commentary from Michael Every/Rabobank, Santiago Capital, or Campbell Ramble"
    ],
    invalidationSignals: [
      "Ceasefire or de-escalation",
      "Inventories normalize",
      "Wheat, sugar, and corn fail to confirm"
    ],
    notes: "This is a catalyst-sensitive thesis, not a passive commodity basket."
  },
  {
    id: "thesis-lng",
    name: "LNG / natural gas infrastructure",
    category: "Energy",
    status: "watching",
    horizon: "6-24 months",
    conviction: "low",
    assets: ["FCG"],
    themes: ["LNG", "natural gas", "energy security", "infrastructure"],
    bullCase: "Energy security, LNG export demand, and natural gas infrastructure can benefit if global gas markets tighten.",
    bearCase: "Persistent gas oversupply or export-policy delays can keep the basket lagging.",
    catalysts: [
      "LNG export approvals",
      "US natural gas price basing",
      "European and Asian gas demand",
      "Pipeline and infrastructure policy",
      "Campbell Ramble cross-asset energy notes"
    ],
    invalidationSignals: [
      "Gas oversupply persists",
      "Export policy delays",
      "FCG components lag commodity recovery"
    ],
    notes: "Lower-conviction watchlist trade until price and policy confirmation improve."
  }
];
