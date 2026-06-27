import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "@/lib/security/headers";

describe("Phase 12 security headers", () => {
  it("sets core production-readiness headers", async () => {
    const values = Object.fromEntries(buildSecurityHeaders(false).map((item) => [item.key, item.value]));
    expect(values["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(values["X-Content-Type-Options"]).toBe("nosniff");
    expect(values["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(values["Permissions-Policy"]).toContain("camera=()");
  });
});
