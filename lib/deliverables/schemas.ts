/** Deliverable & Revision Zod schemas */

import { z } from "zod";

export const DeliverableSubmissionSchema = z.object({
  id: z.string().uuid(),
  milestone: z.string().uuid(),
  submitted_by: z.string().uuid(),
  submitted_by_name: z.string(),
  version: z.number().int().min(1),
  summary: z.string().min(1),
  notes: z.string(),
  external_link: z.string(),
  submitted_at: z.string(),
  created_at: z.string(),
});

export const DeliverableListSchema = z.array(DeliverableSubmissionSchema);

export const DeliverableCreateSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  notes: z.string().optional(),
  external_link: z.string().optional(),
});

export const RevisionRequestSchema = z.object({
  id: z.string().uuid(),
  milestone: z.string().uuid(),
  submission: z.string().uuid(),
  requested_by: z.string().uuid(),
  requested_by_name: z.string(),
  reason: z.string().min(1),
  status: z.string(),
  revision_number: z.number().int().min(1),
  created_at: z.string(),
  resolved_at: z.string().nullable(),
});

export const RevisionCreateSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});
