import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/security";
import { getCurrentIdentity } from "@/lib/auth";
import {
  AUDIO_DSA_EPISODES,
  evaluateAudioEpisodeRecall,
  getAudioDsaEpisodeById,
} from "@/lib/audio-dsa-data";
import {
  getUserAudioDsaProgress,
  recordAudioDsaProgress,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_384;

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({
        authenticated: false,
        completedEpisodeIds: [],
        totalEpisodes: AUDIO_DSA_EPISODES.length,
        progress: [],
      });
    }

    const rows = getUserAudioDsaProgress(identity.id);
    const completedEpisodeIds = rows
      .filter((r) => r.passed === 1)
      .map((r) => r.episode_id);

    return NextResponse.json({
      authenticated: true,
      completedEpisodeIds,
      totalEpisodes: AUDIO_DSA_EPISODES.length,
      progress: rows,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load Audio DSA episode progress." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json(
      { error: "Cross-origin request rejected." },
      { status: 403 },
    );
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Submission payload exceeds 16 KB limit." },
        { status: 413 },
      );
    }

    const body = JSON.parse(rawBody) as {
      episodeId?: string;
      selectedIndex?: number;
      reflectionText?: string;
    };

    const episodeId = String(body.episodeId || "").trim();
    const episode = getAudioDsaEpisodeById(episodeId);
    if (!episode) {
      return NextResponse.json(
        { error: "Audio DSA episode not found." },
        { status: 404 },
      );
    }

    const selectedIndex =
      typeof body.selectedIndex === "number" &&
      Number.isInteger(body.selectedIndex) &&
      body.selectedIndex >= 0 &&
      body.selectedIndex < episode.quiz.options.length
        ? body.selectedIndex
        : -1;

    if (selectedIndex === -1) {
      return NextResponse.json(
        { error: "Please select an answer choice (A–D)." },
        { status: 400 },
      );
    }

    const passed = selectedIndex === episode.quiz.correctIndex;
    const reflectionText =
      typeof body.reflectionText === "string"
        ? body.reflectionText.trim().slice(0, 1200)
        : "";
    const recallEvaluation = evaluateAudioEpisodeRecall(episode, reflectionText);

    const identity = await getCurrentIdentity();
    let persisted = false;
    if (identity) {
      recordAudioDsaProgress({
        userId: identity.id,
        episodeId: episode.id,
        episodeNumber: episode.episodeNumber,
        selectedIndex,
        reflectionText,
        passed,
      });
      persisted = true;
    }

    return NextResponse.json({
      ok: true,
      episodeId: episode.id,
      episodeNumber: episode.episodeNumber,
      passed,
      persisted,
      selectedIndex,
      correctIndex: episode.quiz.correctIndex,
      feedback: passed
        ? episode.quiz.correctFeedback
        : episode.quiz.wrongFeedback,
      technicalExplanation: episode.technicalExplanation,
      recallFeedback: recallEvaluation,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation failed." },
      { status: 500 },
    );
  }
}
