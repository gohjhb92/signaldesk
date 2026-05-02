import { NextResponse } from "next/server";
import { runRssIngestion } from "@/lib/ingestion/rss";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/config/demo-mode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        sourceCount: 0,
        insertedCount: 0,
        duplicateCount: 0,
        skippedCount: 0,
        failedCount: 0,
        results: []
      });
    }

    const supabase = createServiceRoleSupabaseClient();
    const result = await runRssIngestion(supabase);

    return NextResponse.json(result, {
      status: result.failedCount > 0 ? 207 : 200
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion error";
    console.error("[rss-ingest] Job failed", { error: message });

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
