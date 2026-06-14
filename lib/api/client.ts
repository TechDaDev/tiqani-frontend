import { apiConfig } from "./config";

export type ApiError = {
  status: number;
  message: string;
};

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

export async function apiGet<T>(
  path: string,
  options?: { timeout?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeout = options?.timeout ?? apiConfig.timeout;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new ApiClientError(
        response.status,
        `API request failed: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "Request timed out");
    }
    throw new ApiClientError(0, "Network error");
  } finally {
    clearTimeout(timeoutId);
  }
}
