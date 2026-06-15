import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp_code } = body;

    if (!email || !otp_code) {
      return NextResponse.json(
        { detail: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const { data, status } = await backendPost<{ detail: string; username: string }>(
      "/api/auth/verify-email/",
      { email, otp_code }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string; fieldErrors?: Record<string, string[]> };
      return NextResponse.json(
        { detail: apiError.message, field_errors: apiError.fieldErrors },
        { status: apiError.status }
      );
    }
    return NextResponse.json(
      { detail: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
