/**
 * Reference — Skills listing proxy.
 * Proxies GET /api/categories/skills/ from Django.
 * No auth required — public endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";

export async function GET() {
  try {
    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/categories/skills/"
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch skills." }, { status: 500 });
  }
}
