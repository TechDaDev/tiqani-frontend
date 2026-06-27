import type { Review, ReviewEligibility } from "./types";

export function mapReview(raw: Record<string, unknown>): Review {
  return {
    id: String(raw.id || ""),
    technician: raw.technician ? String(raw.technician) : null,
    reviewee: raw.reviewee ? String(raw.reviewee) : null,
    reviewee_name: raw.reviewee_name ? String(raw.reviewee_name) : null,
    reviewer: String(raw.reviewer || ""),
    reviewer_role: String(raw.reviewer_role || ""),
    reviewer_name: raw.reviewer_name ? String(raw.reviewer_name) : null,
    technician_name: raw.technician_name ? String(raw.technician_name) : null,
    rating: Number(raw.rating || 0),
    work_quality_rating: raw.work_quality_rating == null ? null : Number(raw.work_quality_rating),
    communication_rating: raw.communication_rating == null ? null : Number(raw.communication_rating),
    timeliness_rating: raw.timeliness_rating == null ? null : Number(raw.timeliness_rating),
    professionalism_rating: raw.professionalism_rating == null ? null : Number(raw.professionalism_rating),
    title: String(raw.title || ""),
    comment: String(raw.comment || ""),
    technician_response: String(raw.technician_response || ""),
    status: String(raw.status || "published") as Review["status"],
    is_verified: Boolean(raw.is_verified),
    is_public: Boolean(raw.is_public ?? true),
    helpful_count: Number(raw.helpful_count || 0),
    reported_count: Number(raw.reported_count || 0),
    edit_count: Number(raw.edit_count || 0),
    created_at: String(raw.created_at || ""),
    updated_at: String(raw.updated_at || ""),
  };
}

export function mapReviewList(raw: unknown): Review[] {
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.results)
      ? ((raw as Record<string, unknown>).results as unknown[])
      : [];
  return items.map((item) => mapReview(item as Record<string, unknown>));
}

export function mapReviewEligibility(raw: Record<string, unknown>): ReviewEligibility {
  return {
    eligible: Boolean(raw.eligible),
    reason_code: String(raw.reason_code || ""),
    reviewee: raw.reviewee && typeof raw.reviewee === "object"
      ? {
          id: String((raw.reviewee as Record<string, unknown>).id || ""),
          username: String((raw.reviewee as Record<string, unknown>).username || ""),
          full_name: String((raw.reviewee as Record<string, unknown>).full_name || ""),
          role: String((raw.reviewee as Record<string, unknown>).role || ""),
        }
      : null,
    existing_review: raw.existing_review ? String(raw.existing_review) : null,
    editable: Boolean(raw.editable),
  };
}
