import { NextRequest, NextResponse } from "next/server";
import { backendGet } from "@/lib/api/backend-client";
import { proxyError, UuidParam } from "@/lib/api/proxy-utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const parsed = UuidParam.safeParse(userId);
  if (!parsed.success) return NextResponse.json({ detail: "Invalid user id." }, { status: 400 });
  const query = request.nextUrl.searchParams.toString();
  try {
    const { data, status } = await backendGet(`/api/users/${parsed.data}/reputation/${query ? `?${query}` : ""}`);
    return NextResponse.json(data, { status });
  } catch (error) {
    return proxyError(error, "Failed to fetch reputation.");
  }
}
