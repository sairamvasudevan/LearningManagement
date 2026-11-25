import crypto from "node:crypto";
import os from "node:os";
import {
  evaluateTestCases,
  executeCode,
  getConfiguredRemoteWorkers,
  type ExecutionResult,
  type SubmissionEvaluationResult,
  type SupportedLanguage,
  type TestCase,
} from "@/lib/compiler";
import {
  getCachedExecutionResult,
  recordDsaSubmission,
  storeCachedExecutionResult,
} from "@/lib/db";
import { getDsaMockComment, type DsaMockFeedback } from "@/lib/dsa-mocking";

export type JobStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";

export type DsaJobOutput = SubmissionEvaluationResult & {
  submissionId: string | null;
  mockComment: DsaMockFeedback | null;
  cached?: boolean;
};

export type CompilerJobOutput = (ExecutionResult | SubmissionEvaluationResult) & {
  cached?: boolean;
};

export interface ExecutionJobRecord {
  id: string;
  kind: "dsa_submit" | "compiler_run" | "compiler_eval";
  priority: 1 | 2;
  ownerId: string | null;
  status: JobStatus;
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
  queuePositionAtEnqueue: number;
  result: DsaJobOutput | CompilerJobOutput | null;
  error: string | null;
}

interface InternalQueueTask {
  job: ExecutionJobRecord;
  run: () => Promise<DsaJobOutput | CompilerJobOutput>;
  waiters: Array<{
    resolve: (res: DsaJobOutput | CompilerJobOutput) => void;
    reject: (err: Error) => void;
  }>;
}

interface BucketState {
  tokens: number;
  lastRefill: number;
}

interface QueueSingletonState {
  jobs: Map<string, ExecutionJobRecord>;
  taskMap: Map<string, InternalQueueTask>;
  fastLane: InternalQueueTask[];
  judgeLane: InternalQueueTask[];
  memoryCache: Map<string, { json: string; expiresAt: number }>;
  rateBuckets: Map<string, BucketState>;
  activeWorkers: number;
  cacheHits: number;
  cacheMisses: number;
  totalCompleted: number;
  totalFailed: number;
  totalDurationMs: number;
}

const MAX_MEMORY_CACHE = 4_000;
const MEMORY_CACHE_TTL_MS = 1000 * 60 * 30;
const MAX_STORED_JOBS = 15_000;
const JOB_TTL_MS = 1000 * 60 * 15;
const MAX_QUEUE_DEPTH = Number(process.env.MAX_QUEUE_DEPTH || 50_000);

function getMaxWorkers(): number {
  const remoteWorkers = getConfiguredRemoteWorkers();
  if (remoteWorkers.length > 0) {
    // When remote worker pods exist, Node dispatches high-fanout HTTP requests without local CPU saturation
    const perWorker = Number(process.env.JUDGE_CONCURRENCY_PER_WORKER || 16);
    return Math.min(512, remoteWorkers.length * Math.max(4, perWorker));
  }
  const envLimit = Number(process.env.JUDGE_CONCURRENCY || 0);
  if (envLimit > 0) return Math.min(64, envLimit);
  return Math.max(4, Math.min(16, os.cpus().length * 2));
}

const g = globalThis as unknown as { __nexusExecutionQueue?: QueueSingletonState };

function getState(): QueueSingletonState {
  if (!g.__nexusExecutionQueue) {
    g.__nexusExecutionQueue = {
      jobs: new Map(),
      taskMap: new Map(),
      fastLane: [],
      judgeLane: [],
      memoryCache: new Map(),
      rateBuckets: new Map(),
      activeWorkers: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalCompleted: 0,
      totalFailed: 0,
      totalDurationMs: 0,
    };
  }
  return g.__nexusExecutionQueue;
}

export function buildExecutionCacheKey(parts: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(parts))
    .digest("hex");
}

function readFromCache<T>(cacheKey: string): T | null {
  const st = getState();
  const now = Date.now();
  const l1 = st.memoryCache.get(cacheKey);
  if (l1 && l1.expiresAt > now) {
    st.cacheHits++;
    return JSON.parse(l1.json) as T;
  }
  if (l1) st.memoryCache.delete(cacheKey);

  const l2Json = getCachedExecutionResult(cacheKey);
  if (l2Json) {
    st.cacheHits++;
    writeL1Cache(cacheKey, l2Json);
    return JSON.parse(l2Json) as T;
  }

  st.cacheMisses++;
  return null;
}

