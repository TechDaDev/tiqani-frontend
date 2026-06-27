import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { proxyError, UuidParam } from "@/lib/api/proxy-utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ contractId: string }> }) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { contractId } = await params;
  const parsed = UuidParam.safeParse(contractId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid contract id." }, { status: 400 });
  try {
    const { data, status } = await backendGet(`/api/contracts/${parsed.data}/review-eligibility/`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch review eligibility.");
  }
}
