import type { Review } from "@/lib/reviews/types";

export function ReviewSummary({ reviews }: { reviews: Review[] }) {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-border p-4">
        <div className="text-2xl font-semibold">{average.toFixed(1)}</div>
        <div className="text-sm text-foreground-muted">Average rating</div>
      </div>
      <div className="rounded-lg border border-border p-4">
        <div className="text-2xl font-semibold">{count}</div>
        <div className="text-sm text-foreground-muted">Reviews</div>
      </div>
    </div>
  );
}
