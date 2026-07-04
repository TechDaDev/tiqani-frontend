import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { serverConfig } from "@/lib/api/server-config";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { requireRole } from "@/lib/api/role-guard";

/**
 * GET — Fetch technician profile from Django's /api/technicians/me/
 */
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

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
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const response = await fetch(`${serverConfig.backendInternalUrl}/api/technicians/me/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const responseContentType = response.headers.get("content-type") || "";
      const data = responseContentType.includes("application/json")
        ? await response.json()
        : { detail: await response.text() };

      return NextResponse.json(data, { status: response.status });
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
