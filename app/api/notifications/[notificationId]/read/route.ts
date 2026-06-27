import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError, UuidParam } from "@/lib/api/proxy-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { notificationId } = await params;
  const parsed = UuidParam.safeParse(notificationId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid notification id." }, { status: 400 });
  try {
    const { data, status } = await backendPost(`/api/notifications/${parsed.data}/mark-read/`, {}, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to mark notification read.");
  }
}
