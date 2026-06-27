import { NextRequest } from "next/server";
import { proxyAdminGet } from "@/lib/api/admin-proxy";

export async function GET(request: NextRequest) {
  return proxyAdminGet(request, "/api/admin/platform-health/");
}
