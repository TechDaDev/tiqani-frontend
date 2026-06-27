export type ReputationLabel = "new" | "established" | "highly_rated";

export interface ReputationSnapshot {
  user: string;
  role: "client" | "technician" | string;
  average_rating: string;
  review_count: number;
  rating_1_count: number;
  rating_2_count: number;
  rating_3_count: number;
  rating_4_count: number;
  rating_5_count: number;
  completed_contract_count: number;
  label: ReputationLabel;
  last_recalculated_at: string | null;
}
