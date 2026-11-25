import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/lib/auth";
import { getDatabaseHealth, getAdminMetrics } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { MODULES_CURRICULUM } from "@/lib/curriculum-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (identity.role !== "admin") {
      return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
    }

    const memory = process.memoryUsage();
    const dbHealth = getDatabaseHealth();
    const adminMetrics = getAdminMetrics();

    const totalQuestions = Object.values(MODULES_CURRICULUM).reduce(
      (sum, m) => sum + m.questions.length,
      0,
    );

    return NextResponse.json({
      service: "Problem Solving Lab LMS",
      status: "operational",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "production",
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryMB: {
          rss: Math.round(memory.rss / (1024 * 1024)),
          heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
          heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
        },
      },
      backendEngine: {
        mode: isSupabaseConfigured() ? "supabase_cloud" : "persistent_sqlite_native",
        databaseStatus: dbHealth.status,
        integrityCheck: dbHealth.integrityCheck,
        tableCounts: dbHealth.counts,
      },
      curriculum: {
        stage: "Stage 01 to Stage 10 (Full 100-Hour Flagship Curriculum)",
        publishedStagesCount: 10,
        publishedModulesCount: Object.keys(MODULES_CURRICULUM).length,
        totalQuestionsCount: totalQuestions,
      },
      metrics: {
        totalRegisteredStudents: adminMetrics.totalStudents,
        approvedStudents: adminMetrics.approvedStudents,
        activeLearners: adminMetrics.activeLearners,
        totalModulesMastered: adminMetrics.totalModulesMastered,
        totalAssessmentAttempts: adminMetrics.totalAssessmentAttempts,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Monitoring telemetry failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
