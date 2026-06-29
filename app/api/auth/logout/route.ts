import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH)?.value;

    if (refreshToken) {
      try {
        await backendPost("/api/auth/logout/", { refresh: refreshToken });
      } catch {
        // Logout is best-effort — clear cookies regardless
      }
    }

    const response = NextResponse.json({ detail: "Logged out." }, { status: 200 });

    response.cookies.set(COOKIE_NAMES.ACCESS, "", { ...COOKIE_OPTIONS.ACCESS, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.REFRESH, "", { ...COOKIE_OPTIONS.REFRESH, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.SESSION, "", { ...COOKIE_OPTIONS.SESSION, maxAge: 0 });

    return response;
  } catch {
    const response = NextResponse.json({ detail: "Logged out." }, { status: 200 });
    response.cookies.set(COOKIE_NAMES.ACCESS, "", { ...COOKIE_OPTIONS.ACCESS, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.REFRESH, "", { ...COOKIE_OPTIONS.REFRESH, maxAge: 0 });
    response.cookies.set(COOKIE_NAMES.SESSION, "", { ...COOKIE_OPTIONS.SESSION, maxAge: 0 });
    return response;
  }
}
