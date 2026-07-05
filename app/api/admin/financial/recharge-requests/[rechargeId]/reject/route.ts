import { NextRequest } from "next/server";
import { proxyAdminPost } from "@/lib/api/admin-proxy";
import { privateJson, UuidParam } from "@/lib/api/proxy-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rechargeId: string }> }
) {
  const { rechargeId } = await params;
  const parsed = UuidParam.safeParse(rechargeId);
  if (!parsed.success) return privateJson({ detail: "Invalid recharge request id." }, { status: 400 });
  return proxyAdminPost(request, `/api/admin/financial/recharge-requests/${parsed.data}/reject/`);
}
