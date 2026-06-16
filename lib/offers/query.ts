/**
 * Offer and contract API hooks.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import type { Offer, OfferStatus, AcceptOfferResponse, OfferListFilters } from "./types";

function mapOffer(raw: Record<string, unknown>): Offer {
  return {
    id: raw.id as string,
    service_request: raw.service_request as string,
    request: raw.request as Offer["request"],
    technician: raw.technician as Offer["technician"],
    client: raw.client as Offer["client"],
    amount: raw.amount as string,
    currency: raw.currency as string,
    description: raw.description as string,
    duration_days: raw.duration_days as number | undefined,
    status: raw.status as OfferStatus,
    request_title: raw.request_title as string | undefined,
    request_status: raw.request_status as string | undefined,
    can_edit: raw.can_edit as boolean,
    can_withdraw: raw.can_withdraw as boolean,
    is_terminal: raw.is_terminal as boolean,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  };
}

// ---- Technician offers ----

export function useTechnicianOffers(filters?: OfferListFilters) {
  const [data, setData] = useState<Offer[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filters?.status ? `?status=${filters.status}` : "";
      const raw = await browserRequest<unknown[]>(`/api/technician/offers/${params}`);
      setData((raw ?? []).map((r) => mapOffer(r as Record<string, unknown>)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load offers"));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}

export function useTechnicianOfferDetail(offerId: string) {
  const [data, setData] = useState<Offer | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!offerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(`/api/technician/offers/${offerId}/`);
      setData(raw ? mapOffer(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load offer"));
    } finally {
      setIsLoading(false);
    }
  }, [offerId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}

// ---- Client offers ----

export function useClientOffers(filters?: OfferListFilters) {
  const [data, setData] = useState<Offer[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filters?.status ? `?status=${filters.status}` : "";
      const raw = await browserRequest<unknown[]>(`/api/offers/${params}`);
      setData((raw ?? []).map((r) => mapOffer(r as Record<string, unknown>)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load offers"));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}

export function useClientOfferDetail(offerId: string) {
  const [data, setData] = useState<Offer | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!offerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(`/api/offers/${offerId}/`);
      setData(raw ? mapOffer(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load offer"));
    } finally {
      setIsLoading(false);
    }
  }, [offerId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}

// ---- Actions ----

export async function createOffer(payload: {
  service_request_id: string;
  amount: string;
  description: string;
  duration_days?: number | null;
}): Promise<Offer> {
  const raw = await browserRequest<Record<string, unknown>>("/api/technician/offers/", {
    method: "POST",
    body: payload,
  });
  return mapOffer(raw);
}

export async function updateOffer(offerId: string, payload: Record<string, unknown>): Promise<Offer> {
  const raw = await browserRequest<Record<string, unknown>>(`/api/technician/offers/${offerId}/`, {
    method: "PATCH",
    body: payload,
  });
  return mapOffer(raw);
}

export async function submitOffer(offerId: string): Promise<Offer> {
  const raw = await browserRequest<Record<string, unknown>>(`/api/technician/offers/${offerId}/submit/`, {
    method: "POST",
  });
  return mapOffer(raw);
}

export async function withdrawOffer(offerId: string): Promise<Offer> {
  const raw = await browserRequest<Record<string, unknown>>(`/api/technician/offers/${offerId}/withdraw/`, {
    method: "POST",
  });
  return mapOffer(raw);
}

export async function acceptOffer(offerId: string): Promise<AcceptOfferResponse> {
  return browserRequest<AcceptOfferResponse>(`/api/offers/${offerId}/accept/`, {
    method: "POST",
  });
}

export async function rejectOffer(offerId: string): Promise<Offer> {
  const raw = await browserRequest<Record<string, unknown>>(`/api/offers/${offerId}/reject/`, {
    method: "POST",
  });
  return mapOffer(raw);
}
