/**
 * Proxy: Technician request detail.
 * GET /api/technician/requests/[requestId]/ → Backend GET /api/technician/requests/<id>/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const auth = await authenticateProxy(request, "technician");
  if (!auth.allowed) return auth.response;

  const { requestId } = await params;
  try {
    const { data, status } = await backendGet<unknown>(
      `/api/technician/requests/${requestId}/`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch request." }, { status: 500 });
  }
}
