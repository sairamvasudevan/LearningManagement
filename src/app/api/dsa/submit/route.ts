import { NextRequest, NextResponse } from "next/server";
import { SupportedLanguage } from "@/lib/compiler";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { getCurrentIdentity } from "@/lib/auth";
import {
  checkSubmissionRateLimit,
  dispatchDsaSubmission,
  resolveExecutionClientKey,
} from "@/lib/execution-queue";
import { hasSameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const MAX_CODE_BYTES = 65_536;

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { problemId, language, code, async: asyncMode } = body as {
      problemId: string;
      language: SupportedLanguage;
      code: string;
      async?: boolean;
    };

    if (!problemId || !language || !code || typeof code !== "string") {
      return NextResponse.json(
        { error: "problemId, language, and code are required." },
        { status: 400 },
      );
    }

    if (!["c", "cpp", "java", "python"].includes(language)) {
      return NextResponse.json(
        { error: "Unsupported language. Must be c, cpp, java, or python." },
        { status: 400 },
      );
    }

    if (code.length > MAX_CODE_BYTES) {
      return NextResponse.json(
        { error: `Submission code exceeds maximum size (${MAX_CODE_BYTES} bytes).` },
        { status: 413 },
      );
    }

    const problem = DSA_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found." }, { status: 404 });
    }

    const identity = await getCurrentIdentity();
    const clientKey = resolveExecutionClientKey(
      req.headers,
      identity?.id ?? null,
      req.cookies.get("psl_session")?.value ?? null,
    );
    const rate = checkSubmissionRateLimit(clientKey);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many submissions in a short burst. Please wait a second." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    // Combine sample and hidden test cases for final grading
    const allTestCases = [
      ...problem.sampleTestCases.map((tc, idx) => ({
        id: `Sample ${idx + 1}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
      ...problem.hiddenTestCases.map((tc, idx) => ({
        id: `Testcase ${idx + 1}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
    ];

    const dispatched = await dispatchDsaSubmission({
      problemId,
      language,
      code,
      allTestCases,
      userId: identity?.id ?? null,
      asyncMode: Boolean(asyncMode),
    });

    if (dispatched.kind === "queued") {
      return NextResponse.json(
        {
          queued: true,
          status: "QUEUED",
          jobId: dispatched.jobId,
          queuePosition: dispatched.queuePosition,
          queueDepth: dispatched.queueDepth,
          estimatedWaitMs: dispatched.estimatedWaitMs,
        },
        { status: 202 },
      );
    }

    return NextResponse.json(dispatched.output);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "QUEUE_OVERLOADED") {
      return NextResponse.json(
        { error: "Judge queue is temporarily at capacity. Please retry shortly." },
        { status: 503, headers: { "Retry-After": "3" } },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation engine error" },
      { status: 500 },
    );
  }
}
