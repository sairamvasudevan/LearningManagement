import { NextResponse } from "next/server";
import { getDatabaseHealth } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbHealth = getDatabaseHealth();
    return NextResponse.json(
      {
        status: dbHealth.status === "healthy" ? "ok" : "degraded",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      { status: dbHealth.status === "healthy" ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
