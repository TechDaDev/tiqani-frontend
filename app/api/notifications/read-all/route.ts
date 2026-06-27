import { NextRequest } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError } from "@/lib/api/proxy-utils";

export async function POST(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const { data, status } = await backendPost("/api/notifications/mark-all-read/", {}, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to mark notifications read.");
  }
}
