import { z } from "zod";

export const ReviewStatusSchema = z.enum(["published", "under_review", "hidden", "removed"]);

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  technician: z.string().uuid().nullable().optional(),
  reviewee: z.string().uuid().nullable().optional(),
  reviewee_name: z.string().nullable().optional(),
  reviewer: z.string().uuid(),
  reviewer_role: z.string(),
  reviewer_name: z.string().nullable().optional(),
  technician_name: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5),
  work_quality_rating: z.number().int().min(1).max(5).nullable().optional(),
  communication_rating: z.number().int().min(1).max(5).nullable().optional(),
  timeliness_rating: z.number().int().min(1).max(5).nullable().optional(),
  professionalism_rating: z.number().int().min(1).max(5).nullable().optional(),
  title: z.string().default(""),
  comment: z.string().default(""),
  technician_response: z.string().default(""),
  status: ReviewStatusSchema.default("published"),
  is_verified: z.boolean().default(false),
  is_public: z.boolean().default(true),
  helpful_count: z.number().int().min(0).default(0),
  reported_count: z.number().int().min(0).default(0),
  edit_count: z.number().int().min(0).default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ReviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(150).optional().default(""),
  comment: z.string().max(3000).optional().default(""),
  work_quality_rating: z.number().int().min(1).max(5).optional(),
  communication_rating: z.number().int().min(1).max(5).optional(),
  timeliness_rating: z.number().int().min(1).max(5).optional(),
  professionalism_rating: z.number().int().min(1).max(5).optional(),
});

export const ReviewEligibilitySchema = z.object({
  eligible: z.boolean(),
  reason_code: z.string(),
  reviewee: z.object({
    id: z.string().uuid(),
    username: z.string(),
    full_name: z.string(),
    role: z.string(),
  }).nullable(),
  existing_review: z.string().uuid().nullable(),
  editable: z.boolean(),
});

export const ReviewReportSchema = z.object({
  reason: z.enum(["spam", "abuse", "fake", "inappropriate", "other"]),
  comment: z.string().max(1000).optional().default(""),
});
