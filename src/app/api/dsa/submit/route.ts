import { NextRequest, NextResponse } from "next/server";
import { evaluateTestCases, SupportedLanguage } from "@/lib/compiler";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { recordDsaSubmission } from "@/lib/db";
import { getCurrentIdentity } from "@/lib/auth";
import { getDsaMockComment } from "@/lib/dsa-mocking";
import { hasSameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const MAX_CODE_BYTES = 65_536;

export async function POST(req: NextRequest) {
  if (!hasSameOrigin(req)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { problemId, language, code } = body as {
      problemId: string;
      language: SupportedLanguage;
      code: string;
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

    const evaluation = await evaluateTestCases(language, code, allTestCases);

    const userId = identity?.id;

    let submissionId: string | null = null;
    if (userId) {
      try {
        const dbRecord = recordDsaSubmission({
          user_id: userId,
          problem_id: problemId,
          language,
          code,
          status: evaluation.status,
          test_cases_passed: evaluation.testCasesPassed,
          total_test_cases: evaluation.totalTestCases,
          execution_time_ms: evaluation.executionTimeMs,
        });
        submissionId = dbRecord.id;
      } catch (dbErr) {
        console.error("Failed to record DSA submission in database:", dbErr);
      }
    }

    const mockComment = getDsaMockComment({
      problemId,
      status: evaluation.status,
      code,
      language,
      testCasesPassed: evaluation.testCasesPassed,
      totalTestCases: evaluation.totalTestCases,
      results: evaluation.results,
      compileOutput: evaluation.compileOutput,
    });

    return NextResponse.json({
      submissionId,
      mockComment,
      ...evaluation,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Evaluation engine error" },
      { status: 500 },
    );
  }
}
