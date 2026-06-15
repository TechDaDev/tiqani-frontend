/**
 * Tests for request Zod schemas and mapper functions.
 */
import { describe, it, expect } from "vitest";
import { createRequestSchema } from "@/lib/requests/schemas";
import { mapServiceRequest, mapCreatePayload } from "@/lib/requests/mappers";

// ============================================================
// Schema validation
// ============================================================
describe("createRequestSchema", () => {
  it("accepts valid minimal data", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fix the garden fence",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts valid data with all optional fields", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      category: "660e8400-e29b-41d4-a716-446655440001",
      skill: "770e8400-e29b-41d4-a716-446655440002",
      title: "Fix the garden fence",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
      governorate: "Baghdad",
      service_address: "123 Main St",
      preferred_date: "2026-07-01",
      preferred_time: "10:00",
      is_urgent: true,
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects title shorter than 5 characters", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fix",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 255 characters", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "x".repeat(256),
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 20 characters", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fix the fence",
      description: "Too short.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects description longer than 5000 characters", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fix the fence",
      description: "x".repeat(5001),
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID technician", () => {
    const data = {
      technician: "not-a-uuid",
      title: "Fix the garden fence",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional fields", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      category: "",
      skill: "",
      title: "Fix the garden fence",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
      governorate: "",
      service_address: "",
      preferred_date: "",
      preferred_time: "",
    };
    const result = createRequestSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("defaults is_urgent to false", () => {
    const data = {
      technician: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fix the garden fence",
      description: "The wooden fence at the back of the garden has several broken panels that need to be replaced.",
    };
    const result = createRequestSchema.parse(data);
    expect(result.is_urgent).toBe(false);
  });
});

// ============================================================
// Mapper: mapServiceRequest
// ============================================================
describe("mapServiceRequest", () => {
  it("maps full backend response to frontend types", () => {
    const raw = {
      id: "req-123",
      client: { user_id: "user-1", username: "client1", full_name: "Client One", governorate: "Baghdad", profile_image: "http://example.com/img.jpg" },
      technician: { user_id: "user-2", username: "tech1", full_name: "Tech One", job_title: "Electrician", governorate: "Erbil", profile_image: null },
      category: "cat-1", category_name: "Electrical", skill: "skill-1", skill_name: "Wiring",
      title: "Fix Wiring", description: "Fix the wiring in the kitchen.",
      governorate: "Baghdad", service_address: "123 Main St",
      preferred_date: "2026-07-01", preferred_time: "10:00",
      is_urgent: true, status: "PENDING",
      created_at: "2026-06-15T10:00:00Z", updated_at: "2026-06-15T11:00:00Z",
    };
    const result = mapServiceRequest(raw);

    expect(result.id).toBe("req-123");
    expect(result.client.full_name).toBe("Client One");
    expect(result.client.profile_image).toBe("http://example.com/img.jpg");
    expect(result.technician.full_name).toBe("Tech One");
    expect(result.technician.job_title).toBe("Electrician");
    expect(result.technician.profile_image).toBeUndefined();
    expect(result.category).toBe("cat-1");
    expect(result.category_name).toBe("Electrical");
    expect(result.skill).toBe("skill-1");
    expect(result.skill_name).toBe("Wiring");
    expect(result.title).toBe("Fix Wiring");
    expect(result.description).toBe("Fix the wiring in the kitchen.");
    expect(result.governorate).toBe("Baghdad");
    expect(result.service_address).toBe("123 Main St");
    expect(result.preferred_date).toBe("2026-07-01");
    expect(result.preferred_time).toBe("10:00");
    expect(result.is_urgent).toBe(true);
    expect(result.status).toBe("PENDING");
    expect(result.created_at).toBe("2026-06-15T10:00:00Z");
    expect(result.updated_at).toBe("2026-06-15T11:00:00Z");
  });

  it("handles null fields gracefully", () => {
    const raw = {
      id: "req-456",
      client: { user_id: "user-1", username: "client1", full_name: "Client One" },
      technician: { user_id: "user-2", username: "tech1", full_name: "Tech One" },
      title: "Fix", description: "Fix it.",
      is_urgent: false, status: "PENDING",
      created_at: "", updated_at: "",
    };
    const result = mapServiceRequest(raw);

    expect(result.category).toBeUndefined();
    expect(result.category_name).toBeUndefined();
    expect(result.skill).toBeUndefined();
    expect(result.skill_name).toBeUndefined();
    expect(result.governorate).toBeUndefined();
    expect(result.service_address).toBeUndefined();
    expect(result.preferred_date).toBeUndefined();
    expect(result.preferred_time).toBeUndefined();
    expect(result.client.profile_image).toBeUndefined();
    expect(result.technician.profile_image).toBeUndefined();
  });

  it("handles missing client and technician objects", () => {
    const raw = {
      id: "req-789",
      title: "Fix", description: "Fix it.",
      is_urgent: false, status: "PENDING",
      created_at: "", updated_at: "",
    };
    const result = mapServiceRequest(raw);

    expect(result.client.user_id).toBe("");
    expect(result.client.full_name).toBe("");
    expect(result.technician.user_id).toBe("");
    expect(result.technician.full_name).toBe("");
  });

  it("handles raw objects with extra unknown keys", () => {
    const raw = {
      id: "req-1",
      client: { user_id: "u1", username: "u", full_name: "User" },
      technician: { user_id: "u2", username: "t", full_name: "Tech" },
      title: "Test", description: "Test description for verification purposes.",
      is_urgent: false, status: "PENDING",
      created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
      private_field: "should-not-appear",
    };
    const result = mapServiceRequest(raw);

    expect(result.title).toBe("Test");
    expect((result as any).private_field).toBeUndefined();
  });
});

// ============================================================
// Mapper: mapCreatePayload
// ============================================================
describe("mapCreatePayload", () => {
  it("maps camelCase form data to snake_case API payload", () => {
    const formData = {
      technician: "uuid-tech-1",
      title: "Fix fence",
      description: "Fix the fence.",
      isUrgent: true,
      preferredDate: "2026-07-01",
      preferredTime: "10:00",
      governorate: "Baghdad",
    };
    const result = mapCreatePayload(formData);

    expect(result.technician).toBe("uuid-tech-1");
    expect(result.title).toBe("Fix fence");
    expect(result.description).toBe("Fix the fence.");
    expect(result.is_urgent).toBe(true);
    expect(result.preferred_date).toBe("2026-07-01");
    expect(result.preferred_time).toBe("10:00");
    expect(result.governorate).toBe("Baghdad");
  });

  it("strips undefined optional fields", () => {
    const formData = {
      technician: "uuid-tech-1",
      title: "Fix fence",
      description: "Fix the fence.",
    };
    const result = mapCreatePayload(formData);

    expect(result.technician).toBe("uuid-tech-1");
    expect(result.category).toBeUndefined();
    expect(result.skill).toBeUndefined();
    expect(result.governorate).toBeUndefined();
    expect(result.service_address).toBeUndefined();
    expect(result.preferred_date).toBeUndefined();
    expect(result.preferred_time).toBeUndefined();
    expect(result.is_urgent).toBe(false);
  });

  it("handles snake_case fallback for is_urgent", () => {
    const formData = {
      technician: "uuid-tech-1",
      title: "Fix fence",
      description: "Fix the fence.",
      is_urgent: true,
    };
    const result = mapCreatePayload(formData);
    expect(result.is_urgent).toBe(true);
  });

  it("maps empty strings to undefined (falsy stripping)", () => {
    const formData = {
      technician: "uuid-tech-1",
      title: "Fix fence",
      description: "Fix the fence.",
      category: "",
      skill: "",
      governorate: "",
    };
    const result = mapCreatePayload(formData);

    expect(result.category).toBeUndefined();
    expect(result.skill).toBeUndefined();
    expect(result.governorate).toBeUndefined();
  });
});
