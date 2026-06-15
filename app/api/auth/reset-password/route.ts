import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp_code, new_password } = body;

    if (!email || !otp_code || !new_password) {
      return NextResponse.json(
        { detail: "Email, OTP code, and new password are required." },
        { status: 400 }
      );
    }

    const { data, status } = await backendPost<{ detail: string }>(
      "/api/auth/password-reset-confirm/",
      { email, otp_code, new_password }
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
      { detail: "Password reset failed." },
      { status: 500 }
    );
  }
}
