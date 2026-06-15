/**
 * Proxy: Client request list & create.
 * GET  /api/requests/       → Backend GET  /api/requests/
 * POST /api/requests/       → Backend POST /api/requests/
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
      `/api/requests/${params ? `?${params}` : ""}`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch requests." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  try {
    const body = await request.json();
    const { data, status } = await backendPost<unknown>(
      "/api/requests/",
      body,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to create request." }, { status: 500 });
  }
}
