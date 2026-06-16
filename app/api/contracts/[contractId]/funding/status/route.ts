import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * GET — Get contract funding status.
 * Proxies to Django: GET /api/wallet/contracts/{id}/funding/status/
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  try {
    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/wallet/contracts/${contractId}/funding/status/`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to get funding status." },
      { status: apiError.status || 500 }
    );
  }
}
