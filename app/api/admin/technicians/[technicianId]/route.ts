import { NextRequest } from "next/server";
import { proxyAdminGet } from "@/lib/api/admin-proxy";
import { UuidParam } from "@/lib/api/proxy-utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ technicianId: string }> }) {
  const { technicianId } = await params;
  const parsed = UuidParam.safeParse(technicianId);
  if (!parsed.success) return Response.json({ detail: "Invalid technician id." }, { status: 400 });
  return proxyAdminGet(request, `/api/admin/technicians/${parsed.data}/`);
}
