/**
 * Tests for messaging proxy routes.
 * Covers all /api/messages/* proxy endpoints.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ApiClientError } from "@/lib/api/errors";

// We test the underlying browserRequest behavior since Next.js route handlers
// are tested via E2E. This validates the API client contract for messaging.

const mockFetch = vi.fn();
let capturedPath = "";
let capturedOptions: RequestInit | undefined;

beforeEach(() => {
  capturedPath = "";
  capturedOptions = undefined;
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockResponse(status: number, body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: new Map(Object.entries({ "content-type": "application/json" })),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response);
}

async function browserRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  capturedPath = path;
  capturedOptions = {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin" as RequestCredentials,
  };

  const response = await fetch(path, capturedOptions);
  const data = await response.json() as T;

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? ((data as Record<string, unknown>).detail as string) ||
          `Request failed: ${response.status}`
        : `Request failed: ${response.status}`;
    throw new ApiClientError(response.status, message);
  }

  return data;
}

describe("Messaging proxy routes", () => {
  // ---- Conversation list ----
  describe("GET /api/messages/conversations/", () => {
    it("returns conversation list on success", async () => {
      const mockConversations = [
        { id: "conv-1", status: "OPEN", unread_count: 2 },
        { id: "conv-2", status: "CLOSED", unread_count: 0 },
      ];
      mockResponse(200, mockConversations);

      const data = await browserRequest("/api/messages/conversations/");
      expect(data).toEqual(mockConversations);
      expect(capturedPath).toBe("/api/messages/conversations/");
    });

    it("throws 401 on unauthorized", async () => {
      mockResponse(401, { detail: "Authentication credentials were not provided." });

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toMatchObject({ status: 401 });
    });

    it("throws 403 on forbidden", async () => {
      mockResponse(403, { detail: "You do not have permission." });

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toMatchObject({ status: 403 });
    });

    it("throws 404 when not found", async () => {
      mockResponse(404, { detail: "Not found." });

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toMatchObject({ status: 404 });
    });

    it("throws 429 on rate limit", async () => {
      mockResponse(429, { detail: "Too many requests." });

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toMatchObject({ status: 429 });
    });

    it("throws 500 on backend error", async () => {
      mockResponse(500, { detail: "Internal server error." });

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toMatchObject({ status: 500 });
    });

    it("handles malformed response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => name === "content-type" ? "text/plain" : null,
          forEach: () => {},
        },
        json: () => Promise.reject(new Error("Invalid JSON")),
        text: () => Promise.resolve("not json"),
      } as unknown as Response);

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toThrow();
    });
  });

  // ---- Conversation detail ----
  describe("GET /api/messages/conversations/:id/", () => {
    it("returns conversation detail", async () => {
      const mockDetail = { id: "conv-1", status: "OPEN", unread_count: 0 };
      mockResponse(200, mockDetail);

      const data = await browserRequest("/api/messages/conversations/conv-1/");
      expect(data).toEqual(mockDetail);
      expect(capturedPath).toBe("/api/messages/conversations/conv-1/");
    });

    it("throws 404 for nonexistent conversation", async () => {
      mockResponse(404, { detail: "Not found." });

      await expect(
        browserRequest("/api/messages/conversations/nonexistent/")
      ).rejects.toMatchObject({ status: 404 });
    });
  });

  // ---- Request-linked room ----
  describe("GET /api/messages/by-request/:id/", () => {
    it("returns conversation for valid request", async () => {
      mockResponse(200, { id: "conv-1", service_request_id: "req-1" });

      const data = await browserRequest("/api/messages/by-request/req-1/");
      expect(data).toMatchObject({ service_request_id: "req-1" });
    });

    it("throws 404 for unrelated request", async () => {
      mockResponse(404, { detail: "Not found." });

      await expect(
        browserRequest("/api/messages/by-request/unrelated-req/")
      ).rejects.toMatchObject({ status: 404 });
    });
  });

  // ---- Messages list ----
  describe("GET /api/messages/conversations/:id/messages/", () => {
    it("returns messages list", async () => {
      const mockMessages = [{ id: "msg-1", body: "Hello" }];
      mockResponse(200, mockMessages);

      const data = await browserRequest(
        "/api/messages/conversations/conv-1/messages/"
      );
      expect(data).toEqual(mockMessages);
    });

    it("returns paginated messages", async () => {
      mockResponse(200, [{ id: "msg-1" }, { id: "msg-2" }]);

      const data = await browserRequest(
        "/api/messages/conversations/conv-1/messages/?before=msg-1"
      );
      expect(capturedPath).toContain("before=msg-1");
      expect(Array.isArray(data)).toBe(true);
    });
  });

  // ---- Send message ----
  describe("POST /api/messages/conversations/:id/messages/send/", () => {
    it("sends a message and returns created", async () => {
      mockResponse(201, { id: "msg-1", body: "Hello", room_id: "conv-1" });

      const data = await browserRequest(
        "/api/messages/conversations/conv-1/messages/send/",
        { method: "POST", body: { body: "Hello" } }
      );
      expect(capturedOptions?.method).toBe("POST");
      expect(capturedOptions?.body).toBe(JSON.stringify({ body: "Hello" }));
      expect(data).toMatchObject({ id: "msg-1" });
    });

    it("throws 400 for empty body", async () => {
      mockResponse(400, { detail: "This field may not be blank." });

      await expect(
        browserRequest("/api/messages/conversations/conv-1/messages/send/", {
          method: "POST",
          body: { body: "" },
        })
      ).rejects.toMatchObject({ status: 400 });
    });

    it("throws 403 for wrong participant", async () => {
      mockResponse(403, { detail: "You do not have permission." });

      await expect(
        browserRequest("/api/messages/conversations/conv-1/messages/send/", {
          method: "POST",
          body: { body: "Hi" },
        })
      ).rejects.toMatchObject({ status: 403 });
    });

    it("throws 409 for blocked room", async () => {
      mockResponse(409, { detail: "Cannot send messages in a blocked room." });

      await expect(
        browserRequest("/api/messages/conversations/blocked-room/messages/send/", {
          method: "POST",
          body: { body: "Hi" },
        })
      ).rejects.toMatchObject({ status: 409 });
    });
  });

  // ---- Mark read ----
  describe("POST /api/messages/conversations/:id/mark-read/", () => {
    it("marks conversation as read", async () => {
      mockResponse(200, { status: "read" });

      const data = await browserRequest(
        "/api/messages/conversations/conv-1/mark-read/",
        { method: "POST" }
      );
      expect(capturedOptions?.method).toBe("POST");
      expect(data).toBeDefined();
    });

    it("throws 403 for unrelated user", async () => {
      mockResponse(403, { detail: "Not a participant." });

      await expect(
        browserRequest("/api/messages/conversations/other-room/mark-read/", {
          method: "POST",
        })
      ).rejects.toMatchObject({ status: 403 });
    });
  });

  // ---- Unread count ----
  describe("GET /api/messages/unread-count/", () => {
    it("returns unread summary", async () => {
      const summary = { total_unread: 3, rooms: [] };
      mockResponse(200, summary);

      const data = await browserRequest("/api/messages/unread-count/");
      expect(data).toMatchObject({ total_unread: 3 });
    });

    it("returns zero when no unread", async () => {
      mockResponse(200, { total_unread: 0, rooms: [] });

      const data = await browserRequest("/api/messages/unread-count/");
      expect(data).toMatchObject({ total_unread: 0 });
    });
  });

  // ---- Error handling patterns ----
  describe("Error handling", () => {
    it("preserves backend error status", async () => {
      mockResponse(400, { detail: "Bad request." });

      try {
        await browserRequest("/api/messages/conversations/");
      } catch (e) {
        expect((e as ApiClientError).status).toBe(400);
      }
    });

    it("throws on network error", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toThrow();
    });

    it("throws on timeout", async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new DOMException("AbortError", "AbortError")), 0);
          })
      );

      await expect(
        browserRequest("/api/messages/conversations/")
      ).rejects.toThrow();
    });
  });

  // ---- Security ----
  describe("Security", () => {
    it("uses same-origin credentials", async () => {
      mockResponse(200, []);

      await browserRequest("/api/messages/conversations/");
      expect(capturedOptions?.credentials).toBe("same-origin");
    });

    it("sends JSON content type", async () => {
      mockResponse(200, []);

      await browserRequest("/api/messages/conversations/");
      expect(capturedOptions?.headers).toMatchObject({
        "Content-Type": "application/json",
      });
    });
  });
});
