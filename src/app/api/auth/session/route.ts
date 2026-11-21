import { NextResponse, type NextRequest } from "next/server";
import { DEV_DEFAULT_ADMIN, DEV_DEFAULT_STUDENT, type SessionIdentity } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action as string;

    const response = NextResponse.json({ ok: true });

    if (action === "demo_student") {
      const studentSession = { ...DEV_DEFAULT_STUDENT };
      response.cookies.set("psl_dev_session", encodeURIComponent(JSON.stringify(studentSession)), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    if (action === "demo_admin") {
      const adminSession = { ...DEV_DEFAULT_ADMIN };
      response.cookies.set("psl_dev_session", encodeURIComponent(JSON.stringify(adminSession)), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "dev_register" && !isSupabaseConfigured()) {
      const customStudent: SessionIdentity = {
        id: `00000000-0000-4000-a000-${Date.now().toString(16).padStart(12, "0")}`,
        email: String(body.email || "student@learninghub.edu").toLowerCase().trim(),
        role: "student",
        fullName: String(body.full_name || "Enrolled Student").trim(),
        college: String(body.college || "Engineering College").trim(),
        registerNumber: String(body.register_number || "REG-2026-001").trim(),
        department: String(body.department || "Computer Science").trim(),
        degree: String(body.degree || "B.Tech").trim(),
        graduationYear: body.graduation_year ? Number(body.graduation_year) : 2026,
        isDevSession: true,
      };

      response.cookies.set("psl_dev_session", encodeURIComponent(JSON.stringify(customStudent)), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      // New student starts with zero progress (not completed!)
      response.cookies.set("psl_progress", encodeURIComponent(JSON.stringify([])), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "update_progress") {
      const existingCookie = request.cookies.get("psl_progress");
      let currentProgress: Array<{
        module_number: number;
        status: string;
        best_score: number;
        total_marks: number;
        attempts: number;
        first_started_at: string;
        completed_at?: string;
      }> = [];

      if (existingCookie?.value) {
        try {
          currentProgress = JSON.parse(decodeURIComponent(existingCookie.value)) || [];
        } catch {
          currentProgress = [];
        }
      }

      const modNum = Number(body.moduleNumber || 1);
      const score = Number(body.score || 0);
      const totalMarks = Number(body.totalMarks || 12);
      const passed = Boolean(body.passed);
      const now = new Date().toISOString();

      const existingIdx = currentProgress.findIndex((p) => p.module_number === modNum);
      if (existingIdx >= 0) {
        const item = currentProgress[existingIdx];
        currentProgress[existingIdx] = {
          ...item,
          status: passed ? "completed" : "in_progress",
          best_score: Math.max(item.best_score, score),
          total_marks: totalMarks,
          attempts: item.attempts + 1,
          completed_at: passed ? (item.completed_at || now) : item.completed_at,
        };
      } else {
        currentProgress.push({
          module_number: modNum,
          status: passed ? "completed" : "in_progress",
          best_score: score,
          total_marks: totalMarks,
          attempts: 1,
          first_started_at: now,
          completed_at: passed ? now : undefined,
        });
      }

      response.cookies.set("psl_progress", encodeURIComponent(JSON.stringify(currentProgress)), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "dev_login" && !isSupabaseConfigured()) {
      const email = String(body.email || "").toLowerCase().trim();
      const isAdmin = email.includes("admin") || email === "admin@learninghub.edu";
      const session: SessionIdentity = isAdmin
        ? { ...DEV_DEFAULT_ADMIN, email }
        : { ...DEV_DEFAULT_STUDENT, email };

      response.cookies.set("psl_dev_session", encodeURIComponent(JSON.stringify(session)), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "signout") {
      response.cookies.delete("psl_dev_session");
      if (isSupabaseConfigured()) {
        try {
          const supabase = await createClient();
          await supabase.auth.signOut();
        } catch {
          // ignore error if supabase signOut fails
        }
      }
      return response;
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process auth session." }, { status: 500 });
  }
}

