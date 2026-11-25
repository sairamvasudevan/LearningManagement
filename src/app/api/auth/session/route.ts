import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentIdentity } from "@/lib/auth";
import { hasSameOrigin } from "@/lib/security";
import {
  createUser,
  getUserByEmail,
  createSession,
  deleteSession,
  recordAssessmentAttempt,
  savePracticeTask,
  getUserBySessionToken,
  validateUserCredentials,
  getRegistrationMode,
  isEmailInvited,
  markInviteAccepted,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    const response = NextResponse.json({ ok: true });

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

      const existing = getUserByEmail(email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email address already exists. Please sign in instead." },
          { status: 409 },
        );
      }

      const mode = getRegistrationMode();
      const invited = isEmailInvited(email);

      if (mode === "invite_only" && !invited) {
        return NextResponse.json(
          {
            error:
              "Registration is currently Invite-Only. Please contact your institution administrator to be invited.",
          },
          { status: 403 },
        );
      }

      const initialStatus: "approved" | "pending" =
        mode === "approval" && !invited ? "pending" : "approved";

      // Create new user in database with full profile & PBKDF2 password hashing
      const user = createUser({
        email,
        role: "student",
        enrollment_status: initialStatus,
        full_name: fullName,
        phone: String(body.phone || "").trim(),
        college: String(body.college || "Engineering College").trim(),
        register_number: String(body.register_number || "REG-2026-001").trim(),
        department: String(body.department || "Computer Science and Engineering").trim(),
        degree: String(body.degree || "B.Tech").trim(),
        graduation_year: body.graduation_year ? Number(body.graduation_year) : 2026,
        password,
      });

      if (invited) {
        markInviteAccepted(email);
      }

      const token = createSession(user.id);
      const res = NextResponse.json({
        ok: true,
        role: user.role,
        enrollmentStatus: user.enrollment_status,
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
      const identity = await getCurrentIdentity();
      const sessionToken = request.cookies.get("psl_session")?.value;
      const user = sessionToken ? getUserBySessionToken(sessionToken) : null;
      const userId = identity?.id || user?.id;

      if (!userId) {
        return NextResponse.json(
          { error: "Authentication required to update learning records." },
          { status: 401 },
        );
      }

      const modNum = Number(body.moduleNumber || 1);
      if (!Number.isInteger(modNum) || modNum < 1 || modNum > 100) {
        return NextResponse.json({ error: "Invalid module number." }, { status: 400 });
      }

      const score = Math.max(0, Number(body.score || 0));
      const totalMarks = Math.max(1, Number(body.totalMarks || 12));
      const passed = Boolean(body.passed);

      recordAssessmentAttempt({
        userId,
        moduleNumber: modNum,
        score,
        totalMarks,
        passed,
        answersJson: JSON.stringify(body.answers || {}),
      });

      return NextResponse.json({ ok: true, savedToDb: true, userId });
    }

    if (action === "submit_practice_task") {
      const identity = await getCurrentIdentity();
      const sessionToken = request.cookies.get("psl_session")?.value;
      const user = sessionToken ? getUserBySessionToken(sessionToken) : null;
      const userId = identity?.id || user?.id;

      if (!userId) {
        return NextResponse.json(
          { error: "Authentication required to submit practice tasks." },
          { status: 401 },
        );
      }

      const modNum = Number(body.moduleNumber || 1);
      if (!Number.isInteger(modNum) || modNum < 1 || modNum > 100) {
        return NextResponse.json({ error: "Invalid module number." }, { status: 400 });
      }

      const submission = savePracticeTask({
        userId,
        moduleNumber: modNum,
        taskId: String(body.taskId || "task-01").slice(0, 64),
        taskPrompt: String(body.taskPrompt || "").slice(0, 1000),
        submission: String(body.submission || "").trim().slice(0, 20000),
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
