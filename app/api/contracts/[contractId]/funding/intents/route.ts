import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * POST — Create a payment intent for contract funding.
 * Proxies to Django: POST /api/wallet/contracts/{id}/funding/intents/
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  try {
    const { data, status } = await backendPost<Record<string, unknown>>(
      `/api/wallet/contracts/${contractId}/funding/intents/`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to create payment intent." },
      { status: apiError.status || 500 }
    );
  }
}
