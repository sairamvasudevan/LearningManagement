import { NextRequest, NextResponse } from "next/server";
import { SupportedLanguage, TestCase } from "@/lib/compiler";
import { getCurrentIdentity } from "@/lib/auth";
import {
  checkSubmissionRateLimit,
  dispatchCompilerRun,
  resolveExecutionClientKey,
} from "@/lib/execution-queue";
import { hasSameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const MAX_CODE_BYTES = 65_536;
const MAX_STDIN_BYTES = 131_072;
const MAX_TEST_CASES = 20;

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { language, code, stdin, testCases, async: asyncMode } = body as {
      language: SupportedLanguage;
      code: string;
      stdin?: string;
      testCases?: TestCase[];
      async?: boolean;
    };

    if (!language || !code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Language and code are required." },
        { status: 400 },
      );
    }

    if (code.length > MAX_CODE_BYTES) {
      return NextResponse.json(
        { error: `Code exceeds maximum allowed size of ${MAX_CODE_BYTES} characters.` },
        { status: 413 },
      );
    }

    if (stdin && (typeof stdin !== "string" || stdin.length > MAX_STDIN_BYTES)) {
      return NextResponse.json(
        { error: `STDIN exceeds maximum allowed size of ${MAX_STDIN_BYTES} characters.` },
        { status: 413 },
      );
    }

    if (!["c", "cpp", "java", "python"].includes(language)) {
      return NextResponse.json(
        { error: "Unsupported language. Must be c, cpp, java, or python." },
        { status: 400 },
      );
    }

    if (testCases && Array.isArray(testCases) && testCases.length > MAX_TEST_CASES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_TEST_CASES} test cases allowed per run.` },
        { status: 400 },
      );
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
        { error: "Too many execution requests in a short burst. Please wait a second." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const dispatched = await dispatchCompilerRun({
      language,
      code,
      stdin,
      testCases: Array.isArray(testCases) && testCases.length > 0 ? testCases : undefined,
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
        { error: "Execution queue is temporarily at capacity. Please retry shortly." },
        { status: 503, headers: { "Retry-After": "3" } },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Execution engine failure" },
      { status: 500 },
    );
  }
}
