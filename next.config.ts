import type { NextConfig } from "next";

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
  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      supabaseConnectSources = `${parsed.origin} wss://${parsed.host}`;
    } catch {
      // An invalid URL will also prevent Supabase client configuration; do not add it to CSP.
    }
  }
  return [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "frame-src 'self' blob: data:",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com data:",
    "font-src 'self' https://fonts.gstatic.com data:",
    `connect-src 'self' ${supabaseConnectSources} ws: wss: *`.trim(),
    "img-src 'self' data: blob: *",
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
