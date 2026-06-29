import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { buildSecurityHeaders } from "./lib/security/headers";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

function backendImagePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
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
    {
      protocol: "https",
      hostname: "assembled-drop-jjl9wzgk8o.t3.storageapi.dev",
      pathname: "/**",
    },
  ];

  for (const value of [
    process.env.BACKEND_INTERNAL_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ]) {
    if (!value) continue;
    try {
      const url = new URL(value);
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
      });
    } catch {
      // Invalid env values are ignored here; API calls will fail loudly.
    }
  }

  for (const source of [
    process.env.CSP_IMAGE_ORIGINS,
    process.env.NEXT_PUBLIC_IMAGE_ORIGINS,
  ]) {
    if (!source) continue;
    for (const value of source.split(/[,\s]+/)) {
      if (!value) continue;
      try {
        const url = new URL(value);
        patterns.push({
          protocol: url.protocol.replace(":", "") as "http" | "https",
          hostname: url.hostname,
          port: url.port,
          pathname: "/**",
        });
      } catch {
        // Invalid env values are ignored here; CSP/browser errors will expose bad URLs.
      }
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "components", "lib", "hooks", "types"],
  },
  images: {
    remotePatterns: backendImagePatterns(),
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: buildSecurityHeaders(process.env.NODE_ENV === "production"),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
