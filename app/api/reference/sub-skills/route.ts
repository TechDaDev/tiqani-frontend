/**
 * Reference — Sub-skills listing proxy.
 * Proxies GET /api/categories/sub-skills/ from Django.
 * No auth required — public endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";

export async function GET(request: NextRequest) {
  try {
    const qs = request.nextUrl.searchParams.toString();
    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/categories/sub-skills/${qs ? `?${qs}` : ""}`
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch sub-skills." }, { status: 500 });
  }
}
