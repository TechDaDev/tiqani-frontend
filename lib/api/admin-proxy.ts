import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { proxyError, privateJson } from "@/lib/api/proxy-utils";

export async function proxyAdminGet(request: NextRequest, backendPath: string) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const query = request.nextUrl.searchParams.toString();
  try {
    const { data, status } = await backendGet(`${backendPath}${query ? `?${query}` : ""}`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Admin request failed.");
  }
}

export async function proxyAdminPost(request: NextRequest, backendPath: string) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const payload = await request.json().catch(() => ({}));
    const { data, status } = await backendPost(backendPath, payload, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Admin action failed.");
  }
}
