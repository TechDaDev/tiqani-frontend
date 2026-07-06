import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "@/lib/security/headers";

describe("Phase 12 security headers", () => {
  it("sets core production-readiness headers", async () => {
    const values = Object.fromEntries(
      buildSecurityHeaders(false).map((item) => [item.key, item.value]),
    );
    expect(values["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(values["X-Content-Type-Options"]).toBe("nosniff");
    expect(values["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(values["Permissions-Policy"]).toContain("camera=()");
  });

  it("allows configured media origins for uploaded profile images", async () => {
    const values = Object.fromEntries(
      buildSecurityHeaders(false, "https://api.example.test", [
        "https://t3.storageapi.dev",
        "https://*.t3.storageapi.dev",
      ]).map((item) => [item.key, item.value]),
    );

    expect(values["Content-Security-Policy"]).toContain(
      "img-src 'self' data: blob: http://127.0.0.1:8000 http://localhost:8000 https://api.example.test https://t3.storageapi.dev https://*.t3.storageapi.dev",
    );
    expect(values["Content-Security-Policy"]).toContain(
      "connect-src 'self' http://127.0.0.1:8000 http://localhost:8000 https://api.example.test",
    );
  });
});
