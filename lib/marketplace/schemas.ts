/**
 * Zod schemas for validating marketplace API responses.
 * Raw backend data is validated before mappers consume it.
 */
import { z } from "zod";

// ── Backend raw shapes ─────────────────────────────────────────

const BackendTechnicianListItemSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  full_name: z.string(),
  governorate: z.string().nullable(),
  profile_image: z.string().nullable(),
  job_title: z.string().nullable(),
  about: z.string().nullable(),
  years_of_expertise: z.number().int().min(0),
  is_available: z.boolean(),
  rate: z.string(),
  is_complete: z.boolean().nullable().optional(),
  incomplete_fields: z.array(z.string()).nullable().optional(),
});

const BackendSkillDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const BackendImageSchema = z.object({
  id: z.string(),
  image: z.string(),
  description: z.string(),
});

const BackendSkillSetsSchema = z.object({
  detail: z.string().optional(),
  categories_detail: z.array(BackendSkillDetailSchema).optional(),
  skills_detail: z.array(BackendSkillDetailSchema).optional(),
  sub_skills_detail: z.array(BackendSkillDetailSchema).optional(),
});

const BackendPublicTechnicianProfileSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  full_name: z.string(),
  email: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  governorate: z.string().nullable(),
  gender: z.string().nullable(),
  profile_image: z.string().nullable(),
  job_title: z.string().nullable(),
  about: z.string().nullable(),
  years_of_expertise: z.number().int().min(0),
  is_available: z.boolean(),
  rate: z.string(),
  last_active: z.string().nullable(),
  is_complete: z.boolean(),
  approved: z.boolean().nullable().optional(),
  url1: z.string().nullable(),
  url2: z.string().nullable(),
  skill_sets: BackendSkillSetsSchema,
  images: z.array(BackendImageSchema),
  wallet_id: z.string().nullable().optional(),
  created_at: z.string(),
}).passthrough(); // Allow unknown fields to be stripped by mapper

const BackendPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number().int().min(0),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

export const BackendTechnicianListResponseSchema =
  BackendPaginatedResponseSchema(BackendTechnicianListItemSchema);

export const BackendTechnicianDetailResponseSchema =
  BackendPublicTechnicianProfileSchema;

// ── Category schema (raw backend) ──────────────────────────────

// ── Skill schema (raw backend) ─────────────────────────────────

const BackendSubSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  skill: z.string().optional(),
});

const BackendSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  technician_count: z.number().int().optional(),
  sub_skills: z.array(BackendSubSkillSchema).optional(),
});

export const BackendSubSkillListResponseSchema = z.array(BackendSubSkillSchema);
export const BackendSubSkillPaginatedResponseSchema =
  BackendPaginatedResponseSchema(BackendSubSkillSchema);

export const BackendSkillListResponseSchema = z.array(BackendSkillSchema);
export const BackendSkillPaginatedResponseSchema =
  BackendPaginatedResponseSchema(BackendSkillSchema);

// ── Category schema (raw backend) ──────────────────────────────

const BackendCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  skill_count: z.number().int().optional(),
  technician_count: z.number().int().optional(),
  skills: z.array(BackendSkillSchema).optional(),
});

export const BackendCategoryListResponseSchema =
  BackendPaginatedResponseSchema(BackendCategorySchema);

// ── Error response ─────────────────────────────────────────────

export const BackendErrorResponseSchema = z.object({
  detail: z.string().optional(),
});

// ── Exported raw types for mapper consumption ──────────────────

export type RawTechnicianListItem = z.infer<typeof BackendTechnicianListItemSchema>;
export type RawPublicTechnicianProfile = z.infer<typeof BackendPublicTechnicianProfileSchema>;
export type RawCategory = z.infer<typeof BackendCategorySchema>;
export type RawSkill = z.infer<typeof BackendSkillSchema>;
export type RawSubSkill = z.infer<typeof BackendSubSkillSchema>;
