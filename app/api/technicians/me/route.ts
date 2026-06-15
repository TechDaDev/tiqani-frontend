import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

/**
 * GET — Fetch technician profile from Django's /api/technicians/me/
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    if (!accessToken) {
      return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
    }

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/technicians/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
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

/**
 * PATCH — Update technician profile on Django's /api/technicians/me/
 */
export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    if (!accessToken) {
      return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();

    const { data, status } = await backendPatch<Record<string, unknown>>(
      "/api/technicians/me/",
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to update technician profile." }, { status: 500 });
  }
}
