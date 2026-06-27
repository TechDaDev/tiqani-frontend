import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews/types";
import { reviewStatusLabel } from "@/lib/reviews/status";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article data-testid={`review-card-${review.id}`} className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{review.title || "Review"}</h3>
          <p className="text-sm text-foreground-muted">
            {review.reviewer_name || "Reviewer"} to {review.reviewee_name || review.technician_name || "User"}
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-600" aria-label={`${review.rating} out of 5`}>
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-semibold">{review.rating}</span>
        </div>
      </div>
      {review.comment && <p className="mt-3 text-sm leading-6">{review.comment}</p>}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground-muted">
        <span>{reviewStatusLabel(review.status)}</span>
        {review.is_verified && <span>Verified contract</span>}
        <span>{review.helpful_count} helpful</span>
      </div>
    </article>
  );
}
