import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/security";
import { getCurrentIdentity } from "@/lib/auth";
import {
  getCommunicationExerciseById,
  CORPORATE_MOCK_ASSESSMENT,
} from "@/lib/communication-data";
import {
  evaluatePracticeExercise,
  evaluateFullAssessment,
  PracticeSubmissionInput,
} from "@/lib/communication-evaluator";
import {
  recordCommunicationSubmission,
  getUserCommunicationSubmissions,
} from "@/lib/db";

const MAX_BODY_BYTES = 32_768;

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ authenticated: false, submissions: [] });
    }
    const submissions = getUserCommunicationSubmissions(identity.id);
    return NextResponse.json({ authenticated: true, submissions });
  } catch {
    return NextResponse.json(
      { error: "Failed to load communication records." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Submission payload exceeds size limit." }, { status: 413 });
    }

    const body = JSON.parse(rawBody) as {
      mode?: "practice" | "assessment";
      exerciseId?: string;
      responseText?: string;
      selectedOptionIndex?: number;
      elapsedSeconds?: number;
      inputMethod?: "mic" | "typed";
      speechConfidence?: number;
      answers?: PracticeSubmissionInput[];
    };

    const identity = await getCurrentIdentity();

    if (body.mode === "assessment") {
      const answers = Array.isArray(body.answers) ? body.answers.slice(0, 20) : [];
      const result = evaluateFullAssessment(answers);

      let persisted = false;
      if (identity) {
        recordCommunicationSubmission({
          userId: identity.id,
          mode: "assessment",
          skill: "full_mock",
          exerciseId: CORPORATE_MOCK_ASSESSMENT.id,
          overallScore: result.overallVersantScore,
          percentScore: result.overallPercent,
          cefrLevel: result.cefrLevel,
          sentenceMastery: result.dimensions.sentenceMastery,
          vocabularyScore: result.dimensions.vocabulary,
          fluencyScore: result.dimensions.fluency,
          deliveryScore: result.dimensions.delivery,
          passed: result.overallVersantScore >= 54,
          responseSummary: `${result.cefrLevel} · ${result.readinessVerdict}`,
          feedbackJson: JSON.stringify({
            skillPercentages: result.skillPercentages,
            strengths: result.strengths,
            priorityImprovements: result.priorityImprovements,
          }),
        });
        persisted = true;
      }

      return NextResponse.json({
        ok: true,
        mode: "assessment",
        persisted,
        result,
      });
    }

    // Practice drill mode
    const exerciseId = String(body.exerciseId || "").trim();
    const exercise = getCommunicationExerciseById(exerciseId);
    if (!exercise) {
      return NextResponse.json({ error: "Unknown communication exercise ID." }, { status: 404 });
    }

    const evaluation = evaluatePracticeExercise(exercise, {
      exerciseId: exercise.id,
      responseText: typeof body.responseText === "string" ? body.responseText.slice(0, 6000) : "",
      selectedOptionIndex:
        typeof body.selectedOptionIndex === "number" ? body.selectedOptionIndex : undefined,
      elapsedSeconds: typeof body.elapsedSeconds === "number" ? body.elapsedSeconds : 20,
      inputMethod: body.inputMethod === "mic" ? "mic" : "typed",
      speechConfidence:
        typeof body.speechConfidence === "number" ? body.speechConfidence : undefined,
    });

    let persisted = false;
    if (identity) {
      recordCommunicationSubmission({
        userId: identity.id,
        mode: "practice",
        skill: evaluation.skill,
        exerciseId: evaluation.exerciseId,
        overallScore: evaluation.versantScore,
        percentScore: evaluation.percentScore,
        cefrLevel: evaluation.cefrLevel,
        sentenceMastery: evaluation.dimensions.sentenceMastery,
        vocabularyScore: evaluation.dimensions.vocabulary,
        fluencyScore: evaluation.dimensions.fluency,
        deliveryScore: evaluation.dimensions.delivery,
        passed: evaluation.passed,
        responseSummary: evaluation.summaryFeedback,
        feedbackJson: JSON.stringify({
          metrics: evaluation.metrics,
          actionableTips: evaluation.actionableTips,
        }),
      });
      persisted = true;
    }

    return NextResponse.json({
      ok: true,
      mode: "practice",
      persisted,
      result: evaluation,
    });
  } catch {
    return NextResponse.json(
      { error: "Communication evaluation request could not be processed." },
      { status: 400 },
    );
  }
}
