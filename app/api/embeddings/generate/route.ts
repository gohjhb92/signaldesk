import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config/demo-mode";
import { buildEmbeddingText, createEmbedding, EMBEDDING_MODEL, vectorToSqlLiteral } from "@/lib/ai/embeddings";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        attemptedCount: 0,
        embeddedCount: 0,
        failedCount: 0,
        results: []
      });
    }

    const supabase = createServiceRoleSupabaseClient();
    const { data: items, error } = await supabase
      .from("content_items")
      .select("id, title, summary, why_it_matters, raw_text, assets, themes, sentiment")
      .is("embedding", null)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(`Failed to load content_items missing embeddings: ${error.message}`);
    }

    const results: Array<{ itemId: string; ok: boolean; error?: string }> = [];

    for (const item of items ?? []) {
      try {
        const embedding = await createEmbedding(buildEmbeddingText(item));
        const { error: updateError } = await supabase
          .from("content_items")
          .update({
            embedding: vectorToSqlLiteral(embedding),
            embedding_model: EMBEDDING_MODEL,
            embedded_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        results.push({ itemId: item.id, ok: true });
      } catch (embeddingError) {
        results.push({
          itemId: item.id,
          ok: false,
          error: embeddingError instanceof Error ? embeddingError.message : "Unknown embedding error"
        });
      }
    }

    return NextResponse.json({
      ok: results.every((result) => result.ok),
      demo: false,
      attemptedCount: results.length,
      embeddedCount: results.filter((result) => result.ok).length,
      failedCount: results.filter((result) => !result.ok).length,
      results
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown embedding generation error";
    console.error("[embeddings] Generation failed", { error: message });

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
