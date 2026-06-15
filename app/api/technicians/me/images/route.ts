import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { requireRole } from "@/lib/api/role-guard";

/**
 * GET — Fetch technician portfolio images from Django's /api/technicians/me/images/
 */
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/technicians/me/images/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch images." }, { status: 500 });
  }
}

/**
 * POST — Upload a portfolio image to Django's /api/technicians/me/images/
 * Expects multipart/form-data (image file).
 */
export async function POST(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    const formData = await request.formData();

    const response = await fetch(
      `${process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"}/api/technicians/me/images/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Do NOT set Content-Type — browser sets multipart boundary automatically
        },
        body: formData,
      }
    );

    let data: Record<string, unknown>;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = (await response.json()) as Record<string, unknown>;
    } else {
      data = { detail: await response.text() };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to upload image." }, { status: 500 });
  }
}
