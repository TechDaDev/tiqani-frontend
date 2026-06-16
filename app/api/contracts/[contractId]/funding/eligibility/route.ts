import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * GET — Check if contract is eligible for funding.
 * Proxies to Django: GET /api/wallet/contracts/{id}/funding/eligibility/
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  try {
    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/wallet/contracts/${contractId}/funding/eligibility/`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to check funding eligibility." },
      { status: apiError.status || 500 }
    );
  }
}
