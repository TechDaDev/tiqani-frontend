"use client";

import { useEffect, useState } from "react";
import { browserClient } from "@/lib/api/browser-client";
import { mapReviewList } from "@/lib/reviews/mappers";
import type { Review } from "@/lib/reviews/types";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewModerationActions } from "@/components/reviews/review-moderation-actions";

export default function AdminReviewReportsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    browserClient.get("/api/admin/review-reports/")
      .then((data) => setReviews(mapReviewList(data)))
      .catch(() => setReviews([]));
  }, []);

  return (
    <div data-testid="admin-review-reports-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Review Reports</h1>
        <p className="mt-1 text-sm text-foreground-muted">Reported reviews requiring staff moderation.</p>
      </div>
      <div className="space-y-3">
        {reviews.length === 0 && <p className="rounded-lg border border-border p-6 text-sm text-foreground-muted">No reported reviews.</p>}
        {reviews.map((review) => (
          <div key={review.id} data-testid={`admin-review-report-${review.id}`} className="space-y-2">
            <ReviewCard review={review} />
            <ReviewModerationActions reviewId={review.id} hidden={!review.is_public} />
          </div>
        ))}
      </div>
    </div>
  );
}
