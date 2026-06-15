/**
 * Proxy: Conversation list & create.
 * GET  /api/messages/conversations/ → Backend GET  /api/chat/rooms/
 * POST /api/messages/conversations/ → Backend POST /api/chat/rooms/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const params = searchParams.toString();
    const { data, status } = await backendGet<unknown>(
      `/api/chat/rooms/${params ? `?${params}` : ""}`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch conversations." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  try {
    const body = await request.json();
    const { data, status } = await backendPost<unknown>(
      "/api/chat/rooms/",
      body,
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
