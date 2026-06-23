import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function POST(request: NextRequest, { params }: { params: Promise<{ chargebackId: string }> }) {
  const { chargebackId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  try {
    const { data, status } = await backendPost<Record<string, unknown>>(
      `/api/admin/chargebacks/${chargebackId}/start-review/`, {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json({ detail: apiError.message || "Failed." }, { status: apiError.status || 500 });
  }
}
