import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  try {
    const body = await request.json() as { email?: string };
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid student email address." }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_assign_course", { p_email: email });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = data as { result?: string; message?: string; email?: string };
    return NextResponse.json({ ok: true, message: result.message || (result.result === "assigned" ? `Course access assigned to ${email}.` : `Invitation record created for ${email}. Share the registration link with the student.`) });
  } catch {
    return NextResponse.json({ error: "The request could not be processed." }, { status: 400 });
  }
}
