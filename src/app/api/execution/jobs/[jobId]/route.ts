import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import {
  getExecutionEngineStats,
  getExecutionJobForOwner,
} from "@/lib/execution-queue";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  if (!jobId || !UUID_REGEX.test(jobId)) {
    return NextResponse.json(
      { error: "Invalid execution job ID" },
      { status: 400 },
    );
  }

  const identity = await getCurrentIdentity();
  const lookup = getExecutionJobForOwner(
    jobId,
    identity?.id ?? null,
    identity?.role === "admin",
  );

  if (lookup.status === "forbidden") {
    return NextResponse.json(
      { error: "Forbidden: job belongs to another account" },
      { status: 403 },
    );
  }

  if (lookup.status === "not_found" || !lookup.job) {
    return NextResponse.json(
      { error: "Execution job not found or expired" },
      { status: 404 },
    );
  }

  const job = lookup.job;
  const stats = getExecutionEngineStats();

  return NextResponse.json(
    {
      jobId: job.id,
      kind: job.kind,
      status: job.status,
      queuePosition: job.status === "QUEUED" ? job.queuePositionAtEnqueue : 0,
      queueDepth: stats.queueDepth,
      activeWorkers: stats.activeWorkers,
      maxWorkers: stats.maxWorkers,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
