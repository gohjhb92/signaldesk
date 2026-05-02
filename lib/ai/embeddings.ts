const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function createEmbedding(input: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI embedding failed: ${response.status} ${errorText}`);
  }

  const body = (await response.json()) as {
    data?: Array<{
      embedding?: number[];
    }>;
  };
  const embedding = body.data?.[0]?.embedding;

  if (!embedding?.length) {
    throw new Error("OpenAI embedding response did not include an embedding.");
  }

  return embedding;
}

export function vectorToSqlLiteral(vector: number[]) {
  return `[${vector.join(",")}]`;
}

export function buildEmbeddingText(item: {
  title: string;
  summary?: string | null;
  why_it_matters?: string | null;
  raw_text?: string | null;
  assets?: string[] | null;
  themes?: string[] | null;
  sentiment?: string | null;
}) {
  return [
    `Title: ${item.title}`,
    item.summary ? `Summary: ${item.summary}` : null,
    item.why_it_matters ? `Why it matters: ${item.why_it_matters}` : null,
    item.assets?.length ? `Assets: ${item.assets.join(", ")}` : null,
    item.themes?.length ? `Themes: ${item.themes.join(", ")}` : null,
    item.sentiment ? `Sentiment: ${item.sentiment}` : null,
    item.raw_text ? `Raw text: ${item.raw_text.slice(0, 2000)}` : null
  ]
    .filter(Boolean)
    .join("\n");
}
