import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  try {
    const { data, status } = await backendGet<Record<string, unknown>[]>(
      "/api/wallet/withdrawals/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed." }, { status: apiError.status || 500 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* empty */ }
  try {
    const { data, status } = await backendPost<Record<string, unknown>>(
      "/api/wallet/withdrawals/", body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed to create withdrawal." }, { status: apiError.status || 500 });
  }
}
