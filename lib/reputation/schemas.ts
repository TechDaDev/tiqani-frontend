import { z } from "zod";

export const ReputationSnapshotSchema = z.object({
  user: z.string().uuid(),
  role: z.string(),
  average_rating: z.string(),
  review_count: z.number().int().min(0),
  rating_1_count: z.number().int().min(0),
  rating_2_count: z.number().int().min(0),
  rating_3_count: z.number().int().min(0),
  rating_4_count: z.number().int().min(0),
  rating_5_count: z.number().int().min(0),
  completed_contract_count: z.number().int().min(0),
  label: z.enum(["new", "established", "highly_rated"]),
  last_recalculated_at: z.string().nullable(),
});
