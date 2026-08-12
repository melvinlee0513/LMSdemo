import type { NextConfig } from "next";

/**
 * The engine reads SITE_MODE at build time so that demo deployments can be
 * hardened against indexing at the HTTP layer as well as at the page level.
 * Anything other than an explicit "production" is treated as a demo.
 */
const isDemo = process.env.SITE_MODE !== "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Centre logos and educational illustrations ship as first-party SVG from
    // /public. The optimizer refuses SVG unless explicitly allowed, so it is
    // enabled together with a hard sandbox CSP for the image response itself.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: isDemo
          ? [
              ...securityHeaders,
              {
                key: "X-Robots-Tag",
                value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
              },
            ]
          : securityHeaders,
      },
    ];
  },
};

export default nextConfig;
