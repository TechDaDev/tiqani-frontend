import { NextRequest } from "next/server";
import { proxyAdminGet } from "@/lib/api/admin-proxy";
import { privateJson, UuidParam } from "@/lib/api/proxy-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rechargeId: string }> }
) {
  const { rechargeId } = await params;
  const parsed = UuidParam.safeParse(rechargeId);
  if (!parsed.success) return privateJson({ detail: "Invalid recharge request id." }, { status: 400 });
  return proxyAdminGet(request, `/api/admin/financial/recharge-requests/${parsed.data}/`);
}
