/**
 * Proxy: Client cancel request.
 * POST /api/requests/[requestId]/cancel/ → Backend POST /api/requests/<id>/cancel/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const auth = await authenticateProxy(request, "client");
  if (!auth.allowed) return auth.response;

  const { requestId } = await params;
  try {
    const { data, status } = await backendPost<unknown>(
      `/api/requests/${requestId}/cancel/`,
      {},
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to cancel request." }, { status: 500 });
  }
}
