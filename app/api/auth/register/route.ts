import { NextRequest, NextResponse } from "next/server";
import { backendPost } from "@/lib/api/backend-client";

const REGISTER_BACKEND_TIMEOUT_MS = 35_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, first_name, last_name, role, phone_number, governorate, address, gender, date_of_birth, job_title, about, years_of_expertise } = body;

    if (!username || !email || !password || !first_name || !last_name || !role) {
      return NextResponse.json(
        { detail: "Required fields: username, email, password, first_name, last_name, role." },
        { status: 400 }
      );
    }

    const { data, status } = await backendPost<{ detail: string; email: string }>(
      "/api/auth/register/",
      { username, email, password, first_name, last_name, role, phone_number, governorate, address, gender, date_of_birth, job_title, about, years_of_expertise },
      { timeout: REGISTER_BACKEND_TIMEOUT_MS }
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
      { detail: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
