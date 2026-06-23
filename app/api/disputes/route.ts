import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const statusFilter = request.nextUrl.searchParams.get("status");
  let path = "/api/disputes/";
  if (statusFilter) path += `?status=${statusFilter}`;
  try {
    const { data, status } = await backendGet<Record<string, unknown>[]>(path, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed." }, { status: apiError.status || 500 });
  }
}
