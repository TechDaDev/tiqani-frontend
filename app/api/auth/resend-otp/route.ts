import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { detail: "Email is required." },
        { status: 400 }
      );
    }

    const { data, status } = await backendPost<{
      detail: string;
      email: string;
      resends_remaining?: number;
    }>("/api/auth/resend-otp/", { email });

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json(
        { detail: apiError.message },
        { status: apiError.status }
      );
    }
    return NextResponse.json(
      { detail: "Failed to resend code. Please try again." },
      { status: 500 }
    );
  }
}
