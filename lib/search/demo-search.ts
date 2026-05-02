import { mockContentItems } from "@/lib/data/mock";

export function searchDemoContentItems(query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return mockContentItems
    .map((item) => {
      const haystack = [
        item.title,
        item.summary,
        item.analystName,
        item.sourceType,
        item.sentiment,
        item.assets.join(" "),
        item.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || b.item.importanceScore - a.item.importanceScore)
    .slice(0, 12)
    .map(({ item, score }) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      analystName: item.analystName,
      sourceType: item.sourceType,
      publishedAt: item.publishedAt,
      summary: item.summary,
      assets: item.assets,
      themes: item.tags,
      sentiment: item.sentiment,
      importanceScore: item.importanceScore,
      score
    }));
}
