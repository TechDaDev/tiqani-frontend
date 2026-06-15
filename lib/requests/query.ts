/**
 * Service request API hooks using plain fetch (no React Query dependency).
 * Uses browserRequest for same-origin proxy routing with HTTP-only cookies.
 */

"use client";

import { useState, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { mapServiceRequest } from "./mappers";
import type { ServiceRequest, CreateServiceRequestPayload, RequestListFilters } from "./types";

// ---- Client requests ----

export function useClientRequests(filters?: RequestListFilters) {
  const [data, setData] = useState<ServiceRequest[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filters?.status ? `?status=${filters.status}` : "";
      const raw = await browserRequest<unknown[]>(`/api/requests/${params}`);
      setData((raw ?? []).map((r) => mapServiceRequest(r as Record<string, unknown>)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load requests"));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

  // Fetch on first call
  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

export function useClientRequestDetail(requestId: string) {
  const [data, setData] = useState<ServiceRequest | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(`/api/requests/${requestId}/`);
      setData(raw ? mapServiceRequest(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load request"));
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

export function useCreateRequest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (payload: CreateServiceRequestPayload): Promise<ServiceRequest> => {
    setIsPending(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>("/api/requests/", {
        method: "POST",
        body: payload as unknown as Record<string, unknown>,
      });
      return mapServiceRequest(raw);
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to create request");
      setError(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutate, isPending, error };
}

export function useCancelRequest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (requestId: string) => {
    setIsPending(true);
    setError(null);
    try {
      await browserRequest(`/api/requests/${requestId}/cancel/`, { method: "POST", body: {} });
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to cancel request");
      setError(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutate, isPending, error };
}

export function useWithdrawRequest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (requestId: string) => {
    setIsPending(true);
    setError(null);
    try {
      await browserRequest(`/api/requests/${requestId}/withdraw/`, { method: "POST", body: {} });
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to withdraw request");
      setError(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutate, isPending, error };
}

// ---- Technician requests ----

export function useTechnicianRequests(filters?: RequestListFilters) {
  const [data, setData] = useState<ServiceRequest[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filters?.status ? `?status=${filters.status}` : "";
      const raw = await browserRequest<unknown[]>(`/api/technician/requests/${params}`);
      setData((raw ?? []).map((r) => mapServiceRequest(r as Record<string, unknown>)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load requests"));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

export function useTechnicianRequestDetail(requestId: string) {
  const [data, setData] = useState<ServiceRequest | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(`/api/technician/requests/${requestId}/`);
      setData(raw ? mapServiceRequest(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load request"));
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

export function useAcceptRequest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (requestId: string) => {
    setIsPending(true);
    setError(null);
    try {
      await browserRequest(`/api/technician/requests/${requestId}/accept/`, { method: "POST", body: {} });
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to accept request");
      setError(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutate, isPending, error };
}

export function useDeclineRequest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (requestId: string) => {
    setIsPending(true);
    setError(null);
    try {
      await browserRequest(`/api/technician/requests/${requestId}/decline/`, { method: "POST", body: {} });
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to decline request");
      setError(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutate, isPending, error };
}
