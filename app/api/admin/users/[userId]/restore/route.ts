import { NextRequest } from "next/server";
import { proxyAdminPost } from "@/lib/api/admin-proxy";
import { UuidParam } from "@/lib/api/proxy-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const parsed = UuidParam.safeParse(userId);
  if (!parsed.success) return Response.json({ detail: "Invalid user id." }, { status: 400 });
  return proxyAdminPost(request, `/api/admin/users/${parsed.data}/restore/`);
}
