import { NextRequest, NextResponse } from "next/server";
import { executeCode, evaluateTestCases, SupportedLanguage, TestCase } from "@/lib/compiler";
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
    const { language, code, stdin, testCases } = body as {
      language: SupportedLanguage;
      code: string;
      stdin?: string;
      testCases?: TestCase[];
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

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      if (testCases.length > MAX_TEST_CASES) {
        return NextResponse.json(
          { error: `Maximum ${MAX_TEST_CASES} test cases allowed per run.` },
          { status: 400 },
        );
      }
      const evaluation = await evaluateTestCases(language, code, testCases);
      return NextResponse.json(evaluation);
    }

    const result = await executeCode(language, code, stdin || "");
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Execution engine failure" },
      { status: 500 },
    );
  }
}
