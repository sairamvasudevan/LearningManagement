import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import { hasSameOrigin } from "@/lib/security";
import { INTERVIEW_BOTS, INTERVIEW_QUESTIONS, getBotById, getQuestionById } from "@/lib/interview-bots";
import {
  deductInterviewCredit,
  getInterviewSession,
  getUserInterviewCredits,
  listUserInterviewSessions,
  saveInterviewSession,
} from "@/lib/db";
import { InterviewMessage, InterviewSession } from "@/lib/interview-types";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({
        authenticated: false,
        bots: INTERVIEW_BOTS,
        questions: INTERVIEW_QUESTIONS,
        credits: null,
        sessions: [],
      });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");
    if (sessionId) {
      const single = getInterviewSession(sessionId, identity.id);
      if (!single) {
        return NextResponse.json({ error: "Session not found." }, { status: 404 });
      }
      return NextResponse.json({
        authenticated: true,
        session: single,
      });
    }

    const credits = getUserInterviewCredits(identity.id);
    const sessions = listUserInterviewSessions(identity.id);

    return NextResponse.json({
      authenticated: true,
      bots: INTERVIEW_BOTS,
      questions: INTERVIEW_QUESTIONS,
      credits,
      sessions,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve interview state." },
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
    return NextResponse.json(
      { error: "Authentication required to start a mock interview." },
      { status: 401 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const botId = String(body.botId || "bot-elo-1200");
    const questionId = String(body.questionId || "q-two-sum");

    const bot = getBotById(botId);
    const question = getQuestionById(questionId);

    // Deduct credit
    const deductRes = deductInterviewCredit(identity.id);
    if (!deductRes.success) {
      return NextResponse.json(
        {
          error: "No interview credits remaining. Top up your passes or claim your daily slot to proceed.",
          credits: getUserInterviewCredits(identity.id),
        },
        { status: 402 },
      );
    }

    const sessionId = `intv-${crypto.randomBytes(8).toString("hex")}`;
    const now = new Date().toISOString();

    const starterCode = question.starterCode[bot.defaultLanguage] || question.starterCode.python;

    const initialBotMessage: InterviewMessage = {
      id: `msg-${Date.now()}-intro`,
      sender: "bot",
      text: `${bot.introGreeting}\n\nToday's problem is **${question.title}** (${question.difficulty}, Topic: ${question.topic}):\n\n${question.prompt}\n\nPlease take a minute to read the requirements. What clarifying questions do you have before we talk through your approach?`,
      audioScript: `${bot.introGreeting} Today's problem is ${question.title}. Take a minute to read the prompt on your screen. What clarifying questions do you have before we discuss your approach?`,
      stage: "INTRO",
      timestamp: now,
    };

    const newSession: InterviewSession = {
      id: sessionId,
      userId: identity.id,
      botId: bot.id,
      botElo: bot.elo,
      questionId: question.id,
      stage: "INTRO",
      messages: [initialBotMessage],
      code: starterCode,
      language: bot.defaultLanguage,
      feedback: null,
      turnCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    saveInterviewSession(newSession);
    const updatedCredits = getUserInterviewCredits(identity.id);

    return NextResponse.json({
      success: true,
      session: newSession,
      credits: updatedCredits,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to initialize interview session." },
      { status: 500 },
    );
  }
}
