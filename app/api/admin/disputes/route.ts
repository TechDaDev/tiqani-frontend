import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const params = request.nextUrl.searchParams;
  const qs = new URLSearchParams();
  if (params.get("status")) qs.set("status", params.get("status")!);
  if (params.get("category")) qs.set("category", params.get("category")!);
  const q = qs.toString();
  try {
    const { data, status } = await backendGet<Record<string, unknown>[]>(
      `/api/admin/disputes/${q ? `?${q}` : ""}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed." }, { status: apiError.status || 500 });
  }
}
