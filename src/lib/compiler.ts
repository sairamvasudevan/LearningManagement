import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export type SupportedLanguage = "c" | "cpp" | "java" | "python";

export type TestCase = {
  id: string | number;
  input: string;
  expectedOutput: string;
  explanation?: string;
};

export type ExecutionResult = {
  status: "SUCCESS" | "COMPILE_ERROR" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR";
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTimeMs: number;
};

export type TestCaseResult = {
  id: string | number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  timeMs: number;
  error?: string;
};

export type SubmissionEvaluationResult = {
  status: "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR";
  testCasesPassed: number;
  totalTestCases: number;
  executionTimeMs: number;
  compileOutput: string;
  results: TestCaseResult[];
};

// Locate system SDK for macOS clang
function getMacOsSdkFlag(): string[] {
  if (process.platform !== "darwin") return [];
  const candidates = [
    "/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX15.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return ["-isysroot", p];
    }
  }
  return [];
}

// Locate javac and java binaries
function getJavaBinaries(): { javac: string; java: string } {
  const home = os.homedir();
  const jdk17Javac = path.join(home, ".jdk17/Contents/Home/bin/javac");
  const jdk17Java = path.join(home, ".jdk17/Contents/Home/bin/java");

  if (fs.existsSync(jdk17Javac) && fs.existsSync(jdk17Java)) {
    return { javac: jdk17Javac, java: jdk17Java };
  }
  return { javac: "javac", java: "java" };
}

// Build a stripped execution environment inside the temporary sandbox directory
function getSandboxedEnv(tmpDir: string): NodeJS.ProcessEnv {
  return {
    NODE_ENV: process.env.NODE_ENV || "production",
    PATH: process.env.PATH || "/usr/local/bin:/usr/bin:/bin",
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    HOME: tmpDir,
    TMPDIR: tmpDir,
  };
}

function extractJavaClassName(code: string): string {
  const pubMatch = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]{0,63})/);
  if (pubMatch) return pubMatch[1];
  const anyMatch = code.match(/\bclass\s+([A-Za-z_][A-Za-z0-9_]{0,63})\b/);
  if (anyMatch) return anyMatch[1];
  return "Solution";
}

// Normalize output text for whitespace-invariant comparison
export function normalizeOutput(text: string): string {
  return text
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "");
}

/**
 * Executes a snippet of code with provided stdin inside an isolated temp directory.
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin: string = "",
): Promise<ExecutionResult> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "psl-run-"));
  const sdkFlags = getMacOsSdkFlag();
  const { javac, java } = getJavaBinaries();
  const sandboxEnv = getSandboxedEnv(tmpDir);

  try {
    let executablePath = "";
    let runCommand = "";
    let runArgs: string[] = [];
    const compileOutput = "";

    // Compilation / preparation phase
    if (language === "c") {
      const srcPath = path.join(tmpDir, "main.c");
      executablePath = path.join(tmpDir, "main");
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync("clang", ["-O2", ...sdkFlags, srcPath, "-o", executablePath], {
        cwd: tmpDir,
        env: sandboxEnv,
        timeout: 6000,
        encoding: "utf8",
        maxBuffer: 1024 * 64,
      });

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          stdout: "",
          stderr: compile.stderr || "Compilation failed.",
          compileOutput: compile.stderr || "",
          executionTimeMs: 0,
        };
      }
      runCommand = executablePath;
      runArgs = [];
    } else if (language === "cpp") {
      const srcPath = path.join(tmpDir, "main.cpp");
      executablePath = path.join(tmpDir, "main");
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync(
        "clang++",
        ["-std=c++17", "-O2", ...sdkFlags, srcPath, "-o", executablePath],
        {
          cwd: tmpDir,
          env: sandboxEnv,
          timeout: 6000,
          encoding: "utf8",
          maxBuffer: 1024 * 64,
        },
      );

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          stdout: "",
          stderr: compile.stderr || "C++ compilation failed.",
          compileOutput: compile.stderr || "",
          executionTimeMs: 0,
        };
      }
      runCommand = executablePath;
      runArgs = [];
    } else if (language === "java") {
      const className = extractJavaClassName(code);
      const srcPath = path.join(tmpDir, `${className}.java`);
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync(javac, [srcPath], {
        cwd: tmpDir,
        env: sandboxEnv,
        timeout: 6000,
        encoding: "utf8",
        maxBuffer: 1024 * 64,
      });

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          stdout: "",
          stderr: compile.stderr || "Java compilation failed.",
          compileOutput: compile.stderr || "",
          executionTimeMs: 0,
        };
      }
      runCommand = java;
      runArgs = ["-Xmx256m", "-cp", tmpDir, className];
    } else if (language === "python") {
      const srcPath = path.join(tmpDir, "solution.py");
      fs.writeFileSync(srcPath, code, "utf8");
      runCommand = "python3";
      runArgs = [srcPath];
    }

    // Execution phase
    const startTime = process.hrtime.bigint();
    const run = spawnSync(runCommand, runArgs, {
      cwd: tmpDir,
      env: sandboxEnv,
      input: stdin,
      timeout: 3500, // 3.5 seconds execution limit
      encoding: "utf8",
      maxBuffer: 1024 * 64,
    });
    const endTime = process.hrtime.bigint();
    const durationMs = Number((endTime - startTime) / BigInt(1000000));

    if (run.error && (run.error as NodeJS.ErrnoException).code === "ETIMEDOUT") {
      return {
        status: "TIME_LIMIT_EXCEEDED",
        stdout: run.stdout || "",
        stderr: "Time Limit Exceeded (> 3500ms).",
        compileOutput: "",
        executionTimeMs: durationMs,
      };
    }

    if (run.status !== 0) {
      return {
        status: "RUNTIME_ERROR",
        stdout: run.stdout || "",
        stderr: run.stderr || `Runtime error with exit code ${run.status}.`,
        compileOutput: "",
        executionTimeMs: durationMs,
      };
    }

    return {
      status: "SUCCESS",
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compileOutput,
      executionTimeMs: durationMs,
    };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}

/**
 * Runs code against multiple test cases and evaluates acceptance inside an isolated temp directory.
 */
