/**
 * Tests for Phase 3 marketplace and reference API route handlers.
 *
 * Patterns follow profile-routes.test.ts:
 * - vi.mock("@/lib/api/backend-client") for route handlers
 * - createMockGetRequest for GET handlers with query params
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { createMockGetRequest } from "./auth-helpers";

// ── Module-level mocks ────────────────────────────────────────

const mockBackendGet = vi.fn();

vi.mock("@/lib/api/backend-client", () => ({
  backendGet: (...args: unknown[]) => mockBackendGet(...args),
}));

// ── Mock data ─────────────────────────────────────────────────

const MOCK_TECHNICIAN_LIST = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      user_id: "uuid-tech-1",
      username: "techone",
      full_name: "Technician One",
      governorate: "Baghdad",
      profile_image: null,
      job_title: "Electrician",
      about: "Experienced electrician.",
      years_of_expertise: 8,
      is_available: true,
      rate: "4.50",
      is_complete: null,
      incomplete_fields: null,
    },
    {
      user_id: "uuid-tech-2",
      username: "techtwo",
      full_name: "Technician Two",
      governorate: "Erbil",
      profile_image: "http://example.com/img.jpg",
      job_title: "Plumber",
      about: "Expert plumber.",
      years_of_expertise: 5,
      is_available: false,
      rate: "3.80",
      is_complete: null,
      incomplete_fields: null,
    },
  ],
};

const MOCK_TECHNICIAN_DETAIL = {
  user_id: "uuid-tech-1",
  username: "techone",
  full_name: "Technician One",
  email: null,
  phone_number: null,
  governorate: "Baghdad",
  gender: "male",
  profile_image: null,
  job_title: "Electrician",
  about: "Experienced electrician.",
  years_of_expertise: 8,
  is_available: true,
  approved: true,
  is_complete: true,
  rate: "4.50",
  last_active: "2026-06-15T10:00:00Z",
  url1: "https://github.com/techone",
  url2: null,
  skill_sets: {
    detail: "",
    categories_detail: [{ id: "cat-1", name: "Electrical" }],
    skills_detail: [{ id: "skill-1", name: "Wiring" }],
    sub_skills_detail: [],
  },
  images: [
    { id: "img-1", image: "http://example.com/img1.jpg", description: "Project 1" },
  ],
  wallet_id: null,
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_CATEGORIES = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { id: "cat-1", name: "Electrical", skill_count: 5, technician_count: 3 },
    { id: "cat-2", name: "Plumbing", skill_count: 3, technician_count: 2 },
  ],
};

const MOCK_SKILLS = [
  { id: "skill-1", name: "Wiring", category: "cat-1", technician_count: 2 },
  { id: "skill-2", name: "Pipe Fitting", category: "cat-2", technician_count: 1 },
];

const MOCK_SUB_SKILLS = [
  { id: "sub-1", name: "Residential Wiring", skill: "skill-1" },
  { id: "sub-2", name: "Commercial Plumbing", skill: "skill-2" },
];

// ── Marketplace Routes ────────────────────────────────────────

describe("GET /api/marketplace/technicians", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated technician list", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_TECHNICIAN_LIST, status: 200 });

    const { GET } = await import("@/app/api/marketplace/technicians/route");
    const request = createMockGetRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.count).toBe(2);
    expect(body.results).toHaveLength(2);
    expect(body.results[0].full_name).toBe("Technician One");
    expect(mockBackendGet).toHaveBeenCalledWith("/api/technicians/");
  });

  it("forwards query parameters", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_TECHNICIAN_LIST, status: 200 });

    const { GET } = await import("@/app/api/marketplace/technicians/route");
    const url = new URL("http://localhost:3000/api/marketplace/technicians?governorate=Baghdad&is_available=true&order_by=-rate&page=1&page_size=10");
    const request = { ...createMockGetRequest(), url: url.href, nextUrl: url } as unknown as NextRequest;
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockBackendGet).toHaveBeenCalledWith("/api/technicians/?governorate=Baghdad&is_available=true&order_by=-rate&page=1&page_size=10");
    expect(body.results).toHaveLength(2);
  });

  it("returns 500 on generic error", async () => {
    mockBackendGet.mockRejectedValueOnce(new Error("Network failure"));

    const { GET } = await import("@/app/api/marketplace/technicians/route");
    const request = createMockGetRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.detail).toBe("Failed to fetch technicians.");
  });

  it("returns backend error status when available", async () => {
    const backendError = new Error("Backend error") as Error & { status: number };
    backendError.status = 502;
    mockBackendGet.mockRejectedValueOnce(backendError);

    const { GET } = await import("@/app/api/marketplace/technicians/route");
    const request = createMockGetRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.detail).toBe("Backend error");
  });
});

describe("GET /api/marketplace/technicians/[publicId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns technician detail", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_TECHNICIAN_DETAIL, status: 200 });

    const { GET } = await import("@/app/api/marketplace/technicians/[publicId]/route");
    const request = createMockGetRequest();
    const response = await GET(request, { params: Promise.resolve({ publicId: "uuid-tech-1" }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.full_name).toBe("Technician One");
    expect(body.skill_sets.skills_detail).toHaveLength(1);
    expect(body.images).toHaveLength(1);
    expect(mockBackendGet).toHaveBeenCalledWith("/api/technicians/uuid-tech-1/");
  });

  it("returns backend error status", async () => {
    const backendError = new Error("Not found.") as Error & { status: number };
    backendError.status = 404;
    mockBackendGet.mockRejectedValueOnce(backendError);

    const { GET } = await import("@/app/api/marketplace/technicians/[publicId]/route");
    const request = createMockGetRequest();
    const response = await GET(request, { params: Promise.resolve({ publicId: "non-existent" }) });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.detail).toBe("Not found.");
  });
});

// ── Reference Routes ──────────────────────────────────────────

describe("GET /api/reference/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns categories list", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_CATEGORIES, status: 200 });

    const { GET } = await import("@/app/api/reference/categories/route");
    const request = createMockGetRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.count).toBe(2);
    expect(body.results[0].name).toBe("Electrical");
    expect(mockBackendGet).toHaveBeenCalledWith("/api/categories/");
  });
});

describe("GET /api/reference/skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns skills list", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_SKILLS, status: 200 });

    const { GET } = await import("@/app/api/reference/skills/route");
    const request = createReferenceRequest("/api/reference/skills");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe("Wiring");
    expect(mockBackendGet).toHaveBeenCalledWith("/api/categories/skills/");
  });

  it("forwards skill query params", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_SKILLS, status: 200 });

    const { GET } = await import("@/app/api/reference/skills/route");
    const request = createReferenceRequest(
      "/api/reference/skills?category_id=cat-1&page_size=100&fields=basic"
    );
    await GET(request);

    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/categories/skills/?category_id=cat-1&page_size=100&fields=basic"
    );
  });
});

describe("GET /api/reference/sub-skills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns sub-skills list", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_SUB_SKILLS, status: 200 });

    const { GET } = await import("@/app/api/reference/sub-skills/route");
    const request = createReferenceRequest("/api/reference/sub-skills");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe("Residential Wiring");
    expect(mockBackendGet).toHaveBeenCalledWith("/api/categories/sub-skills/");
  });

  it("forwards sub-skill query params", async () => {
    mockBackendGet.mockResolvedValueOnce({ data: MOCK_SUB_SKILLS, status: 200 });

    const { GET } = await import("@/app/api/reference/sub-skills/route");
    const request = createReferenceRequest("/api/reference/sub-skills?skill_id=skill-1&page_size=100");
    await GET(request);

    expect(mockBackendGet).toHaveBeenCalledWith(
      "/api/categories/sub-skills/?skill_id=skill-1&page_size=100"
    );
  });
});

function createReferenceRequest(path: string): NextRequest {
  return {
    nextUrl: new URL(path, "http://localhost:3000"),
  } as NextRequest;
}
