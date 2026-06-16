/**
 * Proxy: Contract detail.
 * GET /api/contracts/[contractId]/ → Backend GET /api/contracts/<id>/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { contractId } = await params;

  try {
    const { data, status } = await backendGet<unknown>(
      `/api/contracts/${contractId}/`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch contract." }, { status: 500 });
  }
}
