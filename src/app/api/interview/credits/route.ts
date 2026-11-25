import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import { hasSameOrigin } from "@/lib/security";
import {
  addInterviewCredits,
  claimDailyInterviewSlot,
  getUserInterviewCredits,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({
        authenticated: false,
        credits: {
          userId: "",
          freeSlots: 3,
          purchasedSlots: 0,
          totalInterviews: 0,
          lastRefillDate: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const credits = getUserInterviewCredits(identity.id);
    return NextResponse.json({
      authenticated: true,
      credits,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve interview credits." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden cross-origin mutation." }, { status: 403 });
  }

  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "claim_daily");

    if (action === "claim_daily") {
      const claimResult = claimDailyInterviewSlot(identity.id);
      const credits = getUserInterviewCredits(identity.id);
      return NextResponse.json({
        success: claimResult.claimed,
        message: claimResult.message,
        credits,
      });
    }

    if (action === "top_up") {
      const count = Number(body.count || 5);
      const topUpResult = addInterviewCredits(identity.id, count);
      const credits = getUserInterviewCredits(identity.id);
      return NextResponse.json({
        success: topUpResult.success,
        message: `Successfully credited ${count} mock interview passes to your account!`,
        credits,
      });
    }

    return NextResponse.json({ error: "Unsupported credit action." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Failed to modify interview credits." },
      { status: 500 },
    );
  }
}
