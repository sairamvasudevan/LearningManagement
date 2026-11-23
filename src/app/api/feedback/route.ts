import { NextResponse, type NextRequest } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import {
  upsertModuleFeedback,
  getModuleFeedbackForUser,
  getAllModuleFeedback,
  getModuleFeedbackMetrics,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json(
        { error: "Authentication required: Please sign in with your student account to record verified feedback.", needsAuth: true },
        { status: 401 },
      );
    }

    const body = await request.json();
    const moduleNumber = Number(body.moduleNumber);

    if (!moduleNumber || moduleNumber < 1 || moduleNumber > 100) {
      return NextResponse.json(
        { error: "Valid module number (1-100) is required." },
        { status: 400 },
      );
    }

    const helpfulnessRating = Number(body.helpfulnessRating);
    if (!helpfulnessRating || helpfulnessRating < 1 || helpfulnessRating > 5) {
      return NextResponse.json(
        { error: "Helpfulness rating must be an integer between 1 and 5." },
        { status: 400 },
      );
    }

    const easeOfUseRating = Number(body.easeOfUseRating || body.userFriendlinessRating || 5);
    if (easeOfUseRating < 1 || easeOfUseRating > 5) {
      return NextResponse.json(
        { error: "Ease-of-use rating must be an integer between 1 and 5." },
        { status: 400 },
      );
    }

    const difficultyLevel = body.difficultyLevel as "too_easy" | "just_right" | "too_hard";
    if (!["too_easy", "just_right", "too_hard"].includes(difficultyLevel)) {
      return NextResponse.json(
        { error: "Difficulty level must be 'too_easy', 'just_right', or 'too_hard'." },
        { status: 400 },
      );
    }

    const feedbackText = String(body.feedbackText || "").trim();

    const saved = upsertModuleFeedback({
      userId: identity.id,
      moduleNumber,
      helpfulnessRating,
      difficultyLevel,
      easeOfUseRating,
      feedbackText,
    });

    return NextResponse.json({
      ok: true,
      message: "Feedback successfully saved and routed to platform curriculum engine.",
      feedback: saved,
    });
  } catch (error: unknown) {
    console.error("Error saving module feedback:", error);
    return NextResponse.json(
      { error: "Internal server error saving feedback." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const identity = await getCurrentIdentity();
    const searchParams = request.nextUrl.searchParams;
    const modNumParam = searchParams.get("moduleNumber");
    const summaryParam = searchParams.get("summary");

    // Admin requesting full metrics and summaries
    if (summaryParam === "true") {
      if (!identity || identity.role !== "admin") {
        return NextResponse.json({ error: "Admin privilege required" }, { status: 403 });
      }
      const metrics = getModuleFeedbackMetrics();
      const list = getAllModuleFeedback({ limit: 100 });
      return NextResponse.json({ ok: true, metrics, list });
    }

    // Specific module feedback lookup
    if (modNumParam) {
      const moduleNumber = Number(modNumParam);
      if (!moduleNumber || moduleNumber < 1 || moduleNumber > 100) {
        return NextResponse.json({ error: "Invalid module number" }, { status: 400 });
      }

      // If user is not signed in, return clean unauthenticated payload without console errors
      if (!identity) {
        return NextResponse.json({
          ok: true,
          authenticated: false,
          feedback: null,
        });
      }

      const userFeedback = getModuleFeedbackForUser(identity.id, moduleNumber);
      return NextResponse.json({
        ok: true,
        authenticated: true,
        user: {
          id: identity.id,
          name: identity.fullName || identity.email.split("@")[0],
          email: identity.email,
          role: identity.role,
          college: identity.college,
        },
        feedback: userFeedback,
      });
    }

    return NextResponse.json({ error: "Missing moduleNumber query param." }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error retrieving feedback:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
