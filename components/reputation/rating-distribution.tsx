import type { ReputationSnapshot } from "@/lib/reputation/types";

export function RatingDistribution({ reputation }: { reputation: ReputationSnapshot }) {
  const rows = [
    [5, reputation.rating_5_count],
    [4, reputation.rating_4_count],
    [3, reputation.rating_3_count],
    [2, reputation.rating_2_count],
    [1, reputation.rating_1_count],
  ];
  const total = Math.max(reputation.review_count, 1);

  return (
    <div data-testid="rating-distribution" className="space-y-2">
      {rows.map(([rating, count]) => (
        <div key={rating} className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-sm">
          <span>{rating}</span>
          <div className="h-2 rounded bg-muted">
            <div className="h-2 rounded bg-primary" style={{ width: `${(count / total) * 100}%` }} />
          </div>
          <span className="text-right text-foreground-muted">{count}</span>
        </div>
      ))}
    </div>
  );
}
