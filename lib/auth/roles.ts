/**
 * Role definitions and utilities for the Tiqani platform.
 *
 * Backend roles (authoritative):
 * - client
 * - technician
 * - dealership
 * - system_admin
 * - finance_admin
 * - account_manager
 * - content_moderator
 */
import type { UserRole } from "./types";

/**
 * All valid platform roles.
 */
export const ALL_ROLES: UserRole[] = [
  "client",
  "technician",
  "dealership",
  "system_admin",
  "finance_admin",
  "account_manager",
  "content_moderator",
];

/**
 * Roles that represent end-user profiles (non-admin).
 */
export const USER_ROLES: UserRole[] = ["client", "technician"];

/**
 * Administrative roles.
 */
export const ADMIN_ROLES: UserRole[] = [
  "system_admin",
  "finance_admin",
  "account_manager",
  "content_moderator",
];

/**
 * Normalize a role string to a valid UserRole.
 * Returns a default role or throws for truly invalid values.
 */
export function normalizeRole(role: string | undefined | null): UserRole {
  if (!role) return "client";
  const normalized = role.toLowerCase().trim() as UserRole;
  if (ALL_ROLES.includes(normalized)) return normalized;
  return "client";
}

/**
 * Check if a user has a specific role.
 */
export function hasRole(userRole: UserRole | string, targetRole: UserRole): boolean {
  return normalizeRole(userRole) === targetRole;
}

/**
 * Check if a user is a client.
 */
export function isClient(role: UserRole | string | undefined | null): boolean {
  return normalizeRole(role) === "client";
}

/**
 * Check if a user is a technician.
 */
export function isTechnician(role: UserRole | string | undefined | null): boolean {
  return normalizeRole(role) === "technician";
}

/**
 * Check if a user has an administrative role.
 */
export function isAdmin(role: UserRole | string | undefined | null): boolean {
  return ADMIN_ROLES.includes(normalizeRole(role));
}

/**
 * Get the default home route for a given role.
 */
export function getRoleHome(role: UserRole | string | undefined | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case "client":
      return "/profile/client";
    case "technician":
      return "/profile/technician";
    default:
      return "/account";
  }
}

/**
 * Get the translation key for a role's display label.
 */
export function getRoleLabelKey(role: UserRole | string | undefined | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case "client":
      return "roles.client";
    case "technician":
      return "roles.technician";
    case "dealership":
      return "roles.dealership";
    case "system_admin":
      return "roles.systemAdmin";
    case "finance_admin":
      return "roles.financeAdmin";
    case "account_manager":
      return "roles.accountManager";
    case "content_moderator":
      return "roles.contentModerator";
    default:
      return "roles.client";
  }
}

/**
 * Role-based route access rules.
 * Key: route pattern suffix
 * Value: allowed roles
 */
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/profile/client": ["client"],
  "/profile/technician": ["technician"],
  "/onboarding": ["technician"],
  "/account": ["client", "technician", "dealership",
    "system_admin", "finance_admin", "account_manager", "content_moderator"],
};

/**
 * Check if a user can access a given route.
 */
export function canAccessRoute(
  role: UserRole | string | undefined | null,
  path: string
): boolean {
  const normalized = normalizeRole(role);

  // Check exact match first
  if (ROUTE_ACCESS[path]) {
    return ROUTE_ACCESS[path].includes(normalized);
  }

  // Check suffix match
  for (const [route, allowed] of Object.entries(ROUTE_ACCESS)) {
    if (path.endsWith(route)) {
      return allowed.includes(normalized);
    }
  }

  // Default: allow if authenticated
  return true;
}
