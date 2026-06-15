import { apiConfig } from "./config";
import { ApiClientError, type ApiError } from "./errors";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshPromise(promise: Promise<boolean> | null) {
  refreshPromise = promise;
}

export function getRefreshPromise(): Promise<boolean> | null {
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, timeout = apiConfig.timeout, signal, credentials } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const combinedSignal = signal ? combineSignals(signal, controller.signal) : controller.signal;
  const isFormData = body instanceof FormData;
  const token = getAccessToken();

  try {
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
      credentials: credentials ?? "include",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await parseErrorBody(response);
      throw new ApiClientError(response.status, err.message, { code: err.code, fieldErrors: err.fieldErrors });
    }

    if (response.status === 204 || response.status === 205) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "Request timed out");
    }
    throw new ApiClientError(0, "Network error. Please check your connection.");
  }
}

export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "POST", body });
}

export async function apiPatch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PATCH", body });
}

async function parseErrorBody(response: Response): Promise<{ message: string; code?: string; fieldErrors?: Record<string, string[]> }> {
  try {
    const data = await response.json();
    return normalizeError(data);
  } catch {
    return { message: `HTTP ${response.status}` };
  }
}

function normalizeError(data: any): { message: string; code?: string; fieldErrors?: Record<string, string[]> } {
  const result: { message: string; code?: string; fieldErrors?: Record<string, string[]> } = { message: "An error occurred" };
  if (typeof data === "string") { result.message = data; return result; }
  if (data.detail) result.message = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
  else if (data.non_field_errors) result.message = data.non_field_errors.join(", ");
  else if (data.message) result.message = data.message;
  else if (data.error) result.message = data.error;

  const fieldErrors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(data)) {
    if (["detail", "non_field_errors", "message", "error"].includes(key)) continue;
    if (Array.isArray(value)) fieldErrors[key] = value.map((v) => (typeof v === "string" ? v : String(v)));
  }
  if (Object.keys(fieldErrors).length > 0) result.fieldErrors = fieldErrors;
  return result;
}

function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) { controller.abort(sig.reason); return controller.signal; }
    sig.addEventListener("abort", () => controller.abort(sig.reason), { once: true });
  }
  return controller.signal;
}

export type { ApiError };
export { ApiClientError };
