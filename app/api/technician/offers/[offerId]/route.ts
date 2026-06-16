/**
 * Proxy: Technician offer detail & update.
 * GET   /api/technician/offers/[offerId]/  → Backend GET  /api/technician/offers/<id>/
 * PATCH /api/technician/offers/[offerId]/  → Backend PATCH /api/technician/offers/<id>/
 */
import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { offerId } = await params;

  try {
    const { data, status } = await backendGet<unknown>(
      `/api/technician/offers/${offerId}/`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to fetch offer." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { offerId } = await params;

  try {
    const body = await request.json();
    const { data, status } = await backendPatch<unknown>(
      `/api/technician/offers/${offerId}/`,
      body,
      { headers: { Authorization: `Bearer ${auth.accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to update offer." }, { status: 500 });
  }
}
