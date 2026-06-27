import { browserClient } from "@/lib/api/browser-client";
import type { Review, ReviewCreatePayload, ReviewEligibility, ReviewReportPayload } from "@/lib/reviews/types";
import { mapReview, mapReviewEligibility, mapReviewList } from "@/lib/reviews/mappers";
import { ReviewCreateSchema, ReviewReportSchema } from "@/lib/reviews/schemas";

export async function fetchReviewEligibility(contractId: string): Promise<ReviewEligibility> {
  const data = await browserClient.get(`/api/contracts/${contractId}/review-eligibility/`);
  return mapReviewEligibility(data);
}

export async function createContractReview(contractId: string, payload: ReviewCreatePayload): Promise<Review> {
  const body = ReviewCreateSchema.parse(payload);
  const data = await browserClient.post(`/api/contracts/${contractId}/reviews/`, body);
  return mapReview(data);
}

export async function fetchUserReviews(userId: string): Promise<Review[]> {
  const data = await browserClient.get(`/api/users/${userId}/reviews/`);
  return mapReviewList(data);
}

export async function reportReview(reviewId: string, payload: ReviewReportPayload): Promise<{ reported: boolean; reported_count: number }> {
  const body = ReviewReportSchema.parse(payload);
  return browserClient.post(`/api/reviews/${reviewId}/report/`, body);
}

export async function hideReview(reviewId: string, reason: string) {
  return browserClient.post(`/api/admin/reviews/${reviewId}/hide/`, { reason });
}

export async function restoreReview(reviewId: string, reason: string) {
  return browserClient.post(`/api/admin/reviews/${reviewId}/restore/`, { reason });
}
