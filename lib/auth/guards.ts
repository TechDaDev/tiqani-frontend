import type { UserRole } from "./types";

const roleHierarchy: Record<UserRole, number> = {
  client: 1,
  technician: 1,
  dealership: 2,
  account_manager: 3,
  content_moderator: 3,
  finance_admin: 4,
  system_admin: 5,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[requiredRole] ?? 0);
}

export function isAtLeast(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isClient(userRole: UserRole): boolean {
  return userRole === "client";
}

export function isTechnician(userRole: UserRole): boolean {
  return userRole === "technician";
}

export function isAdmin(userRole: UserRole): boolean {
  return ["system_admin", "finance_admin", "account_manager", "content_moderator"].includes(userRole);
}
