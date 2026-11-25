import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import { hasSameOrigin } from "@/lib/security";
import { getInterviewSession, saveInterviewSession } from "@/lib/db";
import { evaluateCandidateTurn } from "@/lib/interview-evaluator";

export const dynamic = "force-dynamic";

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
    const sessionId = String(body.sessionId || "");
    const candidateText = typeof body.candidateText === "string" ? body.candidateText : "";
    const code = typeof body.code === "string" ? body.code : undefined;
    const language = typeof body.language === "string" ? body.language : undefined;
    const concludeNow = Boolean(body.concludeNow);

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId parameter." }, { status: 400 });
    }

    const session = getInterviewSession(sessionId, identity.id);
    if (!session) {
      return NextResponse.json({ error: "Interview session not found." }, { status: 404 });
    }

    if (session.status === "concluded" && !concludeNow) {
      return NextResponse.json({
        error: "This interview session has already concluded.",
        session,
      }, { status: 400 });
    }

    const { updatedSession, botMessage, concluded } = evaluateCandidateTurn({
      session,
      candidateText,
      code,
      language,
      concludeNow,
    });

    saveInterviewSession(updatedSession);

    return NextResponse.json({
      success: true,
      session: updatedSession,
      botMessage,
      concluded,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process interview response." },
      { status: 500 },
    );
  }
}
