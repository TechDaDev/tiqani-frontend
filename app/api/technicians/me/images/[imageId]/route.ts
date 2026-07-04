import { NextRequest, NextResponse } from "next/server";
import { serverConfig } from "@/lib/api/server-config";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { requireRole } from "@/lib/api/role-guard";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  const { imageId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const body = await request.json();

  const response = await fetch(`${serverConfig.backendInternalUrl}/api/technicians/me/images/${imageId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const guard = await requireRole(request, ["technician"]);
  if (!guard.allowed) return guard.response;

  const { imageId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

  const response = await fetch(`${serverConfig.backendInternalUrl}/api/technicians/me/images/${imageId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
