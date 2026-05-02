import type { Analyst, ContentItem, Source, ThemeSummary } from "@/types/domain";

export const mockAnalysts: Analyst[] = [
  {
    id: "analyst-lyn",
    name: "Lyn Alden",
    category: "researcher",
    priority: "high",
    notes: "Macro liquidity, Bitcoin, rates, and long-cycle market structure.",
    website: "https://www.lynalden.com",
    xHandle: "@LynAldenContact"
  },
  {
    id: "analyst-jurrien",
    name: "Jurrien Timmer",
    category: "analyst",
    priority: "medium",
    notes: "Equity cycles, valuation, Bitcoin adoption curves, and macro regime shifts.",
    website: "https://www.fidelity.com",
    xHandle: "@TimmerFidelity"
  },
  {
    id: "analyst-arthur",
    name: "Arthur Hayes",
    category: "investor",
    priority: "high",
    notes: "Crypto liquidity, policy, leverage, and risk appetite.",
    website: "https://cryptohayes.medium.com",
    xHandle: "@CryptoHayes"
  },
  {
    id: "analyst-compound",
    name: "The Compound",
    category: "podcaster",
    priority: "medium",
    notes: "Markets, allocation, ETFs, and investor positioning.",
    website: "https://www.youtube.com/@TheCompoundRWM",
    xHandle: "@TheCompoundNews"
  },
  {
    id: "analyst-koyfin",
    name: "Koyfin Research",
    category: "researcher",
    priority: "low",
    notes: "Market dashboards, sector performance, ETF trends, and macro charts.",
    website: "https://www.koyfin.com",
    xHandle: "@KoyfinCharts"
  },
  {
    id: "analyst-preston",
    name: "Preston Pysh",
    category: "podcaster",
    priority: "medium",
    notes: "Bitcoin, macro, credit cycles, and long-form investor interviews.",
    website: "https://www.theinvestorspodcast.com",
    xHandle: "@PrestonPysh"
  },
  {
    id: "analyst-liz",
    name: "Liz Ann Sonders",
    category: "strategist",
    priority: "medium",
    notes: "US equities, market breadth, sentiment, and economic cycle data.",
    website: "https://www.schwab.com",
    xHandle: "@LizAnnSonders"
  },
  {
    id: "analyst-kobeissi",
    name: "Kobeissi Letter",
    category: "researcher",
    priority: "high",
    notes: "Macro headlines, rates, oil, inflation, and policy catalysts.",
    website: "https://www.thekobeissiletter.com",
    xHandle: "@KobeissiLetter"
  },
  {
    id: "analyst-etf",
    name: "ETF Institute",
    category: "analyst",
    priority: "medium",
    notes: "ETF flows, sector rotations, fund launches, and allocation trends.",
    website: "https://example.com/etf-institute",
    xHandle: "@ETFInstitute"
  },
  {
    id: "analyst-metals",
    name: "Metals Desk",
    category: "trader",
    priority: "low",
    notes: "Gold, silver, copper, miners, and commodity momentum.",
    website: "https://example.com/metals-desk",
    xHandle: "@MetalsDesk"
  },
  {
    id: "analyst-campbell-ramble",
    name: "Campbell Ramble",
    category: "researcher",
    priority: "medium",
    notes: "AI-assisted market research source for cross-asset themes and trade ideas.",
    website: "https://www.campbellramble.ai/",
    xHandle: ""
  },
  {
    id: "analyst-santiago-capital",
    name: "Santiago Capital",
    category: "investor",
    priority: "high",
    notes: "Macro, dollar, gold, commodities, and global liquidity framework.",
    website: "https://santiagocapital.com/about/",
    xHandle: ""
  },
  {
    id: "analyst-crypto-ub",
    name: "CryptoUB",
    category: "trader",
    priority: "medium",
    notes: "Crypto and TradFi technical analysis, charts, and trade education.",
    website: "https://x.com/CryptoUB",
    xHandle: "@CryptoUB"
  },
  {
    id: "analyst-pierre-crypto",
    name: "Pierre",
    category: "trader",
    priority: "medium",
    notes: "Crypto charting and technical market structure commentary.",
    website: "https://x.com/pierre_crypt0",
    xHandle: "@pierre_crypt0"
  },
  {
    id: "analyst-lsdinmycoffee",
    name: "LSDinmycoffee",
    category: "trader",
    priority: "medium",
    notes: "Crypto trading education, market structure, and tactical setups.",
    website: "https://x.com/LSDinmycoffee",
    xHandle: "@LSDinmycoffee"
  },
  {
    id: "analyst-lomahcrypto",
    name: "LomahCrypto",
    category: "trader",
    priority: "medium",
    notes: "Crypto technical analysis, charts, and swing-trading context.",
    website: "https://x.com/LomahCrypto",
    xHandle: "@LomahCrypto"
  },
  {
    id: "analyst-coldbloodshill",
    name: "ColdBloodShill",
    category: "trader",
    priority: "medium",
    notes: "Trading education, psychology, charts, and crypto market commentary.",
    website: "https://x.com/ColdBloodShill",
    xHandle: "@ColdBloodShill"
  },
  {
    id: "analyst-tradermayne",
    name: "TraderMayne",
    category: "trader",
    priority: "medium",
    notes: "Crypto and TradFi technical analysis, education, and chart commentary.",
    website: "https://x.com/Tradermayne",
    xHandle: "@Tradermayne"
  }
];

