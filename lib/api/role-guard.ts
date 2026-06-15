/**
 * Server-side role guard for API route handlers.
 * Verifies that the user's role matches the required role(s)
 * before proxying the request to the backend.
 *
 * The access token does not contain a `role` claim, so this
 * helper fetches the user profile from Django's /api/accounts/me/
 * to determine the role.
 */
import { backendGet } from "./backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

interface CurrentUserData {
  id: string;
  role: string;
  is_complete: boolean;
  [key: string]: unknown;
}

/**
 * Check the authenticated user's role against required roles.
 *
 * Returns the NextResponse with 401/403 if the guard fails,
 * or the user data if it passes.
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ allowed: true; user: CurrentUserData } | { allowed: false; response: NextResponse }> {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  if (!accessToken) {
    return {
      allowed: false,
      response: NextResponse.json({ detail: "Not authenticated." }, { status: 401 }),
    };
  }

  try {
    const { data } = await backendGet<CurrentUserData>(
      "/api/accounts/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!data.role || !allowedRoles.includes(data.role)) {
      return {
        allowed: false,
        response: NextResponse.json(
          { detail: `This endpoint requires role: ${allowedRoles.join(" or ")}.` },
          { status: 403 }
        ),
      };
    }

    return { allowed: true, user: data };
  } catch {
    return {
      allowed: false,
      response: NextResponse.json(
        { detail: "Failed to verify user role." },
        { status: 500 }
      ),
    };
  }
}
