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

/** Prevent open redirects by allowing only local relative application paths. */
export function sanitizeRedirectPath(rawPath: string | null | undefined, fallback = "/portal"): string {
  if (!rawPath) return fallback;
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}
