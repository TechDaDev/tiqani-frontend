import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { proxyError, UuidParam } from "@/lib/api/proxy-utils";
import { ReviewReportSchema } from "@/lib/reviews/schemas";

export async function POST(request: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { reviewId } = await params;
  const parsed = UuidParam.safeParse(reviewId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid review id." }, { status: 400 });
  const body = ReviewReportSchema.safeParse(await request.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ detail: "Invalid report payload." }, { status: 400 });
  try {
    const { data, status } = await backendPost(`/api/reviews/${parsed.data}/report/`, body.data, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to report review.");
  }
}
