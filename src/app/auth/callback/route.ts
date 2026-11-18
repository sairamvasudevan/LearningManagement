import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await supabase.rpc("request_course_enrollment");
      const requestedDestination = new URL(next, origin);
      const safeDestination = requestedDestination.origin === origin
        ? `${requestedDestination.pathname}${requestedDestination.search}${requestedDestination.hash}`
        : "/portal";
      return NextResponse.redirect(new URL(safeDestination, origin));
    }
  }
  return NextResponse.redirect(new URL("/login?error=confirmation_failed", origin));
}
