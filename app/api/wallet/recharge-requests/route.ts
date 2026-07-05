import { NextRequest } from "next/server";
import { serverConfig } from "@/lib/api/server-config";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError } from "@/lib/api/proxy-utils";
import { backendGet } from "@/lib/api/backend-client";

export async function GET(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const query = request.nextUrl.searchParams.toString();
  try {
    const { data, status } = await backendGet(`/api/wallet/recharge-requests/${query ? `?${query}` : ""}`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch recharge requests.");
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  try {
    const formData = await request.formData();
    const response = await fetch(`${serverConfig.backendInternalUrl}/api/wallet/recharge-requests/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    return privateJson(data, { status: response.status });
  } catch (error) {
    return proxyError(error, "Failed to submit recharge request.");
  }
}
