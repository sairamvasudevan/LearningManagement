import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security";

const modes = new Set(["open", "approval", "invite_only"]);
export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  try {
    const body = await request.json() as { mode?: string };
    if (!body.mode || !modes.has(body.mode)) return NextResponse.json({ error: "Invalid registration mode." }, { status: 400 });
    const supabase = await createClient();
    const { error } = await supabase.rpc("set_course_registration_mode", { p_mode: body.mode });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The request could not be processed." }, { status: 400 });
  }
}
