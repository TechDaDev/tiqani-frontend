import { NextRequest, NextResponse } from "next/server";
import { serverConfig } from "@/lib/api/server-config";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { UuidParam } from "@/lib/api/proxy-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rechargeId: string }> }
) {
  const { rechargeId } = await params;
  const parsed = UuidParam.safeParse(rechargeId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid recharge request id." }, { status: 400 });
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;

  const response = await fetch(`${serverConfig.backendInternalUrl}/api/admin/financial/recharge-requests/${parsed.data}/receipt/`, {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return new NextResponse(response.body, { status: response.status, headers });
}
