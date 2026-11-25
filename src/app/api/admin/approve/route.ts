import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentIdentity } from "@/lib/auth";
import { approveStudentEnrollment, getUserById } from "@/lib/db";
import { hasSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (identity.role !== "admin") {
      return NextResponse.json({ error: "Administrator privileges required." }, { status: 403 });
    }

    const body = (await request.json()) as { studentId?: string };
    if (!body.studentId || !/^[0-9a-f-]{36}$/i.test(body.studentId)) {
      return NextResponse.json({ error: "Invalid student identifier." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.rpc("admin_approve_course_enrollment", {
        p_student_id: body.studentId,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json({ ok: true });
    }

    const target = getUserById(body.studentId);
    if (!target) {
      return NextResponse.json({ error: "Student record not found." }, { status: 404 });
    }

    approveStudentEnrollment(body.studentId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The approval request could not be processed." }, { status: 400 });
  }
}
