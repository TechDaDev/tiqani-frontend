import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  try {
    const { data, status } = await backendGet<Record<string, unknown>>(
      `/api/contracts/${contractId}/milestones/`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to list milestones." },
      { status: apiError.status || 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const body = await request.json();
  try {
    const { data, status } = await backendPost<Record<string, unknown>>(
      `/api/contracts/${contractId}/milestones/`,
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    return NextResponse.json(
      { detail: apiError.message || "Failed to create milestone." },
      { status: apiError.status || 500 }
    );
  }
}
