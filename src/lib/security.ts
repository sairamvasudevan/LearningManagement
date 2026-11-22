import type { NextRequest } from "next/server";

/** Reject cross-origin browser mutations while respecting reverse proxies and tunnels. */
export function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin") || request.headers.get("referer");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const reqHost =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      new URL(request.url).host;

    if (originHost === reqHost) return true;

    // Allow localhost/127.0.0.1 cross-usage in local environments
    if (
      (originHost === "127.0.0.1:3000" || originHost === "localhost:3000") &&
      (reqHost === "localhost:3000" || reqHost === "127.0.0.1:3000")
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
