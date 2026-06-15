/**
 * Mappers: transform validated backend responses into frontend-safe types.
 * Strips snake_case, removes private fields, normalizes nulls, validates URLs.
 */
import type {
  PaginatedResponse,
  TechnicianListItem,
  PublicTechnicianProfile,
  CategoryItem,
  SkillItem,
  SubSkillItem,
  PortfolioImage,
} from "./types";
import type {
  RawTechnicianListItem,
  RawPublicTechnicianProfile,
  RawCategory,
  RawSkill,
  RawSubSkill,
} from "./schemas";

// ── URL validation ─────────────────────────────────────────────

/** Ensure a URL string is safe to render. */
function safeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    // Invalid URL
  }
  return null;
}

function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    // Invalid URL
  }
  return null;
}

/** Parse a rating string to a number. */
function parseRate(rate: string | undefined | null): number {
  if (!rate) return 0;
  const n = Number(rate);
  return isNaN(n) ? 0 : n;
}

// ── Public list item mapper ────────────────────────────────────

export function mapTechnicianListItem(
  raw: RawTechnicianListItem
): TechnicianListItem {
  return {
    userId: raw.user_id,
    username: raw.username,
    fullName: raw.full_name,
    governorate: raw.governorate,
    profileImage: safeImageUrl(raw.profile_image),
    jobTitle: raw.job_title,
    about: raw.about,
    yearsOfExpertise: raw.years_of_expertise,
    isAvailable: raw.is_available,
    rate: parseRate(raw.rate),
  };
}

export function mapTechnicianList(
  raw: RawTechnicianListItem[]
): TechnicianListItem[] {
  return raw.map(mapTechnicianListItem);
}

// ── Public detail mapper ───────────────────────────────────────

export function mapPublicTechnicianProfile(
  raw: RawPublicTechnicianProfile
): PublicTechnicianProfile {
  const skills = raw.skill_sets?.skills_detail ?? [];
  const categories = raw.skill_sets?.categories_detail ?? [];

  return {
    userId: raw.user_id,
    username: raw.username,
    fullName: raw.full_name,
    governorate: raw.governorate,
    gender: raw.gender,
    profileImage: safeImageUrl(raw.profile_image),
    jobTitle: raw.job_title,
    about: raw.about,
    yearsOfExpertise: raw.years_of_expertise,
    isAvailable: raw.is_available,
    rate: parseRate(raw.rate),
    lastActive: raw.last_active,
    isComplete: raw.is_complete,
    skills: (skills ?? []).map((s: { id: string; name: string }) => ({
      id: s.id,
      name: s.name,
    })),
    categories: (categories ?? []).map((c: { id: string; name: string }) => ({
      id: c.id,
      name: c.name,
    })),
    images: (raw.images ?? []).map(
      (img: { id: string; image: string; description: string }): PortfolioImage => ({
        id: img.id,
        image: safeImageUrl(img.image) ?? "",
        description: img.description ?? "",
      })
    ),
    url1: safeExternalUrl(raw.url1),
    url2: safeExternalUrl(raw.url2),
  };
}

// ── Reference data mappers ─────────────────────────────────────

export function mapCategory(raw: RawCategory): CategoryItem {
  return {
    id: raw.id,
    name: raw.name,
    skillCount: raw.skill_count,
    technicianCount: raw.technician_count,
  };
}

export function mapCategories(raw: RawCategory[]): CategoryItem[] {
  return raw.map(mapCategory);
}

export function mapSkill(raw: RawSkill): SkillItem {
  return {
    id: raw.id,
    name: raw.name,
    technicianCount: raw.technician_count,
  };
}

export function mapSkills(raw: RawSkill[]): SkillItem[] {
  return raw.map(mapSkill);
}

export function mapSubSkill(raw: RawSubSkill): SubSkillItem {
  return {
    id: raw.id,
    name: raw.name,
  };
}

export function mapSubSkills(raw: RawSubSkill[]): SubSkillItem[] {
  return raw.map(mapSubSkill);
}
