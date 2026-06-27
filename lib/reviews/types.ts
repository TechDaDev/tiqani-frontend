export type ReviewStatus = "published" | "under_review" | "hidden" | "removed";
export type ReviewerRole = "client" | "technician";

export interface ReviewUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

export interface Review {
  id: string;
  technician: string | null;
  reviewee: string | null;
  reviewee_name: string | null;
  reviewer: string;
  reviewer_role: ReviewerRole | string;
  reviewer_name: string | null;
  technician_name: string | null;
  rating: number;
  work_quality_rating: number | null;
  communication_rating: number | null;
  timeliness_rating: number | null;
  professionalism_rating: number | null;
  title: string;
  comment: string;
  technician_response: string;
  status: ReviewStatus;
  is_verified: boolean;
  is_public: boolean;
  helpful_count: number;
  reported_count: number;
  edit_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewEligibility {
  eligible: boolean;
  reason_code: string;
  reviewee: ReviewUser | null;
  existing_review: string | null;
  editable: boolean;
}

export interface ReviewCreatePayload {
  rating: number;
  title?: string;
  comment?: string;
  work_quality_rating?: number;
  communication_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
}

export interface ReviewReportPayload {
  reason: "spam" | "abuse" | "fake" | "inappropriate" | "other";
  comment?: string;
}
