import { NextResponse } from "next/server";
import { createEmbedding, vectorToSqlLiteral } from "@/lib/ai/embeddings";
import { isDemoMode } from "@/lib/config/demo-mode";
import { searchDemoContentItems } from "@/lib/search/demo-search";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ ok: false, error: "Search query is required." }, { status: 400 });
    }

    if (isDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        results: searchDemoContentItems(query)
      });
    }

    const embedding = await createEmbedding(query);
    const supabase = createServiceRoleSupabaseClient();
    const { data, error } = await supabase.rpc("search_content_items", {
      query_embedding: vectorToSqlLiteral(embedding),
      query_text: query,
      match_count: 12
    });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return NextResponse.json({
      ok: true,
      demo: false,
      results: (data ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        analystName: item.analyst_name,
        sourceType: item.source_type ?? "unknown",
        publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString() : "Unknown",
        summary: item.summary ?? item.why_it_matters ?? "No summary available.",
        assets: item.assets,
        themes: item.themes,
        sentiment: item.sentiment,
        importanceScore: item.importance_score,
        score: Math.round(item.combined_score * 1000) / 1000
      }))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown search error";
    console.error("[search] Query failed", { error: message });

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
