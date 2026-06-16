/**
 * Proxy: Client offer accept.
 * POST /api/offers/[offerId]/accept/ → Backend POST /api/offers/<id>/accept/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { offerId } = await params;

  try {
    const { data, status } = await backendPost<unknown>(
      `/api/offers/${offerId}/accept/`,
      {},
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to accept offer." }, { status: 500 });
  }
}
