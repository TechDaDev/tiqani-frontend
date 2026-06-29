import { NextRequest, NextResponse } from "next/server";
import { backendGet, backendPatch } from "@/lib/api/backend-client";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { detail: "Not authenticated." },
        { status: 401 }
      );
    }

    const { data, status } = await backendGet<Record<string, unknown>>(
      "/api/accounts/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      // If 401, access token may be expired — client can try refresh
      return NextResponse.json(
        { detail: apiError.message },
        { status: apiError.status }
      );
    }
    return NextResponse.json(
      { detail: "Failed to fetch user." },
      { status: 500 }
    );
  }
}

/**
 * PATCH — Update current user on Django's /api/accounts/me/
 * Allowed fields: first_name, last_name, phone_number, governorate,
 * address, gender, date_of_birth, profile_image
 */
export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
    if (!accessToken) {
      return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const response = await fetch(
        `${process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000"}/api/accounts/me/`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );
      const data = await readProxyResponse(response);
      return NextResponse.json(data, { status: response.status });
    }

    const body = await request.json();

    const { data, status } = await backendPatch<Record<string, unknown>>(
      "/api/accounts/me/",
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
    }
    return NextResponse.json({ detail: "Failed to update user." }, { status: 500 });
  }
}

async function readProxyResponse(response: Response): Promise<Record<string, unknown>> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as Record<string, unknown>;
  }
  return { detail: await response.text() };
}
