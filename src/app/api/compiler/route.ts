import { NextRequest, NextResponse } from "next/server";
import { executeCode, evaluateTestCases, SupportedLanguage, TestCase } from "@/lib/compiler";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, code, stdin, testCases } = body as {
      language: SupportedLanguage;
      code: string;
      stdin?: string;
      testCases?: TestCase[];
    };

    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required." },
        { status: 400 },
      );
    }

    if (!["c", "cpp", "java", "python"].includes(language)) {
      return NextResponse.json(
        { error: "Unsupported language. Must be c, cpp, java, or python." },
        { status: 400 },
      );
    }

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      const evaluation = await evaluateTestCases(language, code, testCases);
      return NextResponse.json(evaluation);
    }

    const result = await executeCode(language, code, stdin || "");
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Execution engine failure" },
      { status: 500 },
    );
  }
}
