import type { NextRequest } from "next/server";

/** Reject cross-origin browser mutations. Database RLS/RPC checks remain the authorization boundary. */
export function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
