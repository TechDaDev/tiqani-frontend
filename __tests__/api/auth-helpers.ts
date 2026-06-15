/**
 * Test helpers for Next.js App Router API route handler tests.
 * Provides factory functions for creating mock NextRequest objects
 * and verifies NextResponse behavior.
 */
import type { NextRequest } from "next/server";

/**
 * Create a minimal mock NextRequest for POST handlers.
 */
export function createMockPostRequest(body: unknown, cookies: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost:3000/api/auth/test");
  const request = {
    url: url.href,
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { value, name } : undefined;
      },
      set: () => {},
      delete: () => {},
    },
    nextUrl: url,
    page: {},
    ua: {},
    body: null,
    bodyUsed: false,
    cache: "default",
    credentials: "same-origin",
    destination: "",
    integrity: "",
    keepalive: false,
    mode: "cors",
    redirect: "follow",
    referrer: "",
    referrerPolicy: "",
    signal: new AbortController().signal,
    clone: () => request,
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(JSON.stringify(body)),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as unknown as NextRequest;
  return request;
}

/**
 * Create a minimal mock NextRequest for GET handlers.
 */
export function createMockGetRequest(cookies: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost:3000/api/auth/test");
  const request = {
    url: url.href,
    method: "GET",
    headers: new Headers(),
    json: () => Promise.resolve({}),
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { value, name } : undefined;
      },
      set: () => {},
      delete: () => {},
    },
    nextUrl: url,
    page: {},
    ua: {},
    body: null,
    bodyUsed: false,
    cache: "default",
    credentials: "same-origin",
    destination: "",
    integrity: "",
    keepalive: false,
    mode: "cors",
    redirect: "follow",
    referrer: "",
    referrerPolicy: "",
    signal: new AbortController().signal,
    clone: () => request,
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(""),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as unknown as NextRequest;
  return request;
}

/**
 * Parse a NextResponse JSON response for assertions.
 */
export async function parseResponse(response: Response): Promise<{
  status: number;
  body: unknown;
  cookies: Array<{ name: string; value: string; options: Record<string, unknown> }>;
}> {
  const body = await response.json();
  return { status: response.status, body, cookies: [] };
}

/**
 * Get the cookies that were set on the response by reading Set-Cookie header.
 */
export function getSetCookies(response: Response): string[] {
  const headers = response.headers;
  const setCookieHeader = headers.get("set-cookie");
  if (!setCookieHeader) return [];
  // Split multiple Set-Cookie headers (joined by Next.js)
  return setCookieHeader.split(", ").filter(Boolean);
}

/**
 * Create a minimal mock NextRequest for PATCH handlers.
 */
export function createMockPatchRequest(
  body: unknown,
  cookies: Record<string, string> = {}
): NextRequest {
  const url = new URL("http://localhost:3000/api/test");
  const request = {
    url: url.href,
    method: "PATCH",
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { value, name } : undefined;
      },
      set: () => {},
      delete: () => {},
    },
    nextUrl: url,
    page: {},
    ua: {},
    body: JSON.stringify(body),
    bodyUsed: false,
    cache: "default" as RequestCache,
    credentials: "same-origin" as RequestCredentials,
    destination: "",
    integrity: "",
    keepalive: false,
    mode: "cors" as RequestMode,
    redirect: "follow" as RequestRedirect,
    referrer: "",
    referrerPolicy: "",
    signal: new AbortController().signal,
    clone: () => request,
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(JSON.stringify(body)),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as unknown as NextRequest;
  return request;
}
