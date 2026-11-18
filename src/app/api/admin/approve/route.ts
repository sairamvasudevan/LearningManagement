import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  try {
    const body = await request.json() as { studentId?: string };
    if (!body.studentId || !/^[0-9a-f-]{36}$/i.test(body.studentId)) {
      return NextResponse.json({ error: "Invalid student identifier." }, { status: 400 });
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc("admin_approve_course_enrollment", { p_student_id: body.studentId });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The approval request could not be processed." }, { status: 400 });
  }
}
