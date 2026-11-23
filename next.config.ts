import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "frame-src 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    `connect-src 'self' ${supabaseConnectSources}`.trim(),
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
