import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  createUser,
  getUserByEmail,
  createSession,
  deleteSession,
  recordAssessmentAttempt,
  savePracticeTask,
  getUserBySessionToken,
  validateUserCredentials,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action as string;

    const response = NextResponse.json({ ok: true });

    if (action === "demo_student") {
      let user = getUserByEmail("student@learninghub.edu");
      if (!user) {
        user = createUser({
          email: "student@learninghub.edu",
          role: "student",
          full_name: "Aditya Sharma",
          college: "National Institute of Technology, Trichy",
          register_number: "NITT-2024-CS-0842",
          department: "Computer Science and Engineering",
          degree: "B.Tech Computer Science",
          graduation_year: 2026,
        });
      }
      const token = createSession(user.id);
      response.cookies.set("psl_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "demo_admin") {
      let user = getUserByEmail("admin@learninghub.edu");
      if (!user) {
        user = createUser({
          email: "admin@learninghub.edu",
          role: "admin",
          full_name: "Prof. Sairam Vasudevan",
          college: "Learning Management System Admin",
          register_number: "ADMIN-FACULTY-01",
          department: "Academic & Placement Affairs",
          degree: "Head of Technical Learning",
          graduation_year: 2020,
        });
      }
      const token = createSession(user.id);
      response.cookies.set("psl_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (action === "register" || action === "dev_register") {
      const email = String(body.email || "").toLowerCase().trim();
      const password = String(body.password || "").trim();
      const fullName = String(body.full_name || "").trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "A valid student email address is required." }, { status: 400 });
      }
      if (!password || password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      if (!fullName || fullName.length < 3) {
        return NextResponse.json({ error: "Full name must be at least 3 characters." }, { status: 400 });
      }

      // Check if user already exists
      const existing = getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email address already exists. Please sign in instead." },
          { status: 409 },
        );
      }

      // Create new verified user in database with full profile & hashed password
      const user = createUser({
        email,
        role: "student",
        full_name: fullName,
        phone: String(body.phone || "").trim(),
        college: String(body.college || "Engineering College").trim(),
        register_number: String(body.register_number || "REG-2026-001").trim(),
        department: String(body.department || "Computer Science and Engineering").trim(),
        degree: String(body.degree || "B.Tech").trim(),
        graduation_year: body.graduation_year ? Number(body.graduation_year) : 2026,
        password,
      });

      const token = createSession(user.id);
      const res = NextResponse.json({
        ok: true,
        role: user.role,
        redirect: "/portal",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
        },
      });

      res.cookies.set("psl_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    if (action === "login" || action === "dev_login") {
      const email = String(body.email || "").toLowerCase().trim();
      const password = String(body.password || "").trim();

      if (!email) {
        return NextResponse.json({ error: "Email address is required." }, { status: 400 });
      }
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 });
      }

      // Verify credentials against database
      const validation = validateUserCredentials(email, password);
      if (validation.error || !validation.user) {
        return NextResponse.json(
          { error: validation.error || "Authentication failed. Invalid email or password." },
          { status: 401 },
        );
      }

      const user = validation.user;
      const token = createSession(user.id);
      const res = NextResponse.json({
        ok: true,
        role: user.role,
        redirect: user.role === "admin" ? "/admin" : "/portal",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
        },
      });

      res.cookies.set("psl_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    if (action === "update_progress") {
      const sessionToken = request.cookies.get("psl_session")?.value;
      const user = sessionToken ? getUserBySessionToken(sessionToken) : null;
      const userId = user ? user.id : "00000000-0000-4000-a000-000000000001";

      const modNum = Number(body.moduleNumber || 1);
      const score = Number(body.score || 0);
      const totalMarks = Number(body.totalMarks || 12);
      const passed = Boolean(body.passed);

      // Record in SQLite database permanently
      recordAssessmentAttempt({
        userId,
        moduleNumber: modNum,
        score,
        totalMarks,
        passed,
        answersJson: JSON.stringify(body.answers || {}),
      });

      return NextResponse.json({ ok: true, savedToDb: true });
    }

    if (action === "submit_practice_task") {
      const sessionToken = request.cookies.get("psl_session")?.value;
      const user = sessionToken ? getUserBySessionToken(sessionToken) : null;
      const userId = user ? user.id : "00000000-0000-4000-a000-000000000001";

      const submission = savePracticeTask({
        userId,
        moduleNumber: Number(body.moduleNumber || 1),
        taskId: String(body.taskId || "task-01"),
        taskPrompt: String(body.taskPrompt || ""),
        submission: String(body.submission || "").trim(),
      });

      return NextResponse.json({ ok: true, submissionId: submission.id });
    }

    if (action === "signout") {
      const sessionToken = request.cookies.get("psl_session")?.value;
      if (sessionToken) deleteSession(sessionToken);
      response.cookies.delete("psl_session");
      response.cookies.delete("psl_dev_session");
      response.cookies.delete("psl_progress");

      if (isSupabaseConfigured()) {
        try {
          const supabase = await createClient();
          await supabase.auth.signOut();
        } catch {
          // ignore
        }
      }
      return response;
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process auth session." },
      { status: 500 },
    );
  }
}
