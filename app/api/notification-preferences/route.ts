import { NextRequest } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError } from "@/lib/api/proxy-utils";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const { data, status } = await backendGet("/api/notifications/preferences/", {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch preferences.");
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const body = await request.json().catch(() => ({}));
    const { data, status } = await backendPatch("/api/notifications/preferences/", body, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to update preferences.");
  }
}
