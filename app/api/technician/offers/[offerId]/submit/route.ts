/**
 * Proxy: Technician offer submit.
 * POST /api/technician/offers/[offerId]/submit/ → Backend POST /api/technician/offers/<id>/submit/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const auth = await authenticateProxy(request, "technician");
  if (!auth.allowed) return auth.response;
  const { offerId } = await params;

  try {
    const { data, status } = await backendPost<unknown>(
      `/api/technician/offers/${offerId}/submit/`,
      {},
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to submit offer." }, { status: 500 });
  }
}
