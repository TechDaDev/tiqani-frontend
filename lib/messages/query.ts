/**
 * Messaging API hooks using plain fetch (no React Query dependency).
 * Uses browserRequest for same-origin proxy routing with HTTP-only cookies.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import {
  mapConversation,
  mapConversationDetail,
  mapMessage,
  mapUnreadSummary,
} from "./mappers";
import { sendMessageSchema } from "./schemas";
import type {
  Conversation,
  ConversationDetail,
  Message,
  UnreadSummary,
  SendMessagePayload,
} from "./types";

// ---- Conversation list ----

export function useConversations() {
  const [data, setData] = useState<Conversation[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<unknown[]>("/api/messages/conversations/");
      setData((raw ?? []).map((r) => mapConversation(r as Record<string, unknown>)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load conversations"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

// ---- Conversation detail ----

export function useConversationDetail(conversationId: string) {
  const [data, setData] = useState<ConversationDetail | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(
        `/api/messages/conversations/${conversationId}/`
      );
      setData(raw ? mapConversationDetail(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load conversation"));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, refetch: fetch };
}

// ---- Messages ----

export function useMessages(conversationId: string) {
  const [data, setData] = useState<Message[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetch = useCallback(async (before?: string) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = before ? `?before=${before}` : "";
      const raw = await browserRequest<unknown[]>(
        `/api/messages/conversations/${conversationId}/messages/${params}`
      );
      const messages = (raw ?? []).map((r) => mapMessage(r as Record<string, unknown>));
      if (before) {
        setData((prev) => [...(messages as Message[]), ...(prev ?? [])]);
      } else {
        setData(messages as Message[]);
      }
      setHasMore(messages.length >= 50);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load messages"));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const loadOlder = useCallback(async () => {
    if (!data || data.length === 0 || !hasMore || isLoading) return;
    const oldestId = data[0]?.id;
    if (oldestId) {
      await fetch(oldestId);
    }
  }, [data, hasMore, isLoading, fetch]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, hasMore, loadOlder, refetch: () => fetch() };
}

// ---- Send message ----

export function useSendMessage(conversationId: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (payload: SendMessagePayload): Promise<Message> => {
      const parsed = sendMessageSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message ?? "Invalid message");
      }

      setIsPending(true);
      setError(null);
      try {
        const raw = await browserRequest<Record<string, unknown>>(
          `/api/messages/conversations/${conversationId}/messages/send/`,
          { method: "POST", body: parsed.data }
        );
        return mapMessage(raw);
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Failed to send message");
        setError(e);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [conversationId]
  );

  return { mutate, isPending, error };
}

// ---- Mark conversation read ----

export function useMarkRead(conversationId: string) {
  const mutate = useCallback(async () => {
    try {
      await browserRequest<unknown>(
        `/api/messages/conversations/${conversationId}/mark-read/`,
        { method: "POST" }
      );
    } catch {
      // Best-effort — read state is not critical
    }
  }, [conversationId]);

  return { mutate };
}

// ---- Unread count ----

export function useUnreadCount() {
  const [data, setData] = useState<UnreadSummary | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    try {
      const raw = await browserRequest<Record<string, unknown>>(
        "/api/messages/unread-count/"
      );
      setData(mapUnreadSummary(raw));
    } catch {
      // Silent fail for polling
    }
  }, []);

  const startPolling = useCallback(() => {
    fetch();
    intervalRef.current = setInterval(fetch, 30000); // 30s polling
  }, [fetch]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { data, fetch, startPolling, stopPolling };
}

// ---- Request-linked conversation ----

export function useRequestConversation(requestId: string) {
  const [data, setData] = useState<ConversationDetail | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(
        `/api/messages/by-request/${requestId}/`
      );
      setData(raw ? mapConversationDetail(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load conversation"));
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  const create = useCallback(async () => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(
        `/api/messages/by-request/${requestId}/`,
        { method: "POST" }
      );
      setData(mapConversationDetail(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create conversation"));
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  if (data === undefined && !error && isLoading) {
    fetch();
  }

  return { data, isLoading, error, create, refetch: fetch };
}
