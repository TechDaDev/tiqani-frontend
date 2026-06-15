/**
 * Server-side HTTP client for backend-to-backend communication with Django.
 * Used exclusively in Next.js API route handlers (never in browser code).
 */
import { serverConfig } from "./server-config";
import { ApiClientError } from "./errors";

interface BackendRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function backendRequest<T>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<{ status: number; data: T; headers: Headers }> {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = serverConfig.timeout,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${serverConfig.backendInternalUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: T;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = (await response.json()) as T;
    } else {
      data = (await response.text()) as unknown as T;
    }

    if (!response.ok) {
      const message =
        typeof data === "object" && data !== null
          ? (data as Record<string, unknown>).detail as string || `Backend error: ${response.status}`
          : `Backend error: ${response.status}`;
      throw new ApiClientError(response.status, message, {
        fieldErrors: extractFieldErrors(data),
        backendData: data,
      });
    }

    return { status: response.status, data, headers: response.headers };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "Backend request timed out");
    }
    throw new ApiClientError(502, "Backend unavailable");
  }
}

function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const fieldErrors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (["detail", "non_field_errors", "message", "error"].includes(key)) continue;
    if (Array.isArray(value)) {
      fieldErrors[key] = value.map((v) => String(v));
    }
  }
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function backendGet<T>(
  path: string,
  options?: BackendRequestOptions
): Promise<{ status: number; data: T; headers: Headers }> {
  return backendRequest<T>(path, { ...options, method: "GET" });
}

export async function backendPost<T>(
  path: string,
  body?: unknown,
  options?: BackendRequestOptions
): Promise<{ status: number; data: T; headers: Headers }> {
  return backendRequest<T>(path, { ...options, method: "POST", body });
}

export async function backendPatch<T>(
  path: string,
  body?: unknown,
  options?: BackendRequestOptions
): Promise<{ status: number; data: T; headers: Headers }> {
  return backendRequest<T>(path, { ...options, method: "PATCH", body });
}
