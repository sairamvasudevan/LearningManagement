import type { NextConfig } from "next";
import { isSupabaseConfigured } from "./src/lib/supabase/config";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=0" },
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
];

function productionContentSecurityPolicy() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseConnectSources = "";
  if (isSupabaseConfigured() && supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      supabaseConnectSources = `${parsed.origin} wss://${parsed.host}`;
    } catch {
      // Invalid URL ignored
    }
  }
  const connectSources = ["'self'", supabaseConnectSources].filter(Boolean).join(" ");
  return [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "frame-src 'self' blob: data:",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' data:",
    "font-src 'self' data:",
    `connect-src ${connectSources}`,
    "img-src 'self' data: blob:",
  ].join("; ");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/course-content": ["./private-content/module-01.html"],
  },
  async headers() {
    const headers = [
      ...securityHeaders,
      { key: "Content-Security-Policy", value: productionContentSecurityPolicy() },
    ];
    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
