/** Milestone domain Zod schemas */

import { z } from "zod";
import { DeliverableSubmissionSchema } from "@/lib/deliverables/schemas";
import { RevisionRequestSchema } from "@/lib/deliverables/schemas";

export const MilestoneSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  sequence: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string(),
  due_date: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  started_at: z.string().nullable(),
  submitted_at: z.string().nullable(),
  approved_at: z.string().nullable(),
  revision_count: z.number().int().min(0),
});

export const MilestoneDetailSchema = MilestoneSchema.extend({
  created_by: z.string().uuid().nullable(),
  submissions: z.array(DeliverableSubmissionSchema),
  revisions: z.array(RevisionRequestSchema),
});

export const MilestoneListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(MilestoneSchema),
});

export const MilestoneCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().optional(),
  sequence: z.number().int().min(1).optional(),
});

export const MilestoneUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export const MilestoneReorderSchema = z.object({
  sequence: z.array(z.string().uuid()),
});
