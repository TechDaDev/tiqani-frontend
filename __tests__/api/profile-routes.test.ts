/**
 * Tests for all Phase 2 profile API route handlers.
 *
 * Patterns follow auth-routes.test.ts:
 * - vi.mock("@/lib/api/backend-client") for route handlers
 * - vi.stubGlobal("fetch") for native fetch usage
 * - createMockGetRequest / createMockPatchRequest with cookies
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockGetRequest, createMockPatchRequest } from "./auth-helpers";
import { ApiClientError } from "@/lib/api/errors";

// ── Shared mock data ──────────────────────────────────────────

const MOCK_CLIENT_DATA = {
  user_id: "uuid-client-1",
  username: "testclient",
  full_name: "Test Client",
  email: "client@test.com",
  phone_number: "+9647700000001",
  governorate: "Baghdad",
  address: "Some street",
  gender: "male",
  date_of_birth: "1990-01-01",
  profile_image: null,
  age: 36,
  is_complete: false,
  wallet_id: null,
  balance: "0.000",
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_TECHNICIAN_DATA = {
  user_id: "uuid-tech-1",
  username: "testtech",
  full_name: "Test Technician",
  email: "tech@test.com",
  phone_number: "+9647700000002",
  governorate: "Erbil",
  address: null,
  gender: "male",
  date_of_birth: "1985-06-15",
  profile_image: null,
  job_title: "Electrician",
  about: "Experienced electrician",
  years_of_expertise: 10,
  is_available: true,
  approved: true,
  is_complete: true,
  rate: "25000.000",
  last_active: "2026-06-15T10:00:00Z",
  url1: null,
  url2: null,
  identification_documents: null,
  skill_sets: {},
  images: [],
  wallet_id: null,
  balance: "0.000",
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_SKILLS_DATA = {
  id: "uuid-skills-1",
  categories: [],
  categories_detail: [],
  skills: [],
  skills_detail: [],
  sub_skills: [],
  sub_skills_detail: [],
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_AVAILABILITY_DATA = {
  is_available: true,
  last_active: "2026-06-15T10:00:00Z",
  is_online: true,
};

const MOCK_RATINGS_DATA = {
  average_rating: 4.5,
  total_reviews: 12,
  rating_breakdown: { "5": 8, "4": 2, "3": 1, "2": 1, "1": 0 },
  recent_reviews: [],
};

const MOCK_INCOMPLETE_DATA = {
  is_complete: false,
  incomplete_fields: ["phone_number", "governorate", "address", "gender", "date_of_birth"],
  total_required: 5,
  completed_count: 0,
  completion_percentage: 0.0,
};

const MOCK_ACCOUNTS_ME = {
  id: "uuid-client-1",
  username: "testclient",
  email: "client@test.com",
  first_name: "Test",
  last_name: "Client",
  role: "client",
  phone_number: "+9647700000001",
  governorate: "Baghdad",
  profile_image: null,
  is_active: true,
  is_complete: false,
};

// ── Module-level mocks ────────────────────────────────────────

const mockBackendGet = vi.fn();
const mockBackendPatch = vi.fn();
const mockBackendPost = vi.fn();

vi.mock("@/lib/api/backend-client", () => ({
  backendGet: (...args: unknown[]) => mockBackendGet(...args),
  backendPatch: (...args: unknown[]) => mockBackendPatch(...args),
  backendPost: (...args: unknown[]) => mockBackendPost(...args),
}));

// ── Helpers ───────────────────────────────────────────────────

const COOKIES_AUTH = { tiqani_access: "valid-access-token", tiqani_refresh: "valid-refresh-token" };
const COOKIES_NO_AUTH = {};

function setupAccountMe(role: string = "client") {
  mockBackendGet.mockResolvedValueOnce({
    status: 200,
    data: { ...MOCK_ACCOUNTS_ME, role },
    headers: new Headers(),
  });
}

// ── Tests ─────────────────────────────────────────────────────

describe("GET /api/client/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns client profile for authenticated client", async () => {
    setupAccountMe("client");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_CLIENT_DATA,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/client/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user_id).toBe("uuid-client-1");
    expect(body.full_name).toBe("Test Client");
    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/clients/me/",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer valid-access-token" }) })
    );
  });

  it("returns 401 without auth cookies", async () => {
    const { GET } = await import("@/app/api/client/me/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.detail).toContain("authenticated");
  });

  it("returns 403 for technician role", async () => {
    setupAccountMe("technician");

    const { GET } = await import("@/app/api/client/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(403);
  });

  it("propagates backend errors", async () => {
    setupAccountMe("client");
    mockBackendGet.mockRejectedValueOnce(
      new ApiClientError(500, "Backend error")
    );

    const { GET } = await import("@/app/api/client/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(500);
  });
});

describe("PATCH /api/client/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates client profile successfully", async () => {
    setupAccountMe("client");
    mockBackendPatch.mockResolvedValueOnce({
      status: 200,
      data: { ...MOCK_CLIENT_DATA, phone_number: "+9647700000999" },
      headers: new Headers(),
    });

    const { PATCH } = await import("@/app/api/client/me/route");
    const response = await PATCH(
      createMockPatchRequest({ phone_number: "+9647700000999" }, COOKIES_AUTH)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.phone_number).toBe("+9647700000999");
  });

  it("returns validation errors", async () => {
    setupAccountMe("client");
    mockBackendPatch.mockRejectedValueOnce(
      new ApiClientError(400, "Validation error", {
        fieldErrors: { phone_number: ["Invalid phone number."] },
      })
    );

    const { PATCH } = await import("@/app/api/client/me/route");
    const response = await PATCH(
      createMockPatchRequest({ phone_number: "invalid" }, COOKIES_AUTH)
    );
    expect(response.status).toBe(400);
  });
});

describe("GET /api/technicians/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns technician profile for authenticated technician", async () => {
    setupAccountMe("technician");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_TECHNICIAN_DATA,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/technicians/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user_id).toBe("uuid-tech-1");
    expect(body.job_title).toBe("Electrician");
  });

  it("returns 403 for client role", async () => {
    setupAccountMe("client");

    const { GET } = await import("@/app/api/technicians/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/technicians/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates technician profile successfully", async () => {
    setupAccountMe("technician");
    mockBackendPatch.mockResolvedValueOnce({
      status: 200,
      data: { ...MOCK_TECHNICIAN_DATA, about: "Updated about" },
      headers: new Headers(),
    });

    const { PATCH } = await import("@/app/api/technicians/me/route");
    const response = await PATCH(
      createMockPatchRequest({ about: "Updated about" }, COOKIES_AUTH)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.about).toBe("Updated about");
  });
});

describe("GET /api/technicians/me/skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns skills for authenticated technician", async () => {
    setupAccountMe("technician");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_SKILLS_DATA,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/technicians/me/skills/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe("uuid-skills-1");
  });

  it("returns 403 for client role", async () => {
    setupAccountMe("client");

    const { GET } = await import("@/app/api/technicians/me/skills/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/technicians/me/skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates skills successfully", async () => {
    setupAccountMe("technician");
    const updatedSkills = {
      ...MOCK_SKILLS_DATA,
      categories: ["cat-uuid-1"],
      categories_detail: [{ id: "cat-uuid-1", name: "Electrical" }],
    };
    mockBackendPatch.mockResolvedValueOnce({
      status: 200,
      data: updatedSkills,
      headers: new Headers(),
    });

    const { PATCH } = await import("@/app/api/technicians/me/skills/route");
    const response = await PATCH(
      createMockPatchRequest({ categories: ["cat-uuid-1"] }, COOKIES_AUTH)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.categories).toContain("cat-uuid-1");
  });
});

describe("GET /api/technicians/me/availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns availability for authenticated technician", async () => {
    setupAccountMe("technician");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_AVAILABILITY_DATA,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/technicians/me/availability/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.is_available).toBe(true);
  });
});

describe("PATCH /api/technicians/me/availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("toggles availability successfully", async () => {
    setupAccountMe("technician");
    mockBackendPatch.mockResolvedValueOnce({
      status: 200,
      data: { ...MOCK_AVAILABILITY_DATA, is_available: false },
      headers: new Headers(),
    });

    const { PATCH } = await import("@/app/api/technicians/me/availability/route");
    const response = await PATCH(
      createMockPatchRequest({ is_available: false }, COOKIES_AUTH)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.is_available).toBe(false);
  });
});

describe("GET /api/technicians/me/ratings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ratings for authenticated technician", async () => {
    setupAccountMe("technician");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_RATINGS_DATA,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/technicians/me/ratings/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.average_rating).toBe(4.5);
    expect(body.total_reviews).toBe(12);
  });
});

describe("GET /api/profile/incomplete-fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns incomplete fields for authenticated user", async () => {
    const { GET } = await import("@/app/api/profile/incomplete-fields/route");
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_INCOMPLETE_DATA,
      headers: new Headers(),
    });

    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.is_complete).toBe(false);
    expect(body.incomplete_fields).toContain("phone_number");
    expect(body.completion_percentage).toBe(0);
  });

  it("returns 401 without auth", async () => {
    const { GET } = await import("@/app/api/profile/incomplete-fields/route");
    const response = await GET(createMockGetRequest(COOKIES_NO_AUTH));
    expect(response.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns authenticated user", async () => {
    mockBackendGet.mockResolvedValueOnce({
      status: 200,
      data: MOCK_ACCOUNTS_ME,
      headers: new Headers(),
    });

    const { GET } = await import("@/app/api/auth/me/route");
    const response = await GET(createMockGetRequest(COOKIES_AUTH));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.email).toBe("client@test.com");
  });
});

describe("PATCH /api/auth/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates current user successfully", async () => {
    mockBackendPatch.mockResolvedValueOnce({
      status: 200,
      data: { ...MOCK_ACCOUNTS_ME, first_name: "Updated" },
      headers: new Headers(),
    });

    const { PATCH } = await import("@/app/api/auth/me/route");
    const response = await PATCH(
      createMockPatchRequest({ first_name: "Updated" }, COOKIES_AUTH)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.first_name).toBe("Updated");
  });

  it("returns validation errors", async () => {
    mockBackendPatch.mockRejectedValueOnce(
      new ApiClientError(400, "Validation error", {
        fieldErrors: { first_name: ["This field is required."] },
      })
    );

    const { PATCH } = await import("@/app/api/auth/me/route");
    const response = await PATCH(
      createMockPatchRequest({ first_name: "" }, COOKIES_AUTH)
    );
    expect(response.status).toBe(400);
  });
});
