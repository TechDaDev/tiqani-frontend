"use client";

import { useParams } from "next/navigation";
import { ReviewModerationActions } from "@/components/reviews/review-moderation-actions";

export default function AdminReviewDetailPage() {
  const params = useParams();
  const reviewId = params.reviewId as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Review Moderation</h1>
        <p className="mt-1 text-sm text-foreground-muted">Review ID: {reviewId}</p>
      </div>
      <ReviewModerationActions reviewId={reviewId} />
    </div>
  );
}
