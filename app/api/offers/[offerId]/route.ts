/**
 * Proxy: Client offer detail.
 * GET /api/offers/[offerId]/ → Backend GET /api/offers/<id>/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { offerId } = await params;

  try {
    const { data, status } = await backendGet<unknown>(
      `/api/offers/${offerId}/`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch offer." }, { status: 500 });
  }
}
