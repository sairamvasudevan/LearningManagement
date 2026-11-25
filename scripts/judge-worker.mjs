#!/usr/bin/env node
/**
 * Stateless Remote Code Execution & Judge Worker
 * Horizontally scalable worker daemon consumed by the Next.js API via JUDGE_WORKER_URLS.
 */
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT || 4001);
const HOST = process.env.JUDGE_WORKER_HOST || "127.0.0.1";
const WORKER_SECRET = process.env.JUDGE_WORKER_SECRET || "";
const MAX_CONCURRENCY = Math.max(
  1,
  Number(process.env.JUDGE_WORKER_CONCURRENCY || os.cpus().length || 4),
);
const MAX_LOCAL_QUEUE = Number(process.env.JUDGE_WORKER_MAX_QUEUE || 500);
const MAX_BODY_BYTES = 256 * 1024;
const MAX_OUTPUT_BYTES = 64 * 1024;

let cachedSdkFlags = null;
function getMacOsSdkFlag() {
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
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      cachedSdkFlags = ["-isysroot", candidate];
      return cachedSdkFlags;
    }
  }
  cachedSdkFlags = [];
  return cachedSdkFlags;
}

let cachedJavaBins = null;
function getJavaBinaries() {
  if (cachedJavaBins !== null) return cachedJavaBins;
  const home = os.homedir();
  const jdk17Javac = path.join(home, ".jdk17/Contents/Home/bin/javac");
  const jdk17Java = path.join(home, ".jdk17/Contents/Home/bin/java");
  if (fs.existsSync(jdk17Javac) && fs.existsSync(jdk17Java)) {
    cachedJavaBins = { javac: jdk17Javac, java: jdk17Java };
    return cachedJavaBins;
  }
  cachedJavaBins = { javac: "javac", java: "java" };
  return cachedJavaBins;
}

let cachedCompilers = null;
function getNativeCompilers() {
  if (cachedCompilers !== null) return cachedCompilers;
  const hasBin = (bin) =>
    spawnSync("which", [bin], { stdio: "ignore" }).status === 0;
  cachedCompilers = {
    c: hasBin("clang") ? "clang" : "gcc",
    cpp: hasBin("clang++") ? "clang++" : "g++",
  };
  return cachedCompilers;
}

function getSandboxedEnv(tmpDir) {
  return {
    PATH: process.env.PATH || "/usr/local/bin:/usr/bin:/bin",
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    HOME: tmpDir,
    TMPDIR: tmpDir,
  };
}

function normalizeOutput(text) {
  return String(text || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "");
}

function extractJavaClassName(code) {
  const pub = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]{0,63})/);
  if (pub) return pub[1];
  const any = code.match(/\bclass\s+([A-Za-z_][A-Za-z0-9_]{0,63})\b/);
  if (any) return any[1];
  return "Solution";
}

function spawnAsync(command, args, options) {
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

    child.stdout.on("data", (chunk) => {
      if (stdout.length < MAX_OUTPUT_BYTES) {
        stdout += chunk.toString("utf8").slice(0, MAX_OUTPUT_BYTES - stdout.length);
      }
    });

    child.stderr.on("data", (chunk) => {
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

async function prepareExecutable(language, code, tmpDir, sandboxEnv) {
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

async function handleRun(payload) {
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "jw-run-"));
  const sandboxEnv = getSandboxedEnv(tmpDir);
  try {
    const prep = await prepareExecutable(payload.language, payload.code, tmpDir, sandboxEnv);
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
      input: payload.stdin || "",
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

async function handleEvaluate(payload) {
  const testCases = Array.isArray(payload.testCases) ? payload.testCases : [];
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "jw-eval-"));
  const sandboxEnv = getSandboxedEnv(tmpDir);

  try {
    const prep = await prepareExecutable(payload.language, payload.code, tmpDir, sandboxEnv);
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
    const results = [];
    let overallStatus = "ACCEPTED";
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

      const isPassed = normalizeOutput(run.stdout) === normalizeOutput(tc.expectedOutput);
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

      if (!isPassed && payload.stopOnFirstFailure) {
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

let activeJobs = 0;
const waitQueue = [];

function pumpWorkerQueue() {
  while (activeJobs < MAX_CONCURRENCY && waitQueue.length > 0) {
    const task = waitQueue.shift();
    if (!task) break;
    activeJobs++;
    task
      .fn()
      .then(task.resolve, task.reject)
      .finally(() => {
        activeJobs--;
        queueMicrotask(pumpWorkerQueue);
      });
  }
}

function enqueueExecution(fn) {
  if (waitQueue.length >= MAX_LOCAL_QUEUE) {
    return Promise.reject(new Error("WORKER_OVERLOADED"));
  }
  return new Promise((resolve, reject) => {
    waitQueue.push({ fn, resolve, reject });
    queueMicrotask(pumpWorkerQueue);
  });
}

function isAuthorized(req) {
  if (!WORKER_SECRET) return true;
  const auth = req.headers.authorization || "";
  const expected = `Bearer ${WORKER_SECRET}`;
  const a = crypto.createHash("sha256").update(auth).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error("PAYLOAD_TOO_LARGE"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  if (req.method === "GET" && urlPath === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      activeJobs,
      queuedJobs: waitQueue.length,
      maxConcurrency: MAX_CONCURRENCY,
      supportedLanguages: ["c", "cpp", "java", "python"],
      platform: process.platform,
    });
  }

  if (req.method === "POST" && urlPath === "/execute") {
    if (!isAuthorized(req)) {
      return sendJson(res, 401, { error: "Unauthorized judge worker token" });
    }

    let payload;
    try {
      payload = await readJsonBody(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bad request";
      return sendJson(res, msg === "PAYLOAD_TOO_LARGE" ? 413 : 400, { error: msg });
    }

    if (
      !payload ||
      !["c", "cpp", "java", "python"].includes(payload.language) ||
      typeof payload.code !== "string"
    ) {
      return sendJson(res, 400, { error: "Invalid language or code payload" });
    }

    try {
      const result = await enqueueExecution(() =>
        payload.mode === "evaluate" ? handleEvaluate(payload) : handleRun(payload),
      );
      return sendJson(res, 200, result);
    } catch (err) {
      if (err instanceof Error && err.message === "WORKER_OVERLOADED") {
        return sendJson(res, 503, { error: "Worker backlog full" });
      }
      return sendJson(res, 500, {
        error: err instanceof Error ? err.message : "Worker execution failure",
      });
    }
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(
    `Nexus Judge Worker listening on http://${HOST}:${PORT} (concurrency=${MAX_CONCURRENCY})`,
  );
});
