/**
 * Marketplace API client — fetches data through the proxy and maps to frontend types.
 */
import { browserRequest } from "@/lib/api/browser-client";
import type {
  PaginatedResponse,
  TechnicianListItem,
  PublicTechnicianProfile,
  CategoryItem,
  SkillItem,
  SubSkillItem,
} from "./types";
import { MarketplaceQuery, serializeMarketplaceQuery } from "./query";
import {
  BackendTechnicianListResponseSchema,
  BackendTechnicianDetailResponseSchema,
  BackendCategoryListResponseSchema,
  BackendSkillPaginatedResponseSchema,
  BackendSkillListResponseSchema,
  BackendSubSkillPaginatedResponseSchema,
  BackendSubSkillListResponseSchema,
} from "./schemas";
import {
  mapTechnicianList,
  mapPublicTechnicianProfile,
  mapCategories,
  mapSkills,
  mapSubSkills,
} from "./mappers";

/**
 * Fetch paginated public technician listing through the proxy.
 */
export async function fetchTechnicians(
  query: MarketplaceQuery = {}
): Promise<PaginatedResponse<TechnicianListItem>> {
  const params = serializeMarketplaceQuery(query);
  const qs = params.toString();
  const path = `/api/marketplace/technicians${qs ? `?${qs}` : ""}`;

  const raw = await browserRequest<unknown>(path, { method: "GET" });
  const parsed = BackendTechnicianListResponseSchema.parse(raw);

  return {
    count: parsed.count,
    next: parsed.next,
    previous: parsed.previous,
    results: mapTechnicianList(parsed.results),
  };
}

/**
 * Fetch a single technician public profile by UUID.
 */
export async function fetchTechnicianPublicProfile(
  publicId: string
): Promise<PublicTechnicianProfile> {
  const raw = await browserRequest<unknown>(
    `/api/marketplace/technicians/${publicId}`,
    { method: "GET" }
  );
  const parsed = BackendTechnicianDetailResponseSchema.parse(raw);
  return mapPublicTechnicianProfile(parsed);
}

/**
 * Fetch all categories.
 */
export async function fetchCategories(
  params: { page?: number; page_size?: number } = {}
): Promise<PaginatedResponse<CategoryItem>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));
  const qs = searchParams.toString();
  const path = `/api/reference/categories${qs ? `?${qs}` : ""}`;

  const raw = await browserRequest<unknown>(path, { method: "GET" });
  const parsed = BackendCategoryListResponseSchema.parse(raw);

  return {
    count: parsed.count,
    next: parsed.next,
    previous: parsed.previous,
    results: mapCategories(parsed.results),
  };
}

/**
 * Fetch skills, optionally scoped to one category.
 */
export async function fetchSkills(
  params: { category_id?: string; page?: number; page_size?: number; fields?: "basic" } = {}
): Promise<SkillItem[]> {
  const searchParams = new URLSearchParams();
  if (params.category_id) searchParams.set("category_id", params.category_id);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));
  if (params.fields) searchParams.set("fields", params.fields);
  const qs = searchParams.toString();

  const raw = await browserRequest<unknown>(`/api/reference/skills${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
  const parsed = Array.isArray(raw)
    ? BackendSkillListResponseSchema.parse(raw)
    : BackendSkillPaginatedResponseSchema.parse(raw).results;
  return mapSkills(parsed);
}

/**
 * Fetch sub-skills, optionally scoped to one skill.
 */
export async function fetchSubSkills(
  params: { skill_id?: string; page?: number; page_size?: number } = {}
): Promise<SubSkillItem[]> {
  const searchParams = new URLSearchParams();
  if (params.skill_id) searchParams.set("skill_id", params.skill_id);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.page_size) searchParams.set("page_size", String(params.page_size));
  const qs = searchParams.toString();

  const raw = await browserRequest<unknown>(`/api/reference/sub-skills${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
  const parsed = Array.isArray(raw)
    ? BackendSubSkillListResponseSchema.parse(raw)
    : BackendSubSkillPaginatedResponseSchema.parse(raw).results;
  return mapSubSkills(parsed);
}
