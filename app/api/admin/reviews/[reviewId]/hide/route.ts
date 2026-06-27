import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { privateJson, proxyError, UuidParam } from "@/lib/api/proxy-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { reviewId } = await params;
  const parsed = UuidParam.safeParse(reviewId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid review id." }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  try {
    const { data, status } = await backendPost(`/api/admin/reviews/${parsed.data}/hide/`, body, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return privateJson(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to hide review.");
  }
}