export async function evaluateTestCases(
  language: SupportedLanguage,
  code: string,
  testCases: TestCase[],
): Promise<SubmissionEvaluationResult> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "psl-eval-"));
  const sdkFlags = getMacOsSdkFlag();
  const { javac, java } = getJavaBinaries();
  const sandboxEnv = getSandboxedEnv(tmpDir);

  try {
    let runCommand = "";
    let runArgs: string[] = [];

    // Compile once for all test cases
    if (language === "c") {
      const srcPath = path.join(tmpDir, "main.c");
      const binPath = path.join(tmpDir, "main");
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync("clang", ["-O2", ...sdkFlags, srcPath, "-o", binPath], {
        cwd: tmpDir,
        env: sandboxEnv,
        timeout: 6000,
        encoding: "utf8",
        maxBuffer: 1024 * 64,
      });

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          testCasesPassed: 0,
          totalTestCases: testCases.length,
          executionTimeMs: 0,
          compileOutput: compile.stderr || "Compilation failed.",
          results: [],
        };
      }
      runCommand = binPath;
      runArgs = [];
    } else if (language === "cpp") {
      const srcPath = path.join(tmpDir, "main.cpp");
      const binPath = path.join(tmpDir, "main");
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync(
        "clang++",
        ["-std=c++17", "-O2", ...sdkFlags, srcPath, "-o", binPath],
        {
          cwd: tmpDir,
          env: sandboxEnv,
          timeout: 6000,
          encoding: "utf8",
          maxBuffer: 1024 * 64,
        },
      );

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          testCasesPassed: 0,
          totalTestCases: testCases.length,
          executionTimeMs: 0,
          compileOutput: compile.stderr || "C++ compilation failed.",
          results: [],
        };
      }
      runCommand = binPath;
      runArgs = [];
    } else if (language === "java") {
      const className = extractJavaClassName(code);
      const srcPath = path.join(tmpDir, `${className}.java`);
      fs.writeFileSync(srcPath, code, "utf8");

      const compile = spawnSync(javac, [srcPath], {
        cwd: tmpDir,
        env: sandboxEnv,
        timeout: 6000,
        encoding: "utf8",
        maxBuffer: 1024 * 64,
      });

      if (compile.status !== 0) {
        return {
          status: "COMPILE_ERROR",
          testCasesPassed: 0,
          totalTestCases: testCases.length,
          executionTimeMs: 0,
          compileOutput: compile.stderr || "Java compilation failed.",
          results: [],
        };
      }
      runCommand = java;
      runArgs = ["-Xmx256m", "-cp", tmpDir, className];
    } else if (language === "python") {
      const srcPath = path.join(tmpDir, "solution.py");
      fs.writeFileSync(srcPath, code, "utf8");
      runCommand = "python3";
      runArgs = [srcPath];
    }

    // Execute across each testcase
    let totalTime = 0;
    let passedCount = 0;
    const results: TestCaseResult[] = [];
    let overallStatus: SubmissionEvaluationResult["status"] = "ACCEPTED";

    for (const tc of testCases) {
      const tcStart = process.hrtime.bigint();
      const run = spawnSync(runCommand, runArgs, {
        cwd: tmpDir,
        env: sandboxEnv,
        input: tc.input,
        timeout: 3000,
        encoding: "utf8",
        maxBuffer: 1024 * 64,
      });
      const tcEnd = process.hrtime.bigint();
      const tcDurationMs = Number((tcEnd - tcStart) / BigInt(1000000));
      totalTime += tcDurationMs;

      if (run.error && (run.error as NodeJS.ErrnoException).code === "ETIMEDOUT") {
        results.push({
          id: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: "Time Limit Exceeded (> 3000ms)",
          timeMs: tcDurationMs,
          error: "Time Limit Exceeded",
        });
        overallStatus = "TIME_LIMIT_EXCEEDED";
        break;
      }

      if (run.status !== 0) {
        results.push({
          id: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: run.stdout || "",
          timeMs: tcDurationMs,
          error: run.stderr || `Process exited with code ${run.status}`,
        });
        overallStatus = "RUNTIME_ERROR";
        break;
      }

      const normActual = normalizeOutput(run.stdout || "");
      const normExpected = normalizeOutput(tc.expectedOutput);
      const isPassed = normActual === normExpected;

      if (isPassed) {
        passedCount++;
      } else if (overallStatus === "ACCEPTED") {
        overallStatus = "WRONG_ANSWER";
      }

      results.push({
        id: tc.id,
        passed: isPassed,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: run.stdout || "",
        timeMs: tcDurationMs,
      });
    }

    return {
      status: overallStatus,
      testCasesPassed: passedCount,
      totalTestCases: testCases.length,
      executionTimeMs: totalTime,
      compileOutput: "",
      results,
    };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}
