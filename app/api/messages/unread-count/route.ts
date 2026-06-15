/**
 * Proxy: Unread count summary.
 * GET /api/messages/unread-count/ → Backend GET /api/chat/rooms/unread-summary/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  try {
    const { data, status } = await backendGet<unknown>(
      "/api/chat/rooms/unread-summary/",
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch unread count." }, { status: 500 });
  }
}
