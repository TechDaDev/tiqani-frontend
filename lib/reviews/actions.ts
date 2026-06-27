import type { ReviewEligibility } from "./types";

export function canCreateReview(eligibility: ReviewEligibility | null): boolean {
  return Boolean(eligibility?.eligible);
}

export function canEditReview(eligibility: ReviewEligibility | null): boolean {
  return Boolean(eligibility?.editable && eligibility.existing_review);
}
