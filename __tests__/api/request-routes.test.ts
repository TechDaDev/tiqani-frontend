/**
 * Tests for all 9 service request proxy API route handlers.
 *
 * Patterns follow auth-routes.test.ts / profile-routes.test.ts:
 * - Mock @/lib/api/backend-client for route handlers
 * - Pass auth cookies to exercise authenticateProxy
 * - Test 401 (no auth), 403 (wrong role), 404 (not found), 409 (conflict)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockGetRequest, createMockPostRequest } from "./auth-helpers";
import type { NextRequest } from "next/server";

// ── Shared mock data ──────────────────────────────────────────

const MOCK_ACCOUNTS_ME_CLIENT = {
  id: "uuid-client-1",
  username: "testclient",
  email: "client@test.com",
  first_name: "Test",
  last_name: "Client",
  role: "client",
  is_active: true,
  phone_number: "",
  profile_image: null,
};

const MOCK_ACCOUNTS_ME_TECHNICIAN = {
  id: "uuid-tech-1",
  username: "testtech",
  email: "tech@test.com",
  first_name: "Test",
  last_name: "Technician",
  role: "technician",
  is_active: true,
  phone_number: "",
  profile_image: null,
};

const COOKIES_AUTH = {
  tiqani_access: "valid-access-token",
  tiqani_refresh: "valid-refresh-token",
};
const COOKIES_NO_AUTH = {};

const MOCK_CLIENT_LIST_RESPONSE = [
  {
    id: "req-1",
    client: { user_id: "uuid-client-1", username: "testclient", full_name: "Test Client" },
    technician: { user_id: "uuid-tech-1", username: "testtech", full_name: "Test Technician", job_title: "Electrician" },
    category: null, category_name: null, skill: null, skill_name: null,
    title: "Fix Garden Fence", description: "The wooden fence needs repairs.",
    governorate: null, status: "PENDING", is_urgent: false,
    preferred_date: null, preferred_time: null,
    created_at: "2026-06-15T10:00:00+03:00", updated_at: "2026-06-15T10:00:00+03:00",
  },
  {
    id: "req-2",
    client: { user_id: "uuid-client-1", username: "testclient", full_name: "Test Client" },
    technician: { user_id: "uuid-tech-2", username: "tech2", full_name: "Tech Two", job_title: "Plumber" },
    category: "cat-1", category_name: "Electrical", skill: "skill-1", skill_name: "Wiring",
    title: "Fix Wiring", description: "The wiring needs repairs in the kitchen.",
    governorate: "Baghdad", status: "ACCEPTED", is_urgent: true,
    preferred_date: "2026-07-01", preferred_time: "10:00",
    created_at: "2026-06-14T10:00:00+03:00", updated_at: "2026-06-15T12:00:00+03:00",
  },
];

const MOCK_TECH_LIST_RESPONSE = [
  {
    id: "req-1",
    client: { user_id: "uuid-client-1", username: "testclient", full_name: "Test Client" },
    technician: { user_id: "uuid-tech-1", username: "testtech", full_name: "Test Technician", job_title: "Electrician" },
    category: null, category_name: null, skill: null, skill_name: null,
    title: "Fix Garden Fence", description: "The wooden fence needs repairs.",
    governorate: null, status: "PENDING", is_urgent: false,
    preferred_date: null, preferred_time: null,
    created_at: "2026-06-15T10:00:00+03:00", updated_at: "2026-06-15T10:00:00+03:00",
  },
];

const MOCK_REQUEST_DETAIL = {
  id: "req-1",
  client: { user_id: "uuid-client-1", username: "testclient", full_name: "Test Client" },
  technician: { user_id: "uuid-tech-1", username: "testtech", full_name: "Test Technician", job_title: "Electrician" },
  category: null, category_name: null, skill: null, skill_name: null,
  title: "Fix Garden Fence", description: "The wooden fence needs repairs.",
  governorate: null, service_address: null, preferred_date: null, preferred_time: null,
  is_urgent: false, status: "PENDING",
  created_at: "2026-06-15T10:00:00+03:00", updated_at: "2026-06-15T10:00:00+03:00",
};

// ── Module-level mocks ────────────────────────────────────────

const mockBackendGet = vi.fn();
const mockBackendPost = vi.fn();

vi.mock("@/lib/api/backend-client", () => ({
  backendGet: (...args: unknown[]) => mockBackendGet(...args),
  backendPost: (...args: unknown[]) => mockBackendPost(...args),
}));

// ── Helper ────────────────────────────────────────────────────

function setupMe(role: "client" | "technician" = "client") {
  const data = role === "client" ? MOCK_ACCOUNTS_ME_CLIENT : MOCK_ACCOUNTS_ME_TECHNICIAN;
  mockBackendGet.mockResolvedValueOnce({
    status: 200,
    data,
    headers: new Headers(),
  });
}

function mockGetOnce(data: unknown, status = 200) {
  mockBackendGet.mockResolvedValueOnce({ status, data, headers: new Headers() });
}

function mockPostOnce(data: unknown, status = 200) {
  mockBackendPost.mockResolvedValueOnce({ status, data, headers: new Headers() });
}

// ============================================================
// CLIENT: LIST (GET /api/requests/)
// ============================================================
describe("GET /api/requests/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns client request list for authenticated client", async () => {
    setupMe("client");
    mockGetOnce(MOCK_CLIENT_LIST_RESPONSE);

    const { GET } = await import("@/app/api/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].title).toBe("Fix Garden Fence");
    expect(body[1].is_urgent).toBe(true);
    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/requests/",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer valid-access-token" }) })
    );
  });

  it("returns 401 without auth cookies", async () => {
    const { GET } = await import("@/app/api/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.detail).toContain("Authentication");
  });

  it("passes status query parameter to backend", async () => {
    setupMe("client");
    mockGetOnce([MOCK_CLIENT_LIST_RESPONSE[0]]);

    const { GET } = await import("@/app/api/requests/route");
    const url = new URL("http://localhost:3000/api/requests/?status=PENDING");
    const request = {
      ...createMockGetRequest(COOKIES_AUTH),
      url: url.href,
      nextUrl: url,
    } as unknown as NextRequest;
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/requests/?status=PENDING",
      expect.any(Object)
    );
  });

  it("propagates backend errors", async () => {
    setupMe("client");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(502, "Backend unavailable"));

    const { GET } = await import("@/app/api/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.detail).toBe("Backend unavailable");
  });

  it("forwards backend 403 for unauthorized role", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(403, "Forbidden"));

    const { GET } = await import("@/app/api/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(403);
  });
});

// ============================================================
// CLIENT: CREATE (POST /api/requests/)
// ============================================================
describe("POST /api/requests/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("creates a service request for authenticated client", async () => {
    setupMe("client");
    mockPostOnce(MOCK_REQUEST_DETAIL);

    const { POST } = await import("@/app/api/requests/route");
    const body = { technician: "uuid-tech-1", title: "Fix Garden Fence", description: "The wooden fence needs repairs." };
    const response = await POST(createMockPostRequest(body, COOKIES_AUTH));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.title).toBe("Fix Garden Fence");
    expect(mockBackendPost).toHaveBeenCalledWith(
      "/api/requests/",
      body,
      expect.any(Object)
    );
  });

  it("returns 401 without auth cookies", async () => {
    const { POST } = await import("@/app/api/requests/route");
    const response = await POST(createMockPostRequest({}, COOKIES_NO_AUTH));
    expect(response.status).toBe(401);
  });

  it("forwards backend 403 for unauthorized role", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(new ApiClientError(403, "Forbidden"));

    const { POST } = await import("@/app/api/requests/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH));
    expect(response.status).toBe(403);
  });

  it("propagates backend validation errors", async () => {
    setupMe("client");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(
      new ApiClientError(400, "Validation error", {
        fieldErrors: { title: ["Title is required."] },
      })
    );

    const { POST } = await import("@/app/api/requests/route");
    const body = { technician: "uuid-tech-1", title: "", description: "" };
    const response = await POST(createMockPostRequest(body, COOKIES_AUTH));
    expect(response.status).toBe(400);
  });
});

// ============================================================
// CLIENT: DETAIL (GET /api/requests/[requestId]/)
// ============================================================
describe("GET /api/requests/[requestId]/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns request detail for authenticated client", async () => {
    setupMe("client");
    mockGetOnce(MOCK_REQUEST_DETAIL);

    const { GET } = await import("@/app/api/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe("req-1");
    expect(body.status).toBe("PENDING");
  });

  it("returns 401 without auth cookies", async () => {
    const { GET } = await import("@/app/api/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("forwards backend 403 for unauthorized role", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(403, "Forbidden"));

    const { GET } = await import("@/app/api/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("propagates 404 from backend", async () => {
    setupMe("client");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(404, "Not found"));

    const { GET } = await import("@/app/api/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "nonexistent" }),
    });
    expect(response.status).toBe(404);
  });
});

// ============================================================
// CLIENT: CANCEL (POST /api/requests/[requestId]/cancel/)
// ============================================================
describe("POST /api/requests/[requestId]/cancel/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("cancels a pending request", async () => {
    setupMe("client");
    mockPostOnce({ id: "req-1", status: "CANCELLED" });

    const { POST } = await import("@/app/api/requests/[requestId]/cancel/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("CANCELLED");
  });

  it("returns 401 without auth cookies", async () => {
    const { POST } = await import("@/app/api/requests/[requestId]/cancel/route");
    const response = await POST(createMockPostRequest({}, COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 403 for technician role", async () => {
    setupMe("technician");

    const { POST } = await import("@/app/api/requests/[requestId]/cancel/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("returns 409 when request is not PENDING", async () => {
    setupMe("client");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(new ApiClientError(409, "Cannot cancel request in its current state."));

    const { POST } = await import("@/app/api/requests/[requestId]/cancel/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(409);
  });
});

// ============================================================
// CLIENT: WITHDRAW (POST /api/requests/[requestId]/withdraw/)
// ============================================================
describe("POST /api/requests/[requestId]/withdraw/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("withdraws a pending request", async () => {
    setupMe("client");
    mockPostOnce({ id: "req-1", status: "WITHDRAWN" });

    const { POST } = await import("@/app/api/requests/[requestId]/withdraw/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("WITHDRAWN");
  });

  it("returns 401 without auth cookies", async () => {
    const { POST } = await import("@/app/api/requests/[requestId]/withdraw/route");
    const response = await POST(createMockPostRequest({}, COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 403 for technician role", async () => {
    setupMe("technician");

    const { POST } = await import("@/app/api/requests/[requestId]/withdraw/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("returns 409 when request is not PENDING", async () => {
    setupMe("client");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(new ApiClientError(409, "Cannot withdraw request in its current state."));

    const { POST } = await import("@/app/api/requests/[requestId]/withdraw/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(409);
  });
});

// ============================================================
// TECHNICIAN: INBOX (GET /api/technician/requests/)
// ============================================================
describe("GET /api/technician/requests/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns technician inbox for authenticated technician", async () => {
    setupMe("technician");
    mockGetOnce(MOCK_TECH_LIST_RESPONSE);

    const { GET } = await import("@/app/api/technician/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe("Fix Garden Fence");
  });

  it("returns 401 without auth cookies", async () => {
    const { GET } = await import("@/app/api/technician/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH));
    expect(response.status).toBe(401);
  });

  it("returns 403 for client role", async () => {
    setupMe("client");

    const { GET } = await import("@/app/api/technician/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(403);
  });

  it("passes status filter to backend", async () => {
    setupMe("technician");
    mockGetOnce(MOCK_TECH_LIST_RESPONSE);

    const { GET } = await import("@/app/api/technician/requests/route");
    const url = new URL("http://localhost:3000/api/technician/requests/?status=PENDING");
    const request = {
      ...createMockGetRequest(COOKIES_AUTH),
      url: url.href,
      nextUrl: url,
    } as unknown as NextRequest;
    await GET(request);

    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/technician/requests/?status=PENDING",
      expect.any(Object)
    );
  });

  it("propagates backend errors", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(502, "Backend unavailable"));

    const { GET } = await import("@/app/api/technician/requests/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(502);
  });
});

// ============================================================
// TECHNICIAN: DETAIL (GET /api/technician/requests/[requestId]/)
// ============================================================
describe("GET /api/technician/requests/[requestId]/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns request detail for authenticated technician", async () => {
    setupMe("technician");
    mockGetOnce(MOCK_REQUEST_DETAIL);

    const { GET } = await import("@/app/api/technician/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe("req-1");
  });

  it("returns 401 without auth cookies", async () => {
    const { GET } = await import("@/app/api/technician/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 403 for client role", async () => {
    setupMe("client");

    const { GET } = await import("@/app/api/technician/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("propagates 404 from backend", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendGet.mockRejectedValueOnce(new ApiClientError(404, "Not found."));

    const { GET } = await import("@/app/api/technician/requests/[requestId]/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "nonexistent" }),
    });
    expect(response.status).toBe(404);
  });
});

// ============================================================
// TECHNICIAN: ACCEPT (POST /api/technician/requests/[requestId]/accept/)
// ============================================================
describe("POST /api/technician/requests/[requestId]/accept/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("accepts a pending request", async () => {
    setupMe("technician");
    mockPostOnce({ id: "req-1", status: "ACCEPTED" });

    const { POST } = await import("@/app/api/technician/requests/[requestId]/accept/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ACCEPTED");
  });

  it("returns 401 without auth cookies", async () => {
    const { POST } = await import("@/app/api/technician/requests/[requestId]/accept/route");
    const response = await POST(createMockPostRequest({}, COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 403 for client role", async () => {
    setupMe("client");

    const { POST } = await import("@/app/api/technician/requests/[requestId]/accept/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("returns 409 if already accepted", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(new ApiClientError(409, "Request has already been accepted."));

    const { POST } = await import("@/app/api/technician/requests/[requestId]/accept/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(409);
  });
});

// ============================================================
// TECHNICIAN: DECLINE (POST /api/technician/requests/[requestId]/decline/)
// ============================================================
describe("POST /api/technician/requests/[requestId]/decline/", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("declines a pending request", async () => {
    setupMe("technician");
    mockPostOnce({ id: "req-1", status: "DECLINED" });

    const { POST } = await import("@/app/api/technician/requests/[requestId]/decline/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("DECLINED");
  });

  it("returns 401 without auth cookies", async () => {
    const { POST } = await import("@/app/api/technician/requests/[requestId]/decline/route");
    const response = await POST(createMockPostRequest({}, COOKIES_NO_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 403 for client role", async () => {
    setupMe("client");

    const { POST } = await import("@/app/api/technician/requests/[requestId]/decline/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("returns 409 if already declined", async () => {
    setupMe("technician");
    const { ApiClientError } = await import("@/lib/api/errors");
    mockBackendPost.mockRejectedValueOnce(new ApiClientError(409, "Request has already been declined."));

    const { POST } = await import("@/app/api/technician/requests/[requestId]/decline/route");
    const response = await POST(createMockPostRequest({}, COOKIES_AUTH), {
      params: Promise.resolve({ requestId: "req-1" }),
    });
    expect(response.status).toBe(409);
  });
});
