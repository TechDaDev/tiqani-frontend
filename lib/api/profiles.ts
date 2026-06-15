/**
 * Frontend API client for profile endpoints.
 * All requests go through Next.js route handlers (same-origin proxy).
 */
import { browserRequest } from "./browser-client";

// ── Types ──────────────────────────────────────────────────────

export interface ClientProfileData {
  user_id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  governorate: string | null;
  address: string | null;
  gender: string | null;
  date_of_birth: string | null;
  profile_image: string | null;
  age: number | null;
  is_complete: boolean;
  wallet_id: string | null;
  balance: string | null;
  created_at: string;
}

export interface TechnicianProfileData {
  user_id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  governorate: string | null;
  address: string | null;
  gender: string | null;
  date_of_birth: string | null;
  profile_image: string | null;
  job_title: string | null;
  about: string | null;
  years_of_expertise: number;
  is_available: boolean;
  approved: boolean | null;
  is_complete: boolean;
  rate: string;
  last_active: string | null;
  url1: string | null;
  url2: string | null;
  identification_documents: string | null;
  skill_sets: Record<string, unknown>;
  images: Array<Record<string, unknown>>;
  wallet_id: string | null;
  balance: string | null;
  created_at: string;
}

export interface IncompleteFieldsData {
  is_complete: boolean;
  incomplete_fields: string[];
  total_required: number;
  completed_count: number;
  completion_percentage: number;
}

export interface TechnicianSkillsData {
  id: string;
  categories: string[];
  categories_detail: Array<{ id: string; name: string }>;
  skills: string[];
  skills_detail: Array<{ id: string; name: string }>;
  sub_skills: string[];
  sub_skills_detail: Array<{ id: string; name: string }>;
  created_at: string;
}

// ── Profile Update Payloads ────────────────────────────────────

export interface ClientProfileUpdate {
  phone_number?: string;
  governorate?: string;
  address?: string;
  gender?: "male" | "female";
  date_of_birth?: string;
  profile_image?: string;
}

export interface TechnicianProfileUpdate {
  job_title?: string;
  about?: string;
  years_of_expertise?: number;
  github?: string;
  linkedin?: string;
  is_available?: boolean;
}

// ── API Functions ──────────────────────────────────────────────

/**
 * Fetch client profile (GET /api/client/me/)
 */
export async function fetchClientProfile(): Promise<ClientProfileData> {
  return browserRequest<ClientProfileData>("/api/client/me", { method: "GET" });
}

/**
 * Update client profile (PATCH /api/client/me/)
 */
export async function updateClientProfile(
  data: ClientProfileUpdate
): Promise<ClientProfileData> {
  return browserRequest<ClientProfileData>("/api/client/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Fetch technician profile (GET /api/technicians/me/)
 */
export async function fetchTechnicianProfile(): Promise<TechnicianProfileData> {
  return browserRequest<TechnicianProfileData>("/api/technicians/me", {
    method: "GET",
  });
}

/**
 * Update technician profile (PATCH /api/technicians/me/)
 */
export async function updateTechnicianProfile(
  data: TechnicianProfileUpdate
): Promise<TechnicianProfileData> {
  return browserRequest<TechnicianProfileData>("/api/technicians/me", {
    method: "PATCH",
    body: data,
  });
}

/**
 * Fetch incomplete profile fields (GET /api/profile/incomplete-fields/)
 */
export async function fetchIncompleteFields(): Promise<IncompleteFieldsData> {
  return browserRequest<IncompleteFieldsData>(
    "/api/profile/incomplete-fields",
    { method: "GET" }
  );
}

/**
 * Fetch technician skills (GET /api/technicians/me/skills/)
 */
export async function fetchTechnicianSkills(): Promise<TechnicianSkillsData> {
  return browserRequest<TechnicianSkillsData>("/api/technicians/me/skills", {
    method: "GET",
  });
}

/**
 * Update technician skills (PATCH /api/technicians/me/skills/)
 */
export async function updateTechnicianSkills(
  data: Partial<TechnicianSkillsData>
): Promise<TechnicianSkillsData> {
  return browserRequest<TechnicianSkillsData>("/api/technicians/me/skills", {
    method: "PATCH",
    body: data,
  });
}

// ── Availability ───────────────────────────────────────────────

export interface TechnicianAvailabilityData {
  is_available: boolean;
  last_active: string | null;
  is_online: boolean;
}

/**
 * Fetch technician availability (GET /api/technicians/me/availability/)
 */
export async function fetchTechnicianAvailability(): Promise<TechnicianAvailabilityData> {
  return browserRequest<TechnicianAvailabilityData>(
    "/api/technicians/me/availability",
    { method: "GET" }
  );
}

/**
 * Update technician availability (PATCH /api/technicians/me/availability/)
 */
export async function updateTechnicianAvailability(
  is_available: boolean
): Promise<TechnicianAvailabilityData> {
  return browserRequest<TechnicianAvailabilityData>(
    "/api/technicians/me/availability",
    { method: "PATCH", body: { is_available } }
  );
}

// ── Portfolio Images ───────────────────────────────────────────

export interface TechnicianImageData {
  id: string;
  image: string;
  description: string;
  uploaded_at: string;
}

/**
 * Fetch technician portfolio images (GET /api/technicians/me/images/)
 */
export async function fetchTechnicianImages(): Promise<TechnicianImageData[]> {
  return browserRequest<TechnicianImageData[]>(
    "/api/technicians/me/images",
    { method: "GET" }
  );
}

/**
 * Upload technician portfolio image (POST /api/technicians/me/images/)
 * Uses FormData for multipart upload.
 */
export async function uploadTechnicianImage(
  file: File,
  description?: string
): Promise<TechnicianImageData> {
  const formData = new FormData();
  formData.append("image", file);
  if (description) {
    formData.append("description", description);
  }

  const response = await fetch("/api/technicians/me/images", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Upload failed." }));
    throw new Error(err.detail || "Upload failed.");
  }

  return response.json();
}

// ── Ratings ────────────────────────────────────────────────────

export interface TechnicianRatingsData {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: Record<string, number>;
  recent_reviews: Array<Record<string, unknown>>;
}

/**
 * Fetch technician ratings (GET /api/technicians/me/ratings/)
 */
export async function fetchTechnicianRatings(): Promise<TechnicianRatingsData> {
  return browserRequest<TechnicianRatingsData>(
    "/api/technicians/me/ratings",
    { method: "GET" }
  );
}
