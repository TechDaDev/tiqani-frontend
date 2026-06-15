import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { requireRole } from "@/lib/api/role-guard";

/**
 * GET — Fetch technician availability from Django's /api/technicians/me/availability/
 */
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/technicians/me/availability/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch availability." }, { status: 500 });
  }
}

/**
 * PATCH — Update technician availability on Django's /api/technicians/me/availability/
 */
export async function PATCH(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    const body = await request.json();

    const { data, status } = await backendPatch<Record<string, unknown>>(
      "/api/technicians/me/availability/",
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to update availability." }, { status: 500 });
  }
}
