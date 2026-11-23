import { NextRequest, NextResponse } from "next/server";
import { evaluateTestCases, SupportedLanguage } from "@/lib/compiler";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { recordDsaSubmission } from "@/lib/db";
import { getCurrentIdentity } from "@/lib/auth";
import { getDsaMockComment } from "@/lib/dsa-mocking";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemId, language, code } = body as {
      problemId: string;
      language: SupportedLanguage;
      code: string;
    };

    if (!problemId || !language || !code) {
      return NextResponse.json(
        { error: "problemId, language, and code are required." },
        { status: 400 },
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

    // Get current user if signed in
    const userId = identity?.id;

    // Record submission in SQLite database if user is authenticated
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Evaluation engine error" },
      { status: 500 },
    );
  }
}
