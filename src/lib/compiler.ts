import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
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
  stoppedEarly?: boolean;
};

const MAX_OUTPUT_BYTES = 64 * 1024;

// Locate system SDK for macOS clang (cached across invocations)
let cachedSdkFlags: string[] | null = null;
function getMacOsSdkFlag(): string[] {
  if (cachedSdkFlags !== null) return cachedSdkFlags;
  if (process.platform !== "darwin") {
    cachedSdkFlags = [];
    return cachedSdkFlags;
  }
  const candidates = [
    "/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX15.sdk",
    "/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk",
  ];
  for (const p of candidates) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      cachedSdkFlags = ["-isysroot", p];
      return cachedSdkFlags;
    }
  }
  cachedSdkFlags = [];
  return cachedSdkFlags;
}

let cachedJavaBins: { javac: string; java: string } | null = null;
function getJavaBinaries(): { javac: string; java: string } {
  if (cachedJavaBins !== null) return cachedJavaBins;
  const home = os.homedir();
  const jdk17Javac = path.join(home, ".jdk17/Contents/Home/bin/javac");
  const jdk17Java = path.join(home, ".jdk17/Contents/Home/bin/java");

  if (
    fs.existsSync(/*turbopackIgnore: true*/ jdk17Javac) &&
    fs.existsSync(/*turbopackIgnore: true*/ jdk17Java)
  ) {
    cachedJavaBins = { javac: jdk17Javac, java: jdk17Java };
    return cachedJavaBins;
  }
  cachedJavaBins = { javac: "javac", java: "java" };
  return cachedJavaBins;
}

let cachedNativeCompilers: { c: string; cpp: string } | null = null;
function getNativeCompilers(): { c: string; cpp: string } {
  if (cachedNativeCompilers !== null) return cachedNativeCompilers;
  const hasBin = (bin: string) =>
    spawnSync("which", [bin], { stdio: "ignore" }).status === 0;
  cachedNativeCompilers = {
    c: hasBin("clang") ? "clang" : "gcc",
    cpp: hasBin("clang++") ? "clang++" : "g++",
  };
  return cachedNativeCompilers;
}

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

export function normalizeOutput(text: string): string {
  return text
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "");
}

interface SpawnAsyncResult {
  status: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
}

/** Non-blocking child execution so Node event loop serves thousands of concurrent sockets without stalling. */
function spawnAsync(
  command: string,
  args: string[],
  options: {
    cwd: string;
    env: NodeJS.ProcessEnv;
    input?: string;
    timeoutMs: number;
  },
): Promise<SpawnAsyncResult> {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;

    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const killTimer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill("SIGKILL");
      } catch {}
    }, options.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      if (stdout.length < MAX_OUTPUT_BYTES) {
        stdout += chunk.toString("utf8").slice(0, MAX_OUTPUT_BYTES - stdout.length);
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      if (stderr.length < MAX_OUTPUT_BYTES) {
        stderr += chunk.toString("utf8").slice(0, MAX_OUTPUT_BYTES - stderr.length);
      }
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      const durationMs = Number((process.hrtime.bigint() - startTime) / BigInt(1_000_000));
      resolve({
        status: 1,
        stdout,
        stderr: stderr || err.message,
        timedOut,
        durationMs,
      });
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      const durationMs = Number((process.hrtime.bigint() - startTime) / BigInt(1_000_000));
      resolve({
        status: code,
        stdout,
        stderr,
        timedOut,
        durationMs,
      });
    });

    if (options.input !== undefined && options.input.length > 0) {
      child.stdin.write(options.input, () => {
        child.stdin.end();
      });
    } else {
      child.stdin.end();
    }
  });
}

// Remote distributed judge worker mesh with circuit-breaker failover
const workerUnhealthyUntil = new Map<string, number>();
let rrCounter = 0;

export function getConfiguredRemoteWorkers(): string[] {
  return (process.env.JUDGE_WORKER_URLS || "")
    .split(",")
    .map((u) => u.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

async function tryRemoteDispatch<T>(payload: Record<string, unknown>): Promise<T | null> {
  const workers = getConfiguredRemoteWorkers();
  if (workers.length === 0) return null;

  const now = Date.now();
  const healthy = workers.filter((w) => (workerUnhealthyUntil.get(w) || 0) <= now);
  const candidates = healthy.length > 0 ? healthy : workers;

  for (let attempt = 0; attempt < Math.min(2, candidates.length); attempt++) {
    const workerUrl = candidates[(rrCounter++ + attempt) % candidates.length];
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.JUDGE_WORKER_SECRET) {
        headers.Authorization = `Bearer ${process.env.JUDGE_WORKER_SECRET}`;
      }
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 14_000);
      const res = await fetch(`${workerUrl}/execute`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(t);
      if (res.ok) {
        return (await res.json()) as T;
      }
      workerUnhealthyUntil.set(workerUrl, Date.now() + 15_000);
    } catch {
      workerUnhealthyUntil.set(workerUrl, Date.now() + 15_000);
    }
  }
  return null;
}

async function prepareExecutable(
  language: SupportedLanguage,
  code: string,
  tmpDir: string,
  sandboxEnv: NodeJS.ProcessEnv,
): Promise<
  | { ok: true; runCommand: string; runArgs: string[] }
  | { ok: false; compileOutput: string }
