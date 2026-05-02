import { NextResponse } from "next/server";
import { summarizeNewContentItems } from "@/lib/ai/summarize-job";
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
        attemptedCount: 0,
        summarizedCount: 0,
        failedCount: 0,
        results: []
      });
    }

    const supabase = createServiceRoleSupabaseClient();
    const result = await summarizeNewContentItems(supabase);

    return NextResponse.json(result, {
      status: result.failedCount > 0 ? 207 : 200
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown summarization error";
    console.error("[summarize] Job failed", { error: message });

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