function writeL1Cache(cacheKey: string, json: string) {
  const st = getState();
  if (st.memoryCache.size >= MAX_MEMORY_CACHE) {
    const firstKey = st.memoryCache.keys().next().value;
    if (firstKey) st.memoryCache.delete(firstKey);
  }
  st.memoryCache.set(cacheKey, { json, expiresAt: Date.now() + MEMORY_CACHE_TTL_MS });
}

function writeCache(cacheKey: string, payload: unknown) {
  const json = JSON.stringify(payload);
  writeL1Cache(cacheKey, json);
  storeCachedExecutionResult(cacheKey, json);
}

/** Derive stable per-user or per-client rate-limit bucket key so concurrent users do not collide. */
export function resolveExecutionClientKey(
  headers: { get(name: string): string | null },
  userId: string | null,
  sessionToken?: string | null,
): string {
  if (userId) return `user:${userId}`;
  if (sessionToken) return `sess:${sessionToken.slice(0, 16)}`;
  const forwarded = headers.get("x-forwarded-for");
  const clientIp = forwarded
    ? forwarded.split(",")[0]?.trim()
    : headers.get("x-real-ip")?.trim();
  return `ip:${clientIp || "local-anon"}`;
}

/** Per-user/IP token-bucket rate limiter protecting burst stability without throttling distinct learners. */
export function checkSubmissionRateLimit(clientKey: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const st = getState();
  const capacity = 25;
  const refillPerSec = 2;
  const now = Date.now();

  let bucket = st.rateBuckets.get(clientKey);
  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now };
    if (st.rateBuckets.size > 25_000) {
      const oldest = st.rateBuckets.keys().next().value;
      if (oldest) st.rateBuckets.delete(oldest);
    }
    st.rateBuckets.set(clientKey, bucket);
  } else {
    const elapsedSec = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillPerSec);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return { allowed: false, retryAfterSeconds: 1 };
}

function pruneOldJobs() {
  const st = getState();
  if (st.jobs.size < MAX_STORED_JOBS) return;
  const cutoff = Date.now() - JOB_TTL_MS;
  for (const [id, job] of st.jobs) {
    if (
      (job.status === "COMPLETED" || job.status === "FAILED") &&
      (job.completedAt || job.createdAt) < cutoff
    ) {
      st.jobs.delete(id);
      st.taskMap.delete(id);
    }
    if (st.jobs.size <= MAX_STORED_JOBS * 0.8) break;
  }
}

function pumpQueue() {
  const st = getState();
  const maxWorkers = getMaxWorkers();

  while (st.activeWorkers < maxWorkers) {
    const nextTask = st.fastLane.shift() || st.judgeLane.shift();
    if (!nextTask) break;

    st.activeWorkers++;
    nextTask.job.status = "RUNNING";
    nextTask.job.startedAt = Date.now();

    void nextTask
      .run()
      .then((output) => {
        nextTask.job.status = "COMPLETED";
        nextTask.job.completedAt = Date.now();
        nextTask.job.result = output;
        st.totalCompleted++;
        st.totalDurationMs += (nextTask.job.completedAt - (nextTask.job.startedAt || nextTask.job.createdAt));
        for (const w of nextTask.waiters) w.resolve(output);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Worker execution failed";
        nextTask.job.status = "FAILED";
        nextTask.job.completedAt = Date.now();
        nextTask.job.error = msg;
        st.totalFailed++;
        for (const w of nextTask.waiters) w.reject(new Error(msg));
      })
      .finally(() => {
        st.activeWorkers--;
        nextTask.waiters = [];
        st.taskMap.delete(nextTask.job.id);
        queueMicrotask(pumpQueue);
      });
  }
}

