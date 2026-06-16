import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * POST — Confirm sandbox payment (success or failure).
 * Proxies to Django: POST /api/wallet/payment-intents/{id}/sandbox-confirm/
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  try {
    const body = await request.json().catch(() => ({}));
    const { data, status } = await backendPost<Record<string, unknown>>(
      `/api/wallet/payment-intents/${paymentId}/sandbox-confirm/`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to confirm sandbox payment." },
      { status: apiError.status || 500 }
    );
  }
}
