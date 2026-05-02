import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config/demo-mode";
import { sendTelegramMessage } from "@/lib/alerts/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const message = [
      "🚨 SignalDesk Alert",
      "Analyst: Demo Analyst",
      "Source: test",
      "Title: Telegram test alert",
      "Assets: BTC, SPX",
      "Themes: liquidity, risk appetite",
      "Sentiment: mixed",
      "Importance: 8/10",
      "Why it matters: This confirms your Telegram alert channel is configured.",
      "Link: https://example.com/signaldemo/test-alert"
    ].join("\n");

    if (isDemoMode()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        message: "Demo mode: Telegram credentials are not configured, so no message was sent."
      });
    }

    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true, demo: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Telegram test error";
    console.error("[alerts] Test failed", { error: message });

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
