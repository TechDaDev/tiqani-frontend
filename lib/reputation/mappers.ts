import type { ReputationSnapshot } from "./types";

export function mapReputation(raw: Record<string, unknown>): ReputationSnapshot {
  return {
    user: String(raw.user || ""),
    role: String(raw.role || ""),
    average_rating: String(raw.average_rating || "0.00"),
    review_count: Number(raw.review_count || 0),
    rating_1_count: Number(raw.rating_1_count || 0),
    rating_2_count: Number(raw.rating_2_count || 0),
    rating_3_count: Number(raw.rating_3_count || 0),
    rating_4_count: Number(raw.rating_4_count || 0),
    rating_5_count: Number(raw.rating_5_count || 0),
    completed_contract_count: Number(raw.completed_contract_count || 0),
    label: String(raw.label || "new") as ReputationSnapshot["label"],
    last_recalculated_at: raw.last_recalculated_at ? String(raw.last_recalculated_at) : null,
  };
}
