import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  try {
    const body = await request.json();
    const { data, status } = await backendPost<Record<string, unknown>>(
      "/api/disputes/create/",
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to create dispute." },
      { status: apiError.status || 500 }
    );
  }
}
