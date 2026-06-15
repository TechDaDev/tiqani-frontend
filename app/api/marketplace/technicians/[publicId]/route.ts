/**
 * Marketplace — Public technician detail proxy.
 * Proxies GET /api/technicians/<id>/ from Django.
 * No auth required — public endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;

    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/technicians/${publicId}/`
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch technician profile." }, { status: 500 });
  }
}
