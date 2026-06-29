import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: "No refresh token available." },
        { status: 401 }
      );
    }

    const { data, status } = await backendPost<{ access: string }>(
      "/api/auth/refresh/",
      { refresh: refreshToken }
    );

    const response = NextResponse.json({ refreshed: true }, { status });

    response.cookies.set(COOKIE_NAMES.ACCESS, data.access, COOKIE_OPTIONS.ACCESS);
    response.cookies.set(COOKIE_NAMES.SESSION, "1", COOKIE_OPTIONS.SESSION);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const response = NextResponse.json(
        { detail: "Session expired. Please log in again." },
        { status: 401 }
      );
      response.cookies.set(COOKIE_NAMES.ACCESS, "", { ...COOKIE_OPTIONS.ACCESS, maxAge: 0 });
      response.cookies.set(COOKIE_NAMES.REFRESH, "", { ...COOKIE_OPTIONS.REFRESH, maxAge: 0 });
      response.cookies.set(COOKIE_NAMES.SESSION, "", { ...COOKIE_OPTIONS.SESSION, maxAge: 0 });
      return response;
    }
    return NextResponse.json(
      { detail: "Refresh failed." },
      { status: 500 }
    );
  }
}
