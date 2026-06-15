/**
 * Proxy: Get/create conversation for a service request.
 * GET  /api/messages/by-request/:id/ → Backend GET  /api/chat/rooms/by-request/:id/
 * POST /api/messages/by-request/:id/ → Backend POST /api/chat/rooms/by-request/:id/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  const { requestId } = await params;

  try {
    const { data, status } = await backendGet<unknown>(
      `/api/chat/rooms/by-request/${requestId}/`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch conversation." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  const { requestId } = await params;

  try {
    const { data, status } = await backendPost<unknown>(
      `/api/chat/rooms/by-request/${requestId}/`,
      {},
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to create conversation." }, { status: 500 });
  }
}
