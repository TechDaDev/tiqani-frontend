/**
 * Browser-side client that calls same-origin Next.js API route handlers.
 * Tokens are managed via HTTP-only cookies — JavaScript never reads them.
 */
import { ApiClientError } from "./errors";

interface BrowserRequestOptions {
  method?: string;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
}

export async function browserRequest<T>(
  path: string,
  options: BrowserRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, timeout = 10_000, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const combinedSignal = signal
    ? combineSignals(signal, controller.signal)
    : controller.signal;

  try {
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
      credentials: "same-origin",
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
          ? ((data as Record<string, unknown>).detail as string) ||
            `Request failed: ${response.status}`
          : `Request failed: ${response.status}`;

      const fieldErrors = extractFieldErrors(data);

      throw new ApiClientError(response.status, message, { fieldErrors });
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "Request timed out");
    }
    throw new ApiClientError(0, "Network error. Please check your connection.");
  }
}

function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const fieldErrors: Record<string, string[]> = {};
  // Check for Next.js proxied field_errors
  const d = data as Record<string, unknown>;
  if (d.field_errors && typeof d.field_errors === "object") {
    for (const [key, value] of Object.entries(d.field_errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map((v) => String(v));
      }
    }
  }
  // Also check for raw field errors from Django
  for (const [key, value] of Object.entries(d)) {
    if (["detail", "non_field_errors", "message", "error", "field_errors"].includes(key)) continue;
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      fieldErrors[key] = value.map((v) => String(v));
    }
  }
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort(sig.reason);
      return controller.signal;
    }
    sig.addEventListener("abort", () => controller.abort(sig.reason), {
      once: true,
    });
  }
  return controller.signal;
}
