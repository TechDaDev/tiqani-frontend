/**
 * Marketplace — Public technician listing proxy.
 * Proxies GET /api/technicians/ from Django with query params.
 * No auth required — public endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParams.toString();

    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/technicians/${params ? `?${params}` : ""}`
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch technicians." }, { status: 500 });
  }
}