export const mockSources: Source[] = [
  source("source-lyn-blog", "analyst-lyn", "Lyn Alden", "blog", "https://www.lynalden.com/feed/"),
  source("source-lyn-report", "analyst-lyn", "Lyn Alden", "report", "https://example.com/lyn/reports", false),
  source("source-jurrien-rss", "analyst-jurrien", "Jurrien Timmer", "rss", "https://example.com/fidelity-insights/rss"),
  source("source-arthur-blog", "analyst-arthur", "Arthur Hayes", "blog", "https://cryptohayes.medium.com/feed"),
  source("source-compound-youtube", "analyst-compound", "The Compound", "youtube", "https://www.youtube.com/feeds/videos.xml?channel_id=UCY2ifv8iH1Dsgjrz-h3lWLQ"),
  source("source-compound-podcast", "analyst-compound", "The Compound", "podcast", "https://example.com/the-compound/podcast.xml"),
  source("source-koyfin-substack", "analyst-koyfin", "Koyfin Research", "substack", "https://example.substack.com/feed"),
  source("source-preston-podcast", "analyst-preston", "Preston Pysh", "podcast", "https://example.com/tip-bitcoin/rss"),
  source("source-liz-rss", "analyst-liz", "Liz Ann Sonders", "rss", "https://example.com/schwab/market-commentary/rss"),
  source("source-kobeissi-rss", "analyst-kobeissi", "Kobeissi Letter", "rss", "https://example.com/kobeissi/rss"),
  source("source-kobeissi-x", "analyst-kobeissi", "Kobeissi Letter", "x_manual", "https://x.com/KobeissiLetter", false),
  source("source-etf-blog", "analyst-etf", "ETF Institute", "blog", "https://example.com/etf-institute/feed"),
  source("source-etf-report", "analyst-etf", "ETF Institute", "report", "https://example.com/etf-institute/reports", false),
  source("source-metals-blog", "analyst-metals", "Metals Desk", "blog", "https://example.com/metals-desk/feed"),
  source("source-metals-youtube", "analyst-metals", "Metals Desk", "youtube", "https://example.com/metals-desk/youtube.xml"),
  source("source-campbell-ramble", "analyst-campbell-ramble", "Campbell Ramble", "blog", "https://www.campbellramble.ai/"),
  source("source-santiago-capital", "analyst-santiago-capital", "Santiago Capital", "blog", "https://santiagocapital.com/about/"),
  source("source-crypto-ub-x", "analyst-crypto-ub", "CryptoUB", "x_manual", "https://x.com/CryptoUB", false),
  source("source-pierre-crypto-x", "analyst-pierre-crypto", "Pierre", "x_manual", "https://x.com/pierre_crypt0", false),
  source("source-lsdinmycoffee-x", "analyst-lsdinmycoffee", "LSDinmycoffee", "x_manual", "https://x.com/LSDinmycoffee", false),
  source("source-lomahcrypto-x", "analyst-lomahcrypto", "LomahCrypto", "x_manual", "https://x.com/LomahCrypto", false),
  source("source-coldbloodshill-x", "analyst-coldbloodshill", "ColdBloodShill", "x_manual", "https://x.com/ColdBloodShill", false),
  source("source-tradermayne-x", "analyst-tradermayne", "TraderMayne", "x_manual", "https://x.com/Tradermayne", false)
];

