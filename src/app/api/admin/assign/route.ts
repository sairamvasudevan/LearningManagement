import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentIdentity } from "@/lib/auth";
import { assignStudentOrCreateInvite } from "@/lib/db";
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

    const body = (await request.json()) as { email?: string };
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid student email address." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("admin_assign_course", { p_email: email });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      const result = data as { result?: string; message?: string; email?: string };
      return NextResponse.json({
        ok: true,
        message:
          result.message ||
          (result.result === "assigned"
            ? `Course access assigned to ${email}.`
            : `Invitation record created for ${email}. Share the registration link with the student.`),
      });
    }

    const outcome = assignStudentOrCreateInvite(email);
    return NextResponse.json({ ok: true, result: outcome.result, message: outcome.message });
  } catch {
    return NextResponse.json({ error: "The request could not be processed." }, { status: 400 });
  }
}
