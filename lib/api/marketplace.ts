/**
 * Frontend API client for marketplace and reference endpoints.
 * All requests go through Next.js route handlers (same-origin proxy).
 */
import { browserRequest } from "./browser-client";

// ── Paginated Response ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Technician List Types ──────────────────────────────────────

export interface TechnicianListItem {
  user_id: string;
  username: string;
  full_name: string;
  governorate: string | null;
  profile_image: string | null;
  job_title: string | null;
  about: string | null;
  years_of_expertise: number;
  is_available: boolean;
  rate: string;
  is_complete: boolean | null;
  incomplete_fields: string[] | null;
}

// ── Marketplace Query Params ───────────────────────────────────

export interface MarketplaceParams {
  page?: number;
  page_size?: number;
  governorate?: string;
  is_available?: boolean;
  skill_id?: string;
  order_by?: string;
}

// ── Reference Types ────────────────────────────────────────────

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  skill_count?: number;
  technician_count?: number;
}

export interface CategoryDetailData extends CategoryData {
  skills: Array<{ id: string; name: string }>;
}

export interface SkillData {
  id: string;
  name: string;
  category?: string;
  technician_count?: number;
}

export interface SubSkillData {
  id: string;
  name: string;
  skill?: string;
}

// ── Marketplace API Functions ──────────────────────────────────

/**
 * Fetch paginated public technician listing.
 */
export async function fetchTechnicians(
  params: MarketplaceParams = {}
): Promise<PaginatedResponse<TechnicianListItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));
  if (params.governorate) searchParams.set("governorate", params.governorate);
  if (params.is_available !== undefined) searchParams.set("is_available", String(params.is_available));
  if (params.skill_id) searchParams.set("skill_id", params.skill_id);
  if (params.order_by) searchParams.set("order_by", params.order_by);

  const qs = searchParams.toString();
  const path = `/api/marketplace/technicians${qs ? `?${qs}` : ""}`;

  return browserRequest<PaginatedResponse<TechnicianListItem>>(path, {
    method: "GET",
  });
}

/**
 * Public technician detail (from the detail serializer).
 * Sensitive fields are null for non-owners/non-admins.
 */
export interface PublicTechnicianProfile {
  user_id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  governorate: string | null;
  gender: string | null;
  profile_image: string | null;
  job_title: string | null;
  about: string | null;
  years_of_expertise: number;
  is_available: boolean;
  rate: string;
  last_active: string | null;
  is_complete: boolean;
  approved: boolean | null;
  url1: string | null;
  url2: string | null;
  skill_sets: Record<string, unknown>;
  images: Array<{ id: string; image: string; description: string }>;
  wallet_id: string | null;
  created_at: string;
  [key: string]: unknown;
}

/**
 * Fetch a single technician public profile by UUID.
 */
export async function fetchTechnicianPublicProfile(
  publicId: string
): Promise<PublicTechnicianProfile> {
  return browserRequest<PublicTechnicianProfile>(
    `/api/marketplace/technicians/${publicId}`,
    { method: "GET" }
  );
}

/**
 * Fetch all categories.
 */
export async function fetchCategories(
  params: { page?: number; page_size?: number } = {}
): Promise<PaginatedResponse<CategoryData>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));

  const qs = searchParams.toString();
  const path = `/api/reference/categories${qs ? `?${qs}` : ""}`;

  return browserRequest<PaginatedResponse<CategoryData>>(path, { method: "GET" });
}

/**
 * Fetch all skills.
 */
export async function fetchSkills(): Promise<SkillData[]> {
  return browserRequest<SkillData[]>("/api/reference/skills", { method: "GET" });
}

/**
 * Fetch all sub-skills.
 */
export async function fetchSubSkills(): Promise<SubSkillData[]> {
  return browserRequest<SubSkillData[]>("/api/reference/sub-skills", {
    method: "GET",
  });
}
