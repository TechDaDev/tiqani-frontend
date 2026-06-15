/**
 * Zod validation schemas for service request forms.
 */

import { z } from "zod";

export const createRequestSchema = z.object({
  technician: z.string().uuid("Invalid technician selection."),
  category: z.string().uuid().optional().or(z.literal("")),
  skill: z.string().uuid().optional().or(z.literal("")),
  title: z
    .string()
    .min(5, "requestValidation.titleMin")
    .max(255, "requestValidation.titleMax"),
  description: z
    .string()
    .min(20, "requestValidation.descriptionMin")
    .max(5000, "requestValidation.descriptionMax"),
  governorate: z.string().max(100).optional().or(z.literal("")),
  service_address: z.string().max(500).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().optional().or(z.literal("")),
  is_urgent: z.boolean().optional().default(false),
});

export type CreateRequestFormData = z.infer<typeof createRequestSchema>;
