import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ withdrawalId: string }> }
) {
  const { withdrawalId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* empty */ }
  try {
    const { data, status } = await backendPost<Record<string, unknown>>(
      `/api/wallet/admin/withdrawals/${withdrawalId}/sandbox-confirm/`, body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed to confirm." }, { status: apiError.status || 500 });
  }
}
