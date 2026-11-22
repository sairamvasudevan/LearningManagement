import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deleteSession } from "@/lib/db";

async function performSignOut(request: NextRequest) {
  const sessionToken = request.cookies.get("psl_session")?.value;
  if (sessionToken) {
    try {
      deleteSession(sessionToken);
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Proceed even if Supabase network call fails
    }
  }

  // Construct redirect URL taking reverse proxy / cloudflare tunnel into account
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const redirectTarget = host ? `${proto}://${host}/login` : new URL("/login", request.url).toString();

  const response = NextResponse.redirect(redirectTarget, { status: 303 });

  // Explicitly invalidate cookies with root path and instant expiry
  response.cookies.set("psl_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set("psl_dev_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set("psl_progress", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function POST(request: NextRequest) {
  return performSignOut(request);
}

export async function GET(request: NextRequest) {
  return performSignOut(request);
}
