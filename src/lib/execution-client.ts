"use client";

export interface QueueProgressState {
  status: "QUEUED" | "RUNNING";
  queuePosition: number;
  queueDepth?: number;
  estimatedWaitMs?: number;
  jobId?: string;
}

export async function executeWithQueuePolling<T>(
  endpoint: string,
  payload: Record<string, unknown>,
  onQueueProgress?: (progress: QueueProgressState) => void,
): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, async: true }),
  });

  const data = (await res.json()) as T & {
    queued?: boolean;
    jobId?: string;
    queuePosition?: number;
    queueDepth?: number;
    estimatedWaitMs?: number;
    error?: string;
  };

  if (res.status !== 202 || !data.queued || !data.jobId) {
    return { ok: res.ok, status: res.status, data };
  }

  onQueueProgress?.({
    status: "QUEUED",
    queuePosition: data.queuePosition ?? 1,
    queueDepth: data.queueDepth ?? 1,
    estimatedWaitMs: data.estimatedWaitMs,
    jobId: data.jobId,
  });

  // Poll /api/execution/jobs/[jobId] with bounded exponential backoff (150ms -> 800ms, max 45s)
  let delayMs = 150;
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    delayMs = Math.min(800, Math.round(delayMs * 1.35));

    const pollRes = await fetch(
      `/api/execution/jobs/${encodeURIComponent(data.jobId)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!pollRes.ok) {
      const errJson = (await pollRes.json().catch(() => ({}))) as {
        error?: string;
      };
      return {
        ok: false,
        status: pollRes.status,
        data: {
          error:
            errJson.error || `Queue status check failed (${pollRes.status})`,
        } as T & { error?: string },
      };
    }

    const pollData = (await pollRes.json()) as {
      status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
      queuePosition?: number;
      queueDepth?: number;
      result?: T;
      error?: string;
    };

    if (pollData.status === "QUEUED" || pollData.status === "RUNNING") {
      onQueueProgress?.({
        status: pollData.status,
        queuePosition: pollData.queuePosition ?? 0,
        queueDepth: pollData.queueDepth,
        jobId: data.jobId,
      });
      continue;
    }

    if (pollData.status === "COMPLETED" && pollData.result) {
      return { ok: true, status: 200, data: pollData.result };
    }

    return {
      ok: false,
      status: 500,
      data: {
        error: pollData.error || "Background execution failed.",
      } as T & { error?: string },
    };
  }

  return {
    ok: false,
    status: 504,
    data: {
      error:
        "Execution wait timeout exceeded while queued under heavy load. Please retry.",
    } as T & { error?: string },
  };
}
