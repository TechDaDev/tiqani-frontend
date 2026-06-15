/**
 * Proxy: Mark conversation as read.
 * POST /api/messages/conversations/:id/mark-read/
 *   → Backend POST /api/chat/rooms/:id/mark-read/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  const { conversationId } = await params;

  try {
    const { data, status } = await backendPost<unknown>(
      `/api/chat/rooms/${conversationId}/mark-read/`,
      {},
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to mark as read." }, { status: 500 });
  }
}
