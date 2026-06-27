import { NextRequest } from "next/server";
import { proxyAdminPost } from "@/lib/api/admin-proxy";
import { UuidParam } from "@/lib/api/proxy-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ technicianId: string }> }) {
  const { technicianId } = await params;
  const parsed = UuidParam.safeParse(technicianId);
  if (!parsed.success) return Response.json({ detail: "Invalid technician id." }, { status: 400 });
  return proxyAdminPost(request, `/api/admin/technicians/${parsed.data}/suspend/`);
}
