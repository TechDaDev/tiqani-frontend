import { NextRequest } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError } from "@/lib/api/proxy-utils";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const query = request.nextUrl.searchParams.toString();
  try {
    const { data, status } = await backendGet(`/api/notifications/${query ? `?${query}` : ""}`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch notifications.");
  }
}
