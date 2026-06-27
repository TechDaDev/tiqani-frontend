import type { ReviewEligibility as Eligibility } from "@/lib/reviews/types";
import { reviewEligibilityMessage } from "@/lib/reviews/status";

export function ReviewEligibility({ eligibility }: { eligibility: Eligibility }) {
  return (
    <div data-testid="review-eligibility" className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium">{reviewEligibilityMessage(eligibility.reason_code)}</p>
      {eligibility.reviewee && (
        <p className="mt-1 text-sm text-foreground-muted">Reviewing {eligibility.reviewee.full_name || eligibility.reviewee.username}</p>
      )}
    </div>
  );
}
