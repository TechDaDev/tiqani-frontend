import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { buildSecurityHeaders } from "./lib/security/headers";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

function backendOrigin() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_INTERNAL_URL;
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function backendImagePatterns() {
  const origin = backendOrigin();
  if (!origin) return [];
  const url = new URL(origin);
  return [
    {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    },
  ];
}

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "components", "lib", "hooks", "types"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      ...backendImagePatterns(),
    ],
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: buildSecurityHeaders(process.env.NODE_ENV === "production", backendOrigin()),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
