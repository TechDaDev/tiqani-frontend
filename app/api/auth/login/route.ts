import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { detail: "Username and password are required." },
        { status: 400 }
      );
    }

    const { data, status } = await backendPost<{
      access: string;
      refresh: string;
      userdata: Record<string, unknown>;
    }>("/api/auth/login/", { username, password });

    const response = NextResponse.json(
      { userdata: data.userdata },
      { status }
    );

    response.cookies.set(COOKIE_NAMES.ACCESS, data.access, COOKIE_OPTIONS.ACCESS);
    response.cookies.set(COOKIE_NAMES.REFRESH, data.refresh, COOKIE_OPTIONS.REFRESH);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string; fieldErrors?: Record<string, string[]> };
      return NextResponse.json(
        { detail: apiError.message, field_errors: apiError.fieldErrors },
        { status: apiError.status }
      );
    }
    return NextResponse.json(
      { detail: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
