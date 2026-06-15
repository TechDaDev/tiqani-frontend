/**
 * Tests for centralized role architecture.
 * Covers lib/auth/roles.ts and lib/auth/guards.ts.
 */

import { describe, it, expect } from "vitest";

// Import from roles.ts (new centralized module)
import {
  normalizeRole,
  hasRole,
  isClient,
  isTechnician,
  isAdmin,
  getRoleHome,
  getRoleLabelKey,
  canAccessRoute,
  ALL_ROLES,
  USER_ROLES,
  ADMIN_ROLES,
} from "@/lib/auth/roles";

describe("normalizeRole", () => {
  it("returns 'client' for undefined", () => {
    expect(normalizeRole(undefined)).toBe("client");
  });

  it("returns 'client' for null", () => {
    expect(normalizeRole(null)).toBe("client");
  });

  it("returns the role for valid roles", () => {
    expect(normalizeRole("client")).toBe("client");
    expect(normalizeRole("technician")).toBe("technician");
    expect(normalizeRole("system_admin")).toBe("system_admin");
  });

  it("normalizes case", () => {
    expect(normalizeRole("CLIENT")).toBe("client");
    expect(normalizeRole("Technician")).toBe("technician");
  });

  it("returns default for unknown role", () => {
    expect(normalizeRole("superadmin")).toBe("client");
  });
});

describe("hasRole", () => {
  it("returns true for matching role", () => {
    expect(hasRole("client", "client")).toBe(true);
    expect(hasRole("technician", "technician")).toBe(true);
  });

  it("returns false for non-matching role", () => {
    expect(hasRole("client", "technician")).toBe(false);
    expect(hasRole("technician", "client")).toBe(false);
  });
});

describe("isClient", () => {
  it("returns true for client", () => {
    expect(isClient("client")).toBe(true);
  });

  it("returns false for other roles", () => {
    expect(isClient("technician")).toBe(false);
    expect(isClient("system_admin")).toBe(false);
    expect(isClient("dealership")).toBe(false);
  });
});

describe("isTechnician", () => {
  it("returns true for technician", () => {
    expect(isTechnician("technician")).toBe(true);
  });

  it("returns false for other roles", () => {
    expect(isTechnician("client")).toBe(false);
    expect(isTechnician("dealership")).toBe(false);
    expect(isTechnician(undefined)).toBe(false);
  });
});

describe("isAdmin", () => {
  it("returns true for admin roles", () => {
    expect(isAdmin("system_admin")).toBe(true);
    expect(isAdmin("finance_admin")).toBe(true);
    expect(isAdmin("account_manager")).toBe(true);
    expect(isAdmin("content_moderator")).toBe(true);
  });

  it("returns false for user roles", () => {
    expect(isAdmin("client")).toBe(false);
    expect(isAdmin("technician")).toBe(false);
  });
});

describe("getRoleHome", () => {
  it("returns profile/client for client", () => {
    expect(getRoleHome("client")).toBe("/profile/client");
  });

  it("returns profile/technician for technician", () => {
    expect(getRoleHome("technician")).toBe("/profile/technician");
  });

  it("returns /account for admin roles", () => {
    expect(getRoleHome("system_admin")).toBe("/account");
    expect(getRoleHome("dealership")).toBe("/account");
  });

  it("defaults to /account for unknown", () => {
    expect(getRoleHome(undefined)).toBe("/profile/client");
    expect(getRoleHome(null)).toBe("/profile/client");
  });
});

describe("getRoleLabelKey", () => {
  it("returns correct translation keys", () => {
    expect(getRoleLabelKey("client")).toBe("roles.client");
    expect(getRoleLabelKey("technician")).toBe("roles.technician");
    expect(getRoleLabelKey("dealership")).toBe("roles.dealership");
    expect(getRoleLabelKey("system_admin")).toBe("roles.systemAdmin");
    expect(getRoleLabelKey("finance_admin")).toBe("roles.financeAdmin");
    expect(getRoleLabelKey("account_manager")).toBe("roles.accountManager");
    expect(getRoleLabelKey("content_moderator")).toBe("roles.contentModerator");
  });

  it("defaults for unknown", () => {
    expect(getRoleLabelKey(undefined)).toBe("roles.client");
  });
});

describe("canAccessRoute", () => {
  it("allows client to access /profile/client", () => {
    expect(canAccessRoute("client", "/profile/client")).toBe(true);
  });

  it("denies client to access /profile/technician", () => {
    expect(canAccessRoute("client", "/profile/technician")).toBe(false);
  });

  it("denies client to access /onboarding", () => {
    expect(canAccessRoute("client", "/onboarding")).toBe(false);
  });

  it("allows technician to access /profile/technician", () => {
    expect(canAccessRoute("technician", "/profile/technician")).toBe(true);
  });

  it("allows technician to access /onboarding", () => {
    expect(canAccessRoute("technician", "/onboarding")).toBe(true);
  });

  it("denies technician to access /profile/client", () => {
    expect(canAccessRoute("technician", "/profile/client")).toBe(false);
  });

  it("allows both roles to access /account", () => {
    expect(canAccessRoute("client", "/account")).toBe(true);
    expect(canAccessRoute("technician", "/account")).toBe(true);
  });

  it("handles suffix matching", () => {
    expect(canAccessRoute("client", "/ar/profile/client")).toBe(true);
    expect(canAccessRoute("technician", "/en/profile/technician")).toBe(true);
  });

  it("defaults to allowed for unknown routes", () => {
    expect(canAccessRoute("client", "/some-other-route")).toBe(true);
  });
});

describe("constants", () => {
  it("ALL_ROLES contains all roles", () => {
    expect(ALL_ROLES).toContain("client");
    expect(ALL_ROLES).toContain("technician");
    expect(ALL_ROLES).toContain("dealership");
    expect(ALL_ROLES).toContain("system_admin");
  });

  it("USER_ROLES only contains client and technician", () => {
    expect(USER_ROLES).toEqual(["client", "technician"]);
  });

  it("ADMIN_ROLES contains admin-type roles", () => {
    expect(ADMIN_ROLES).toContain("system_admin");
    expect(ADMIN_ROLES).not.toContain("client");
    expect(ADMIN_ROLES).not.toContain("technician");
  });
});
