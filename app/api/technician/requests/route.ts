/**
 * Proxy: Technician request list.
 * GET /api/technician/requests/ → Backend GET /api/technician/requests/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request, "technician");
  if (!auth.allowed) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const params = searchParams.toString();
    const { data, status } = await backendGet<unknown>(
      `/api/technician/requests/${params ? `?${params}` : ""}`,
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