function enqueueTask<T extends DsaJobOutput | CompilerJobOutput>(params: {
  kind: ExecutionJobRecord["kind"];
  priority: 1 | 2;
  ownerId: string | null;
  run: () => Promise<T>;
}): { job: ExecutionJobRecord; promise: Promise<T> } {
  const st = getState();
  const totalQueued = st.fastLane.length + st.judgeLane.length;
  if (totalQueued >= MAX_QUEUE_DEPTH) {
    throw new Error("QUEUE_OVERLOADED");
  }

  pruneOldJobs();

  const job: ExecutionJobRecord = {
    id: crypto.randomUUID(),
    kind: params.kind,
    priority: params.priority,
    ownerId: params.ownerId,
    status: "QUEUED",
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    queuePositionAtEnqueue: totalQueued + 1,
    result: null,
    error: null,
  };

  let resolveOuter!: (v: T) => void;
  let rejectOuter!: (e: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolveOuter = res;
    rejectOuter = rej;
  });

  const task: InternalQueueTask = {
    job,
    run: params.run,
    waiters: [
      {
        resolve: (v) => resolveOuter(v as T),
        reject: rejectOuter,
      },
    ],
  };

  st.jobs.set(job.id, job);
  st.taskMap.set(job.id, task);
  if (params.priority === 1) st.fastLane.push(task);
  else st.judgeLane.push(task);

  queueMicrotask(pumpQueue);
  return { job, promise };
}

export function getExecutionJobForOwner(
  jobId: string,
  requesterUserId: string | null,
  isAdmin: boolean,
): { status: "not_found" | "forbidden" | "ok"; job?: ExecutionJobRecord } {
  const st = getState();
  const job = st.jobs.get(jobId);
  if (!job) return { status: "not_found" };
  if (job.ownerId && !isAdmin && job.ownerId !== requesterUserId) {
    return { status: "forbidden" };
  }
  return { status: "ok", job };
}

export function getExecutionEngineStats() {
  const st = getState();
  const queueDepth = st.fastLane.length + st.judgeLane.length;
  const totalCacheLookups = st.cacheHits + st.cacheMisses;
  return {
    activeWorkers: st.activeWorkers,
    maxWorkers: getMaxWorkers(),
    remoteWorkersConfigured: getConfiguredRemoteWorkers().length,
    queueDepth,
    fastLaneDepth: st.fastLane.length,
    judgeLaneDepth: st.judgeLane.length,
    maxQueueDepth: MAX_QUEUE_DEPTH,
    cacheHits: st.cacheHits,
    cacheMisses: st.cacheMisses,
    cacheHitRatePct:
      totalCacheLookups > 0 ? Math.round((st.cacheHits / totalCacheLookups) * 100) : 0,
    memoryCacheEntries: st.memoryCache.size,
    totalCompleted: st.totalCompleted,
    totalFailed: st.totalFailed,
    avgExecutionMs:
      st.totalCompleted > 0 ? Math.round(st.totalDurationMs / st.totalCompleted) : 0,
  };
}

export async function dispatchDsaSubmission(params: {
  problemId: string;
  language: SupportedLanguage;
  code: string;
  allTestCases: TestCase[];
  userId: string | null;
  asyncMode: boolean;
}): Promise<
  | { kind: "immediate"; output: DsaJobOutput }
  | { kind: "queued"; jobId: string; queuePosition: number; queueDepth: number; estimatedWaitMs: number }
