import { NextResponse } from "next/server";
import { z } from "zod";

export const UuidParam = z.string().uuid();

export function proxyError(error: unknown, fallback = "Request failed.") {
  const apiError = error as { status?: number; message?: string; backendData?: unknown };
  const backendData =
    apiError.backendData && typeof apiError.backendData === "object"
      ? (apiError.backendData as Record<string, unknown>)
      : {};
  return NextResponse.json(
    {
      ...backendData,
      detail: typeof backendData.detail === "string" ? backendData.detail : apiError.message || fallback,
    },
    { status: apiError.status || 500 }
  );
}

export function privateJson(data: unknown, init: ResponseInit = {}) {
  const response = NextResponse.json(data, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
