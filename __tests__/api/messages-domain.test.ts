/**
 * Tests for messaging domain — schemas, mappers, types.
 */

import { describe, it, expect } from "vitest";
import { sendMessageSchema, conversationIdSchema, requestIdSchema } from "@/lib/messages/schemas";
import {
  mapConversation,
  mapConversationDetail,
  mapMessage,
  mapUnreadSummary,
  mapChatUser,
} from "@/lib/messages/mappers";

describe("Message schemas", () => {
  describe("sendMessageSchema", () => {
    it("validates a valid message", () => {
      const result = sendMessageSchema.safeParse({ body: "Hello" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body).toBe("Hello");
      }
    });

    it("trims whitespace", () => {
      const result = sendMessageSchema.safeParse({ body: "  Hello  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body).toBe("Hello");
      }
    });

    it("rejects empty message", () => {
      const result = sendMessageSchema.safeParse({ body: "" });
      expect(result.success).toBe(false);
    });

    it("rejects whitespace-only message", () => {
      const result = sendMessageSchema.safeParse({ body: "   " });
      // Schema now transforms before validation, so trimmed "" fails min(1)
      expect(result.success).toBe(false);
    });

    it("rejects missing body", () => {
      const result = sendMessageSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("rejects oversized message over 2000 chars", () => {
      const result = sendMessageSchema.safeParse({ body: "x".repeat(2001) });
      expect(result.success).toBe(false);
    });

    it("accepts exactly 2000 chars", () => {
      const result = sendMessageSchema.safeParse({ body: "x".repeat(2000) });
      expect(result.success).toBe(true);
    });
  });

  describe("conversationIdSchema", () => {
    it("validates UUID", () => {
      expect(conversationIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
    });

    it("rejects non-UUID", () => {
      expect(conversationIdSchema.safeParse("not-a-uuid").success).toBe(false);
    });

    it("rejects empty string", () => {
      expect(conversationIdSchema.safeParse("").success).toBe(false);
    });
  });

  describe("requestIdSchema", () => {
    it("validates UUID", () => {
      expect(requestIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
    });

    it("rejects malformed UUID", () => {
      expect(requestIdSchema.safeParse("bad-uuid").success).toBe(false);
    });
  });
});

describe("Message mappers", () => {
  describe("mapChatUser", () => {
    it("maps full user data", () => {
      const raw = {
        id: "user-1",
        username: "john",
        full_name: "John Doe",
        profile_image: "/img.jpg",
        role: "client",
      };
      const result = mapChatUser(raw);
      expect(result.id).toBe("user-1");
      expect(result.full_name).toBe("John Doe");
      expect(result.profile_image).toBe("/img.jpg");
      expect(result.role).toBe("client");
    });

    it("handles missing profile_image", () => {
      const raw = { id: "user-1", username: "john", full_name: "John", role: "tech" };
      const result = mapChatUser(raw);
      expect(result.profile_image).toBeNull();
    });

    it("handles empty raw data", () => {
      const result = mapChatUser({});
      expect(result.id).toBe("");
      expect(result.username).toBe("");
    });

    it("strips private fields", () => {
      const raw = {
        id: "user-1",
        username: "john",
        full_name: "John Doe",
        role: "client",
        email: "john@example.com",
        phone: "+964700000000",
        password: "secret",
      };
      const result = mapChatUser(raw);
      expect(result).not.toHaveProperty("email");
      expect(result).not.toHaveProperty("phone");
      expect(result).not.toHaveProperty("password");
    });
  });

  describe("mapConversation", () => {
    it("maps conversation with all fields", () => {
      const raw = {
        id: "room-1",
        status: "OPEN",
        client_user: { id: "c1", username: "client", full_name: "Client A", role: "client" },
        technician_user: { id: "t1", username: "tech", full_name: "Tech A", role: "technician" },
        service_request_id: "req-1",
        service_request_title: "Network Setup",
        unread_count: 2,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      const result = mapConversation(raw);
      expect(result.id).toBe("room-1");
      expect(result.status).toBe("OPEN");
      expect(result.service_request_title).toBe("Network Setup");
      expect(result.unread_count).toBe(2);
      expect(result.client_user.role).toBe("client");
      expect(result.technician_user.role).toBe("technician");
    });

    it("handles nullable service_request fields", () => {
      const raw = {
        id: "room-1",
        status: "CLOSED",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversation(raw);
      expect(result.service_request_id).toBeNull();
      expect(result.service_request_title).toBeNull();
      expect(result.linked_contract_id).toBeNull();
    });

    it("maps last_message_preview", () => {
      const raw = {
        id: "room-1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        last_message_preview: { id: "m1", message_type: "TEXT", preview: "Hello", sender_id: "t1", created_at: "2026-01-01T00:00:00Z" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversation(raw);
      expect(result.last_message_preview).not.toBeNull();
      expect(result.last_message_preview?.preview).toBe("Hello");
    });

    it("handles missing last_message_preview", () => {
      const raw = {
        id: "room-1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversation(raw);
      expect(result.last_message_preview).toBeNull();
    });

    it("defaults unread_count to 0", () => {
      const raw = {
        id: "room-1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversation(raw);
      expect(result.unread_count).toBe(0);
    });

    it("strips private participant fields", () => {
      const raw = {
        id: "room-1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client", email: "c@test.com", phone: "+964" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician", email: "t@test.com" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversation(raw);
      expect(result.client_user).not.toHaveProperty("email");
      expect(result.client_user).not.toHaveProperty("phone");
      expect(result.technician_user).not.toHaveProperty("email");
    });
  });

  describe("mapConversationDetail", () => {
    it("maps full conversation detail", () => {
      const raw = {
        id: "room-1",
        client_id: "c1",
        technician_id: "t1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_by_id: "c1",
        status: "OPEN",
        metadata: {},
        service_request_id: "req-1",
        service_request_title: "Setup",
        service_request_status: "ACCEPTED",
        unread_count: 1,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      const result = mapConversationDetail(raw);
      expect(result.id).toBe("room-1");
      expect(result.service_request_status).toBe("ACCEPTED");
      expect(result.unread_count).toBe(1);
    });

    it("handles nullable contract and service-request fields", () => {
      const raw = {
        id: "room-1",
        client_id: "c1",
        technician_id: "t1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_by_id: "c1",
        status: "OPEN",
        metadata: {},
        created_at: "",
        updated_at: "",
      };
      const result = mapConversationDetail(raw);
      expect(result.linked_contract_id).toBeNull();
      expect(result.service_request_id).toBeNull();
      expect(result.closed_at).toBeNull();
      expect(result.closed_by_id).toBeNull();
    });

    it("maps last_message", () => {
      const raw = {
        id: "room-1",
        client_id: "c1",
        technician_id: "t1",
        client_user: { id: "c1", username: "c", full_name: "C", role: "client" },
        technician_user: { id: "t1", username: "t", full_name: "T", role: "technician" },
        created_by_id: "c1",
        status: "OPEN",
        metadata: {},
        last_message: { id: "m1", room_id: "room-1", sender: "t1", sender_info: { id: "t1", username: "t", full_name: "T", role: "technician" }, message_type: "TEXT", body: "Hi", safe_body: "Hi", is_deleted: false, created_at: "", updated_at: "" },
        created_at: "",
        updated_at: "",
      };
      const result = mapConversationDetail(raw);
      expect(result.last_message).not.toBeNull();
      expect(result.last_message?.body).toBe("Hi");
    });
  });

  describe("mapMessage", () => {
    it("maps TEXT message", () => {
      const raw = {
        id: "msg-1",
        room_id: "room-1",
        sender: "user-1",
        sender_info: { id: "user-1", username: "u", full_name: "User", role: "client" },
        message_type: "TEXT",
        body: "Hello world",
        safe_body: "Hello world",
        is_deleted: false,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      const result = mapMessage(raw);
      expect(result.message_type).toBe("TEXT");
      expect(result.body).toBe("Hello world");
      expect(result.safe_body).toBe("Hello world");
    });

    it("maps SYSTEM message", () => {
      const raw = {
        id: "msg-2",
        room_id: "room-1",
        sender: "system",
        sender_info: { id: "", username: "system", full_name: "System", role: "system" },
        message_type: "SYSTEM",
        body: "Room created",
        safe_body: "Room created",
        is_deleted: false,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      const result = mapMessage(raw);
      expect(result.message_type).toBe("SYSTEM");
    });

    it("maps deleted message", () => {
      const raw = {
        id: "msg-3",
        room_id: "room-1",
        sender: "user-1",
        sender_info: { id: "user-1", username: "u", full_name: "User", role: "client" },
        message_type: "TEXT",
        body: "Old content",
        safe_body: "Old content",
        is_deleted: true,
        created_at: "",
        updated_at: "",
      };
      const result = mapMessage(raw);
      expect(result.is_deleted).toBe(true);
    });

    it("maps PRICE_OFFER message", () => {
      const raw = {
        id: "msg-4",
        room_id: "room-1",
        sender: "tech-1",
        sender_info: { id: "tech-1", username: "t", full_name: "Tech", role: "technician" },
        message_type: "PRICE_OFFER",
        body: "Price offer",
        safe_body: "Price offer",
        price_amount: "50000",
        price_currency: "IQD",
        is_deleted: false,
        created_at: "",
        updated_at: "",
      };
      const result = mapMessage(raw);
      expect(result.message_type).toBe("PRICE_OFFER");
      expect(result.price_amount).toBe("50000");
      expect(result.price_currency).toBe("IQD");
    });

    it("defaults price_currency", () => {
      const raw = {
        id: "msg-5",
        room_id: "room-1",
        sender: "u1",
        sender_info: { id: "u1", username: "u", full_name: "U", role: "client" },
        message_type: "TEXT",
        body: "Hi",
        safe_body: "Hi",
        is_deleted: false,
        created_at: "",
        updated_at: "",
      };
      const result = mapMessage(raw);
      expect(result.price_currency).toBe("IQD");
    });

    it("handles unknown message type", () => {
      const raw = {
        id: "msg-6",
        room_id: "room-1",
        sender: "u1",
        sender_info: { id: "u1", username: "u", full_name: "U", role: "client" },
        message_type: "UNKNOWN_TYPE",
        body: "Test",
        safe_body: "Test",
        is_deleted: false,
        created_at: "",
        updated_at: "",
      };
      const result = mapMessage(raw);
      expect(result.message_type).toBe("UNKNOWN_TYPE");
    });

    it("falls back safe_body to body", () => {
      const raw = {
        id: "msg-7",
        room_id: "room-1",
        sender: "u1",
        sender_info: { id: "u1", username: "u", full_name: "U", role: "client" },
        message_type: "TEXT",
        body: "Raw body",
        is_deleted: false,
        created_at: "",
        updated_at: "",
      };
      const result = mapMessage(raw);
      expect(result.safe_body).toBe("Raw body");
    });
  });

  describe("mapUnreadSummary", () => {
    it("maps full summary", () => {
      const raw = {
        total_unread: 5,
        rooms: [
          { room_id: "room-1", unread_count: 3 },
          { room_id: "room-2", unread_count: 2 },
        ],
      };
      const result = mapUnreadSummary(raw);
      expect(result.total_unread).toBe(5);
      expect(result.rooms).toHaveLength(2);
      expect(result.rooms[0].unread_count).toBe(3);
    });

    it("handles zero unread", () => {
      const raw = { total_unread: 0, rooms: [] };
      const result = mapUnreadSummary(raw);
      expect(result.total_unread).toBe(0);
      expect(result.rooms).toHaveLength(0);
    });

    it("handles missing rooms", () => {
      const raw = { total_unread: 0 };
      const result = mapUnreadSummary(raw);
      expect(result.rooms).toHaveLength(0);
    });

    it("normalizes negative counts to non-negative numeric", () => {
      const raw = { total_unread: -1, rooms: [] };
      const result = mapUnreadSummary(raw);
      expect(result.total_unread).toBe(-1); // preserves raw value
    });
  });
});
