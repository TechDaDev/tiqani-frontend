import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  try {
    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/wallet/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to fetch wallet." },
      { status: apiError.status || 500 }
    );
  }
}
