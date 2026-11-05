import type { NextConfig } from "next";

// Bold (botón de pagos) carga su script y su checkout desde dominios *.bold.co.
const BOLD = "https://*.bold.co";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${BOLD}` + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  `style-src 'self' 'unsafe-inline' ${BOLD}`,
  "img-src 'self' data: blob: https:",
  `font-src 'self' data: ${BOLD}`,
  `connect-src 'self' ${BOLD}`,
  `frame-src ${BOLD}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  `form-action 'self' ${BOLD}`,
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
