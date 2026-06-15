/**
 * Server-side page guards for Next.js App Router pages.
 * These run in server components and layout components to protect
 * pages before any client-side code executes.
 *
 * Architecture:
 * Browser → Next.js (reads HTTP-only cookies) → Django (validates tokens)
 *                         ↓
 *                Server redirects to login if unauthenticated
 *                Server returns forbidden if wrong role
 */
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { getServerUser } from "@/lib/auth/server-session";
import type { UserRole } from "@/lib/auth/types";

// Paths that are safe to redirect back to after login
const SAFE_REDIRECT_PATHS = [
  "/account",
  "/profile/client",
  "/profile/technician",
  "/onboarding",
];

function sanitizeNextPath(path: string): string | null {
  if (!path || !path.startsWith("/")) return null;
  // Only allow internal paths
  if (path.startsWith("//") || path.startsWith("/api")) return null;
  // Only allow safe known paths
  for (const safe of SAFE_REDIRECT_PATHS) {
    if (path.endsWith(safe)) return path;
  }
  return null;
}

/**
 * Require authentication for a page.
 *
 * Returns:
 * - { allowed: true, user, accessToken } if authenticated
 * - { allowed: false, response } to redirect to login
 */
export async function requireServerAuth(
  request: NextRequest
): Promise<
  | { allowed: true; user: import("@/lib/auth/types").AuthUser; accessToken: string }
  | { allowed: false; response: NextResponse }
> {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH)?.value;

  const { user, accessToken: newAccessToken } = await getServerUser(
    accessToken,
    refreshToken
  );

  if (!user || !newAccessToken) {
    // Not authenticated — redirect to login
    const url = request.nextUrl.clone();
    const locale = url.pathname.split("/")[1] || "ar";

    // Preserve the original path for redirect back after login
    const nextPath = sanitizeNextPath(url.pathname.replace(`/${locale}`, ""));
    const loginUrl = nextPath
      ? `/${locale}/login?next=/${locale}${nextPath}`
      : `/${locale}/login`;

    return {
      allowed: false,
      response: NextResponse.redirect(new URL(loginUrl, request.url)),
    };
  }

  // If we used a refreshed token, set the new access token cookie
  if (newAccessToken !== accessToken) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAMES.ACCESS, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 120 * 60, // 120 minutes
    });
    return { allowed: true, user, accessToken: newAccessToken };
  }

  return { allowed: true, user, accessToken: newAccessToken };
}

/**
 * Require a specific role for a page.
 * Must be called after requireServerAuth.
 *
 * Returns:
 * - { allowed: true, user, accessToken } if role matches
 * - { allowed: false, response } redirect to role home or forbidden
 */
export async function requireServerRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<
  | { allowed: true; user: import("@/lib/auth/types").AuthUser; accessToken: string }
  | { allowed: false; response: NextResponse }
> {
  const result = await requireServerAuth(request);
  if (!result.allowed) return result;

  if (!allowedRoles.includes(result.user.role)) {
    // Wrong role — redirect to the user's role home page
    const url = request.nextUrl.clone();
    const locale = url.pathname.split("/")[1] || "ar";
    const roleHome = getRoleHome(result.user.role);

    return {
      allowed: false,
      response: NextResponse.redirect(new URL(`/${locale}${roleHome}`, request.url)),
    };
  }

  return result;
}

/**
 * Get the default home path for a role.
 */
function getRoleHome(role: UserRole): string {
  switch (role) {
    case "client":
      return "/profile/client";
    case "technician":
      return "/profile/technician";
    case "dealership":
    case "system_admin":
    case "finance_admin":
    case "account_manager":
    case "content_moderator":
      return "/account";
    default:
      return "/account";
  }
}
