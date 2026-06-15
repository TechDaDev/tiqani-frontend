import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * GET — Fetch incomplete profile fields from Django's /api/auth/profile/incomplete-fields/
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    if (!accessToken) {
      return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
    }

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/auth/profile/incomplete-fields/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch incomplete fields." }, { status: 500 });
  }
}
