import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Enforce Localhost-Only Access: Block all LAN IP and external access
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return new NextResponse("Access Forbidden: External LAN IP access is disabled.", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  let response = NextResponse.next({ request });

  // Add anti-caching and security headers to all dynamic HTML/RSC responses
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Strict-Transport-Security", "max-age=0");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        response.headers.set("Strict-Transport-Security", "max-age=0");
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Verify and refresh the session. Authorization is also enforced in server pages and RLS.
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
