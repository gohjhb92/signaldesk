import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config/demo-mode";
import { runAlertEvaluation } from "@/lib/alerts/evaluate";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        evaluatedCount: 0,
        sentCount: 0,
        skippedCount: 0,
        failedCount: 0,
        results: []
      });
    }

    const supabase = createServiceRoleSupabaseClient();
    const result = await runAlertEvaluation(supabase);

    return NextResponse.json(result, {
      status: result.failedCount > 0 ? 207 : 200
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown alert error";
    console.error("[alerts] Run failed", { error: message });

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
