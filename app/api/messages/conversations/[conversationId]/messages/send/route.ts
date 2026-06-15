/**
 * Proxy: Send a message.
 * POST /api/messages/conversations/:id/messages/send/
 *   → Backend POST /api/chat/rooms/:id/messages/send/
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
    const body = await request.json();
    const { data, status } = await backendPost<unknown>(
      `/api/chat/rooms/${conversationId}/messages/send/`,
      body,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to send message." }, { status: 500 });
  }
}