const itemSeed = [
  ["liquidity-btc", "Global liquidity impulse is turning constructive for scarce assets", "Lyn Alden Blog", "blog", "Lyn Alden", "high", "Today, 08:40", "2026-05-02T08:40:00+08:00", "Improving dollar liquidity and easing financial stress could support Bitcoin and gold while equity upside depends on earnings breadth.", ["liquidity", "macro", "risk appetite"], ["BTC", "GOLD", "SPX"], "bullish", 92],
  ["rates-duration", "Duration risk remains the pressure point for broad equity beta", "Fidelity Viewpoints", "rss", "Jurrien Timmer", "medium", "Yesterday, 17:15", "2026-05-01T17:15:00+08:00", "Multiples remain sensitive to real yields, but market internals are healthier than the headline index implies.", ["rates", "equities", "valuation"], ["QQQ", "SPY", "TLT"], "mixed", 78],
  ["crypto-leverage", "Crypto positioning is improving, but leverage is still clustered", "CryptoHayes", "blog", "Arthur Hayes", "high", "Apr 30, 21:05", "2026-04-30T21:05:00+08:00", "Crypto upside is framed as a liquidity trade with near-term risk from crowded perpetual futures positioning.", ["crypto", "leverage", "positioning"], ["BTC", "ETH", "SOL"], "bullish", 88],
  ["oil-dollar", "Oil volatility is feeding back into inflation expectations", "Macro Notes Podcast", "podcast", "Kobeissi Letter", "high", "Apr 29, 09:20", "2026-04-29T09:20:00+08:00", "Crude volatility may push inflation expectations higher and complicate the timing of policy easing.", ["commodities", "inflation", "central banks"], ["USO", "DXY", "TLT"], "bearish", 83],
  ["etf-flows", "Bitcoin ETF flows are stabilizing after a two-week risk reset", "ETF Desk YouTube", "youtube", "ETF Institute", "medium", "Today, 12:10", "2026-05-02T12:10:00+08:00", "Spot Bitcoin ETF flows are no longer deteriorating, reducing one pressure point for crypto beta.", ["ETF flows", "risk appetite", "crypto"], ["BTC", "IBIT", "ETH"], "neutral", 64],
  ["ai-earnings", "AI earnings revisions continue to dominate index leadership", "Koyfin Research", "substack", "Koyfin Research", "low", "Apr 28, 14:30", "2026-04-28T14:30:00+08:00", "AI-linked mega caps still carry earnings momentum while broader cyclicals remain less convincing.", ["earnings", "AI", "market breadth"], ["NVDA", "QQQ", "SPX"], "bullish", 67],
  ["fed-path", "Fed speakers keep optionality open before the next CPI print", "Kobeissi Letter", "rss", "Kobeissi Letter", "high", "Today, 10:45", "2026-05-02T10:45:00+08:00", "Policy comments suggest the Fed wants more inflation evidence before validating rate-cut expectations.", ["Fed", "inflation", "rates"], ["DXY", "TLT", "SPX"], "mixed", 86],
  ["gold-breakout", "Gold consolidates near breakout levels as real yields stall", "Metals Desk", "blog", "Metals Desk", "low", "Today, 07:25", "2026-05-02T07:25:00+08:00", "Gold momentum remains constructive while real yields fail to extend higher.", ["breakout", "real yields", "commodities"], ["GOLD", "GLD", "DXY"], "bullish", 72],
  ["small-caps", "Small caps need credit spreads to stay calm", "Schwab Market Notes", "rss", "Liz Ann Sonders", "medium", "Apr 27, 16:40", "2026-04-27T16:40:00+08:00", "Small-cap participation depends on stable credit and improving earnings breadth.", ["credit", "market breadth", "cyclicals"], ["IWM", "SPX", "HYG"], "neutral", 58],
  ["eth-upgrade", "Ethereum staking flows improve ahead of protocol catalyst", "TIP Crypto Podcast", "podcast", "Preston Pysh", "medium", "Apr 26, 22:00", "2026-04-26T22:00:00+08:00", "ETH staking and L2 activity are improving, but the market still needs a clearer ETF-flow impulse.", ["staking", "ETF flows", "crypto"], ["ETH", "BTC"], "mixed", 62],
  ["recession-watch", "Recession risk is low but not gone as claims drift higher", "Kobeissi Letter", "rss", "Kobeissi Letter", "high", "Apr 26, 08:15", "2026-04-26T08:15:00+08:00", "Labor data is not flashing red, but claims trends deserve monitoring for equity risk.", ["recession", "labor market", "macro"], ["SPX", "DXY", "TLT"], "neutral", 76],
  ["copper-demand", "Copper demand narrative improves on grid and AI power capex", "Metals Desk", "youtube", "Metals Desk", "low", "Apr 25, 11:05", "2026-04-25T11:05:00+08:00", "Copper bulls are leaning on power infrastructure and AI data-center demand.", ["commodities", "AI", "infrastructure"], ["COPPER", "FCX"], "bullish", 61],
  ["qqq-levels", "QQQ holds key support despite higher rate volatility", "Koyfin Research", "substack", "Koyfin Research", "low", "Apr 24, 15:30", "2026-04-24T15:30:00+08:00", "Large-cap tech remains technically resilient, but leadership is concentrated.", ["technical levels", "rates", "market breadth"], ["QQQ", "NVDA", "MSFT"], "mixed", 59],
  ["oil-supply", "Oil supply risk returns as inventories tighten", "Kobeissi Letter", "rss", "Kobeissi Letter", "high", "Apr 24, 09:35", "2026-04-24T09:35:00+08:00", "Inventory draws and geopolitical risk are lifting the oil risk premium.", ["oil", "inflation", "geopolitics"], ["OIL", "USO", "XLE"], "bearish", 82],
  ["btc-range", "Bitcoin remains range-bound while volatility compresses", "Preston Pysh", "podcast", "Preston Pysh", "medium", "Apr 23, 18:10", "2026-04-23T18:10:00+08:00", "BTC volatility compression suggests a larger move is building, but direction remains unresolved.", ["volatility", "breakout", "crypto"], ["BTC", "IBIT"], "mixed", 68],
  ["bank-credit", "Bank credit growth is no longer a clear headwind", "Lyn Alden Blog", "blog", "Lyn Alden", "high", "Apr 22, 13:50", "2026-04-22T13:50:00+08:00", "Credit growth stabilization supports the soft-landing narrative and risk assets.", ["credit", "liquidity", "soft landing"], ["SPX", "BTC", "HYG"], "bullish", 84],
  ["earnings-revisions", "Earnings revisions broaden outside mega-cap tech", "Schwab Market Notes", "rss", "Liz Ann Sonders", "medium", "Apr 21, 10:10", "2026-04-21T10:10:00+08:00", "Broader earnings revisions would make the equity rally less fragile.", ["earnings", "market breadth", "equities"], ["SPX", "IWM", "QQQ"], "bullish", 74],
  ["dxy-pressure", "Dollar strength is pressuring commodities and EM risk", "Koyfin Research", "substack", "Koyfin Research", "low", "Apr 20, 12:00", "2026-04-20T12:00:00+08:00", "A firm dollar is tightening conditions for commodities and emerging market assets.", ["DXY", "macro", "risk appetite"], ["DXY", "GOLD", "EEM"], "bearish", 63],
  ["sol-activity", "Solana activity rebounds but fee quality is uneven", "CryptoHayes", "blog", "Arthur Hayes", "high", "Apr 19, 20:45", "2026-04-19T20:45:00+08:00", "SOL activity is rebounding, though the quality and durability of fee growth remain debated.", ["crypto", "fees", "risk appetite"], ["SOL", "ETH"], "mixed", 79],
  ["miners", "Gold miners lag bullion despite improving margins", "Metals Desk", "blog", "Metals Desk", "low", "Apr 18, 09:15", "2026-04-18T09:15:00+08:00", "Miner underperformance may offer catch-up potential if gold stays firm.", ["commodities", "miners", "valuation"], ["GDX", "GOLD"], "bullish", 55],
  ["etf-sector", "ETF flows rotate toward defensives after hot inflation data", "ETF Institute", "blog", "ETF Institute", "medium", "Apr 17, 16:25", "2026-04-17T16:25:00+08:00", "Sector ETF flows show investors adding defensives after inflation surprised higher.", ["ETF flows", "inflation", "sector rotation"], ["XLU", "XLP", "SPY"], "bearish", 66],
  ["regulation-crypto", "Crypto regulation headline risk rises into summer", "CryptoHayes", "blog", "Arthur Hayes", "high", "Apr 16, 23:10", "2026-04-16T23:10:00+08:00", "Policy uncertainty may create volatility even if the medium-term liquidity setup is positive.", ["regulation", "crypto", "volatility"], ["BTC", "ETH", "COIN"], "bearish", 81],
  ["treasury-auction", "Treasury auction demand improves at the long end", "Fidelity Viewpoints", "rss", "Jurrien Timmer", "medium", "Apr 15, 14:55", "2026-04-15T14:55:00+08:00", "Better long-end demand could ease pressure on duration-sensitive equities.", ["rates", "treasury", "duration"], ["TLT", "QQQ", "SPX"], "bullish", 69],
  ["crash-risk", "Crash-risk hedges are cheap but catalysts are unclear", "The Compound Podcast", "podcast", "The Compound", "medium", "Apr 14, 17:30", "2026-04-14T17:30:00+08:00", "Options pricing is not demanding much tail risk, but the catalyst set remains ambiguous.", ["crash", "volatility", "hedging"], ["VIX", "SPY", "QQQ"], "neutral", 57],
  ["china-stimulus", "China stimulus hopes lift copper and EM sentiment", "Koyfin Research", "substack", "Koyfin Research", "low", "Apr 13, 08:50", "2026-04-13T08:50:00+08:00", "Stimulus expectations are supporting copper and emerging markets, but confirmation is needed.", ["China", "stimulus", "commodities"], ["COPPER", "EEM", "FXI"], "bullish", 60],
  ["btc-miners", "Bitcoin miners face margin pressure after hashprice reset", "Preston Pysh", "podcast", "Preston Pysh", "medium", "Apr 12, 19:45", "2026-04-12T19:45:00+08:00", "Miner economics are tightening, which may affect forced selling and equity beta.", ["crypto", "miners", "hashprice"], ["BTC", "MARA", "RIOT"], "mixed", 65],
  ["consumer-stress", "Consumer stress is showing up in lower-end retail", "Schwab Market Notes", "rss", "Liz Ann Sonders", "medium", "Apr 11, 11:20", "2026-04-11T11:20:00+08:00", "Retail dispersion suggests the consumer is slowing unevenly rather than broadly collapsing.", ["consumer", "earnings", "recession"], ["XLY", "WMT", "SPX"], "neutral", 58],
  ["oil-breakout", "Crude oil tests breakout as geopolitical premium rises", "Metals Desk", "youtube", "Metals Desk", "low", "Apr 10, 07:10", "2026-04-10T07:10:00+08:00", "Oil is testing a technical breakout that could reignite inflation concern.", ["oil", "breakout", "inflation"], ["OIL", "USO", "XLE"], "bullish", 70],
  ["fed-liquidity", "Fed balance sheet runoff is no longer tightening at the same pace", "Lyn Alden Blog", "blog", "Lyn Alden", "high", "Apr 09, 13:00", "2026-04-09T13:00:00+08:00", "Slower liquidity withdrawal can reduce a macro headwind for risk assets.", ["Fed", "liquidity", "macro"], ["BTC", "SPX", "GOLD"], "bullish", 87],
  ["qqq-crowding", "Mega-cap crowding remains the main index fragility", "ETF Institute", "report", "ETF Institute", "medium", "Apr 08, 15:40", "2026-04-08T15:40:00+08:00", "Index returns remain vulnerable to crowding in a small number of mega-cap leaders.", ["crowding", "ETF flows", "market breadth"], ["QQQ", "SPY", "NVDA"], "bearish", 73]
] as const;

export const mockContentItems: ContentItem[] = itemSeed.map(
  ([
    id,
    title,
    sourceName,
    sourceType,
    analystName,
    analystPriority,
    publishedAt,
    publishedAtIso,
    summary,
    tags,
    assets,
    sentiment,
    importanceScore
  ]) => ({
    id: `item-${id}`,
    title,
    sourceName,
    sourceType,
    analystName,
    analystPriority,
    url: `https://example.com/signaldemo/${id}`,
    publishedAt,
    publishedAtIso,
    summary,
    tags: [...tags],
    assets: [...assets],
    sentiment,
    importanceScore
  })
);

export const mockThemeSummaries: ThemeSummary[] = countThemes(mockContentItems).slice(0, 8);

function source(
  id: string,
  analystId: string,
  analystName: string,
  sourceType: Source["sourceType"],
  sourceUrl: string,
  active = true
): Source {
  return {
    id,
    analystId,
    analystName,
    sourceType,
    sourceUrl,
    active
  };
}

function countThemes(items: ContentItem[]): ThemeSummary[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const max = Math.max(...counts.values());
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, weight: Math.round((count / max) * 100) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
