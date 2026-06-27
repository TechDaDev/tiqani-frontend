import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";
import { authenticateProxy } from "@/lib/api/proxy-auth";
import { proxyError, UuidParam } from "@/lib/api/proxy-utils";
import { ReviewCreateSchema } from "@/lib/reviews/schemas";

export async function POST(request: NextRequest, { params }: { params: Promise<{ contractId: string }> }) {
  const auth = await authenticateProxy(request);
  if (!auth.allowed) return auth.response;
  const { contractId } = await params;
  const parsed = UuidParam.safeParse(contractId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid contract id." }, { status: 400 });
  const body = ReviewCreateSchema.safeParse(await request.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ detail: "Invalid review payload." }, { status: 400 });
  try {
    const { data, status } = await backendPost(`/api/contracts/${parsed.data}/reviews/`, body.data, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to create review.");
  }
}
