import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { requireRole } from "@/lib/api/role-guard";

/**
 * GET — Fetch technician ratings from Django's /api/technicians/me/ratings/
 */
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/technicians/me/ratings/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch ratings." }, { status: 500 });
  }
}
