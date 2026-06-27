import type { Review } from "@/lib/reviews/types";
import { ReviewCard } from "./review-card";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="rounded-lg border border-border p-6 text-sm text-foreground-muted">No reviews yet.</p>;
  }
  return (
    <div className="space-y-3">
      {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
    </div>
  );
}
