/**
 * Marketplace types — cleaned, frontend-safe representations.
 *
 * Backend responses go through schemas (Zod validation) and mappers
 * before reaching components. Raw backend data is never consumed directly.
 */

// ── Paginated response wrapper ─────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Technician list item (public list serializer) ──────────────

export interface TechnicianListItem {
  userId: string;
  username: string;
  fullName: string;
  governorate: string | null;
  profileImage: string | null;
  jobTitle: string | null;
  about: string | null;
  yearsOfExpertise: number;
  isAvailable: boolean;
  rate: number;
}

// ── Public technician detail (public detail serializer) ────────

export interface SkillItem {
  id: string;
  name: string;
}

export interface PortfolioImage {
  id: string;
  image: string;
  description: string;
}

export interface PublicTechnicianProfile {
  userId: string;
  username: string;
  fullName: string;
  governorate: string | null;
  gender: string | null;
  profileImage: string | null;
  jobTitle: string | null;
  about: string | null;
  yearsOfExpertise: number;
  isAvailable: boolean;
  rate: number;
  lastActive: string | null;
  isComplete: boolean;
  skills: SkillItem[];
  categories: SkillItem[];
  images: PortfolioImage[];
  url1: string | null;
  url2: string | null;
}

// ── Reference data ─────────────────────────────────────────────

export interface CategoryItem {
  id: string;
  name: string;
  skillCount?: number;
  technicianCount?: number;
  skills?: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  technicianCount?: number;
  category?: string;
  subSkills?: SubSkillItem[];
}

export interface SubSkillItem {
  id: string;
  name: string;
  skill?: string;
}
