import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentIdentity } from "@/lib/auth";
import { setRegistrationMode } from "@/lib/db";
import { hasSameOrigin } from "@/lib/security";

const modes = new Set(["open", "approval", "invite_only"]);

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

    const body = (await request.json()) as { mode?: string };
    if (!body.mode || !modes.has(body.mode)) {
      return NextResponse.json({ error: "Invalid registration mode." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.rpc("set_course_registration_mode", { p_mode: body.mode });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json({ ok: true });
    }

    setRegistrationMode(body.mode as "open" | "approval" | "invite_only");
    return NextResponse.json({ ok: true, mode: body.mode });
  } catch {
    return NextResponse.json({ error: "The request could not be processed." }, { status: 400 });
  }
}
