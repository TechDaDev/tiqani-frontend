import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { detail: "Not authenticated." },
        { status: 401 }
      );
    }

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/accounts/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      // If 401, access token may be expired — client can try refresh
      return NextResponse.json(
        { detail: apiError.message },
        { status: apiError.status }
      );
    }
    return NextResponse.json(
      { detail: "Failed to fetch user." },
      { status: 500 }
    );
  }
}
