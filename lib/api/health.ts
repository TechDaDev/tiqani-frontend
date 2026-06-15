import { apiGet, ApiClientError } from "./client";
import type { ApiError } from "./client";

export type HealthStatus = {
  status: string;
  [key: string]: unknown;
};

export async function checkHealth(): Promise<{
  ok: boolean;
  data?: HealthStatus;
  error?: string;
}> {
  try {
    const data = await apiGet<HealthStatus>("/api/health/", {
      timeout: 3000,
    });
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Backend unavailable" };
  }
}
