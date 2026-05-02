import type { ContentItem, TradeThesis } from "../../types/domain";

export type ThesisEvidence = {
  supporting: ContentItem[];
  opposing: ContentItem[];
  neutral: ContentItem[];
};

export function buildThesisEvidence(theses: TradeThesis[], items: ContentItem[]) {
  const evidence = new Map<string, ThesisEvidence>();

  for (const thesis of theses) {
    const matched = items
      .filter((item) => contentMatchesThesis(item, thesis))
      .sort((a, b) => b.importanceScore - a.importanceScore);

    evidence.set(thesis.id, {
      supporting: matched.filter((item) => item.sentiment === "bullish"),
      opposing: matched.filter((item) => item.sentiment === "bearish"),
      neutral: matched.filter((item) => !["bullish", "bearish"].includes(item.sentiment))
    });
  }

  return evidence;
}

export function contentMatchesThesis(item: ContentItem, thesis: TradeThesis) {
  const terms = [...thesis.assets, ...thesis.themes].map(normalizeTerm).filter(Boolean);
  const haystack = normalizeTerm(
    [item.assets.join(" "), item.tags.join(" "), item.title, item.summary].join(" ")
  );

  return terms.some((term) => haystack.includes(term));
}

export function getThesisEvidenceCount(evidence: ThesisEvidence | undefined) {
  if (!evidence) {
    return 0;
  }

  return evidence.supporting.length + evidence.opposing.length + evidence.neutral.length;
}

function normalizeTerm(value: string) {
  return value.trim().toLowerCase();
}
