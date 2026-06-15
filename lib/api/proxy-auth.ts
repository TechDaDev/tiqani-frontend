/**
 * Proxy authentication helper.
 * Reads HTTP-only cookies, validates/refreshes tokens, and returns
 * the access token for backend requests or a 401/403 response.
 */
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { getServerUser } from "@/lib/auth/server-session";

type AuthSuccess = { allowed: true; accessToken: string };
type AuthFailure = { allowed: false; response: NextResponse };

export async function authenticateProxy(
  request: NextRequest,
  requiredRole?: string
): Promise<AuthSuccess | AuthFailure> {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH)?.value;

  const { user, accessToken: newAccessToken } = await getServerUser(
    accessToken,
    refreshToken
  );

  if (!user || !newAccessToken) {
    return {
      allowed: false,
      response: NextResponse.json(
        { detail: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      allowed: false,
      response: NextResponse.json(
        { detail: "You do not have permission to perform this action." },
        { status: 403 }
      ),
    };
  }

  return { allowed: true, accessToken: newAccessToken };
}
