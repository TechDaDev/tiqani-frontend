import { NextRequest } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError, UuidParam } from "@/lib/api/proxy-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rechargeId: string }> }
) {
  const { rechargeId } = await params;
  const parsed = UuidParam.safeParse(rechargeId);
  if (!parsed.success) return privateJson({ detail: "Invalid recharge request id." }, { status: 400 });
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const { data, status } = await backendGet(`/api/wallet/recharge-requests/${parsed.data}/`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch recharge request.");
  }
}