> {
  const normalizedCode = params.code.replace(/\r\n/g, "\n").trim();
  const cacheKey = buildExecutionCacheKey([
    "dsa_v2",
    params.problemId,
    params.language,
    normalizedCode,
    params.allTestCases.length,
  ]);

  const cachedEval = readFromCache<SubmissionEvaluationResult>(cacheKey);
  if (cachedEval) {
    let submissionId: string | null = null;
    if (params.userId) {
      try {
        submissionId = recordDsaSubmission({
          user_id: params.userId,
          problem_id: params.problemId,
          language: params.language,
          code: params.code,
          status: cachedEval.status,
          test_cases_passed: cachedEval.testCasesPassed,
          total_test_cases: cachedEval.totalTestCases,
          execution_time_ms: cachedEval.executionTimeMs,
        }).id;
      } catch {}
    }
    const mockComment = getDsaMockComment({
      problemId: params.problemId,
      status: cachedEval.status,
      code: params.code,
      language: params.language,
      testCasesPassed: cachedEval.testCasesPassed,
      totalTestCases: cachedEval.totalTestCases,
      results: cachedEval.results,
      compileOutput: cachedEval.compileOutput,
    });
    return {
      kind: "immediate",
      output: { ...cachedEval, submissionId, mockComment, cached: true },
    };
  }

  const st = getState();
  const { job, promise } = enqueueTask<DsaJobOutput>({
    kind: "dsa_submit",
    priority: 2,
    ownerId: params.userId,
    run: async () => {
      // Under burst queue depth >= 25, engage adaptive fail-fast after first failed hidden case to protect throughput
      const burstFailFast = getState().judgeLane.length >= 25;
      const evaluation = await evaluateTestCases(
        params.language,
        params.code,
        params.allTestCases,
        { stopOnFirstFailure: burstFailFast },
      );

      if (!evaluation.stoppedEarly && evaluation.status !== "TIME_LIMIT_EXCEEDED") {
        writeCache(cacheKey, evaluation);
      }

      let submissionId: string | null = null;
      if (params.userId) {
        try {
          submissionId = recordDsaSubmission({
            user_id: params.userId,
            problem_id: params.problemId,
            language: params.language,
            code: params.code,
            status: evaluation.status,
            test_cases_passed: evaluation.testCasesPassed,
            total_test_cases: evaluation.totalTestCases,
            execution_time_ms: evaluation.executionTimeMs,
          }).id;
        } catch {}
      }

      const mockComment = getDsaMockComment({
        problemId: params.problemId,
        status: evaluation.status,
        code: params.code,
        language: params.language,
        testCasesPassed: evaluation.testCasesPassed,
        totalTestCases: evaluation.totalTestCases,
        results: evaluation.results,
        compileOutput: evaluation.compileOutput,
      });

      return { ...evaluation, submissionId, mockComment, cached: false };
    },
  });

  if (params.asyncMode) {
    const queueDepth = st.fastLane.length + st.judgeLane.length;
    return {
      kind: "queued",
      jobId: job.id,
      queuePosition: job.queuePositionAtEnqueue,
      queueDepth,
      estimatedWaitMs: Math.max(150, Math.round((job.queuePositionAtEnqueue / getMaxWorkers()) * 250)),
    };
  }

  const output = await promise;
  return { kind: "immediate", output };
}

export async function dispatchCompilerRun(params: {
  language: SupportedLanguage;
  code: string;
  stdin?: string;
  testCases?: TestCase[];
  userId: string | null;
  asyncMode: boolean;
}): Promise<
  | { kind: "immediate"; output: CompilerJobOutput }
  | { kind: "queued"; jobId: string; queuePosition: number; queueDepth: number; estimatedWaitMs: number }
> {
  const isEval = Boolean(params.testCases && params.testCases.length > 0);
  const cacheKey = buildExecutionCacheKey([
    isEval ? "comp_eval_v2" : "comp_run_v2",
    params.language,
    params.code.replace(/\r\n/g, "\n").trim(),
    isEval ? params.testCases : params.stdin || "",
  ]);

  const cached = readFromCache<ExecutionResult | SubmissionEvaluationResult>(cacheKey);
  if (cached) {
    return { kind: "immediate", output: { ...cached, cached: true } };
  }

  const st = getState();
  const { job, promise } = enqueueTask<CompilerJobOutput>({
    kind: isEval ? "compiler_eval" : "compiler_run",
    priority: 1, // Interactive runs get priority 1 fast-lane
    ownerId: params.userId,
    run: async () => {
      const result = isEval
        ? await evaluateTestCases(params.language, params.code, params.testCases!)
        : await executeCode(params.language, params.code, params.stdin || "");

      if (result.status !== "TIME_LIMIT_EXCEEDED") {
        writeCache(cacheKey, result);
      }
      return { ...result, cached: false };
    },
  });

  if (params.asyncMode) {
    const queueDepth = st.fastLane.length + st.judgeLane.length;
    return {
      kind: "queued",
      jobId: job.id,
      queuePosition: job.queuePositionAtEnqueue,
      queueDepth,
      estimatedWaitMs: Math.max(100, Math.round((job.queuePositionAtEnqueue / getMaxWorkers()) * 150)),
    };
  }

  const output = await promise;
  return { kind: "immediate", output };
}