> {
  const sdkFlags = getMacOsSdkFlag();
  const { javac, java } = getJavaBinaries();
  const compilers = getNativeCompilers();

  if (language === "c") {
    const srcPath = path.join(tmpDir, "main.c");
    const binPath = path.join(tmpDir, "main");
    await fsp.writeFile(srcPath, code, "utf8");
    const compile = await spawnAsync(compilers.c, ["-O2", ...sdkFlags, srcPath, "-o", binPath], {
      cwd: tmpDir,
      env: sandboxEnv,
      timeoutMs: 6000,
    });
    if (compile.status !== 0) {
      return { ok: false, compileOutput: compile.stderr || "C compilation failed." };
    }
    return { ok: true, runCommand: binPath, runArgs: [] };
  }

  if (language === "cpp") {
    const srcPath = path.join(tmpDir, "main.cpp");
    const binPath = path.join(tmpDir, "main");
    await fsp.writeFile(srcPath, code, "utf8");
    const compile = await spawnAsync(
      compilers.cpp,
      ["-std=c++17", "-O2", ...sdkFlags, srcPath, "-o", binPath],
      { cwd: tmpDir, env: sandboxEnv, timeoutMs: 6000 },
    );
    if (compile.status !== 0) {
      return { ok: false, compileOutput: compile.stderr || "C++ compilation failed." };
    }
    return { ok: true, runCommand: binPath, runArgs: [] };
  }

  if (language === "java") {
    const className = extractJavaClassName(code);
    const srcPath = path.join(tmpDir, `${className}.java`);
    await fsp.writeFile(srcPath, code, "utf8");
    const compile = await spawnAsync(javac, [srcPath], {
      cwd: tmpDir,
      env: sandboxEnv,
      timeoutMs: 6000,
    });
    if (compile.status !== 0) {
      return { ok: false, compileOutput: compile.stderr || "Java compilation failed." };
    }
    return { ok: true, runCommand: java, runArgs: ["-Xmx256m", "-cp", tmpDir, className] };
  }

  const srcPath = path.join(tmpDir, "solution.py");
  await fsp.writeFile(srcPath, code, "utf8");
  return { ok: true, runCommand: "python3", runArgs: [srcPath] };
}

/**
 * Executes a snippet of code asynchronously inside an isolated temp directory or remote judge pool.
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin: string = "",
): Promise<ExecutionResult> {
  const remoteResult = await tryRemoteDispatch<ExecutionResult>({
    mode: "run",
    language,
    code,
    stdin,
  });
  if (remoteResult) return remoteResult;

  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "psl-run-"));
  const sandboxEnv = getSandboxedEnv(tmpDir);

  try {
    const prep = await prepareExecutable(language, code, tmpDir, sandboxEnv);
    if (!prep.ok) {
      return {
        status: "COMPILE_ERROR",
        stdout: "",
        stderr: prep.compileOutput,
        compileOutput: prep.compileOutput,
        executionTimeMs: 0,
      };
    }

    const run = await spawnAsync(prep.runCommand, prep.runArgs, {
      cwd: tmpDir,
      env: sandboxEnv,
      input: stdin,
      timeoutMs: 3500,
    });

    if (run.timedOut) {
      return {
        status: "TIME_LIMIT_EXCEEDED",
        stdout: run.stdout,
        stderr: "Time Limit Exceeded (> 3500ms).",
        compileOutput: "",
        executionTimeMs: run.durationMs,
      };
    }

    if (run.status !== 0) {
      return {
        status: "RUNTIME_ERROR",
        stdout: run.stdout,
        stderr: run.stderr || `Runtime error with exit code ${run.status}.`,
        compileOutput: "",
        executionTimeMs: run.durationMs,
      };
    }

    return {
      status: "SUCCESS",
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: "",
      executionTimeMs: run.durationMs,
    };
  } finally {
    await fsp.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Runs code asynchronously across multiple test cases, supporting optional burst fail-fast
 * and remote worker pool delegation.
 */
export async function evaluateTestCases(
  language: SupportedLanguage,
  code: string,
  testCases: TestCase[],
  options?: { stopOnFirstFailure?: boolean },
): Promise<SubmissionEvaluationResult> {
  const remoteResult = await tryRemoteDispatch<SubmissionEvaluationResult>({
    mode: "evaluate",
    language,
    code,
    testCases,
    stopOnFirstFailure: Boolean(options?.stopOnFirstFailure),
  });
  if (remoteResult) return remoteResult;

  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "psl-eval-"));
  const sandboxEnv = getSandboxedEnv(tmpDir);

  try {
    const prep = await prepareExecutable(language, code, tmpDir, sandboxEnv);
    if (!prep.ok) {
      return {
        status: "COMPILE_ERROR",
        testCasesPassed: 0,
        totalTestCases: testCases.length,
        executionTimeMs: 0,
        compileOutput: prep.compileOutput,
        results: [],
      };
    }

    let totalTime = 0;
    let passedCount = 0;
    const results: TestCaseResult[] = [];
    let overallStatus: SubmissionEvaluationResult["status"] = "ACCEPTED";
    let stoppedEarly = false;

    for (const tc of testCases) {
      const run = await spawnAsync(prep.runCommand, prep.runArgs, {
        cwd: tmpDir,
        env: sandboxEnv,
        input: tc.input,
        timeoutMs: 3000,
      });
      totalTime += run.durationMs;

      if (run.timedOut) {
        results.push({
          id: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: "Time Limit Exceeded (> 3000ms)",
          timeMs: run.durationMs,
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
          actual: run.stdout,
          timeMs: run.durationMs,
          error: run.stderr || `Process exited with code ${run.status}`,
        });
        overallStatus = "RUNTIME_ERROR";
        break;
      }

      const normActual = normalizeOutput(run.stdout);
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
        actual: run.stdout,
        timeMs: run.durationMs,
      });

      if (!isPassed && options?.stopOnFirstFailure) {
        stoppedEarly = true;
        break;
      }
    }

    return {
      status: overallStatus,
      testCasesPassed: passedCount,
      totalTestCases: testCases.length,
      executionTimeMs: totalTime,
      compileOutput: "",
      results,
      stoppedEarly,
    };
  } finally {
    await fsp.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
