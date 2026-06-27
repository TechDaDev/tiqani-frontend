import { NextResponse } from "next/server";
import { z } from "zod";

export const UuidParam = z.string().uuid();

export function proxyError(error: unknown, fallback = "Request failed.") {
  const apiError = error as { status?: number; message?: string };
  return NextResponse.json(
    { detail: apiError.message || fallback },
    { status: apiError.status || 500 }
  );
}

export function privateJson(data: unknown, init: ResponseInit = {}) {
  const response = NextResponse.json(data, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
