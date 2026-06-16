/**
 * Offer API functions (server-side proxy calls).
 */
import { serverConfig } from "./server-config";
import { ApiClientError } from "./errors";

interface BackendRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

async function backendRequest<T>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<{ status: number; data: T }> {
  const { method = "GET", body, headers = {}, timeout = serverConfig.timeout } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${serverConfig.backendInternalUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    if (!response.ok) {
      const detail = typeof data === "object" && data ? (data as Record<string, unknown>).detail as string || response.statusText : response.statusText;
      throw new ApiClientError(response.status, detail);
    }
    return { status: response.status, data: data as T };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ---- Technician offers ----

export async function fetchTechnicianOffers(token: string, status?: string) {
  const params = status ? `?status=${status}` : "";
  return backendRequest(`/api/technician/offers/${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createTechnicianOffer(token: string, payload: Record<string, unknown>) {
  return backendRequest("/api/technician/offers/", {
    method: "POST",
    body: payload,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchTechnicianOfferDetail(token: string, offerId: string) {
  return backendRequest(`/api/technician/offers/${offerId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateTechnicianOffer(token: string, offerId: string, payload: Record<string, unknown>) {
  return backendRequest(`/api/technician/offers/${offerId}/`, {
    method: "PATCH",
    body: payload,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function submitTechnicianOffer(token: string, offerId: string) {
  return backendRequest(`/api/technician/offers/${offerId}/submit/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function withdrawTechnicianOffer(token: string, offerId: string) {
  return backendRequest(`/api/technician/offers/${offerId}/withdraw/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Client offers ----

export async function fetchClientOffers(token: string, status?: string) {
  const params = status ? `?status=${status}` : "";
  return backendRequest(`/api/offers/${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchClientOfferDetail(token: string, offerId: string) {
  return backendRequest(`/api/offers/${offerId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function acceptClientOffer(token: string, offerId: string) {
  return backendRequest(`/api/offers/${offerId}/accept/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function rejectClientOffer(token: string, offerId: string) {
  return backendRequest(`/api/offers/${offerId}/reject/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- By-request lookup ----

export async function fetchOffersByRequest(token: string, requestId: string) {
  return backendRequest(`/api/offers/by-request/${requestId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Contracts ----

export async function fetchContractDetail(token: string, contractId: string) {
  return backendRequest(`/api/contracts/${contractId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
