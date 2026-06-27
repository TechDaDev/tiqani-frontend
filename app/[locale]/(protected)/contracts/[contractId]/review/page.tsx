"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createContractReview, fetchReviewEligibility } from "@/lib/api/reviews";
import type { ReviewEligibility as Eligibility } from "@/lib/reviews/types";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewEligibility } from "@/components/reviews/review-eligibility";

export default function ContractReviewPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;
  const locale = params.locale as string;
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewEligibility(contractId)
      .then(setEligibility)
      .finally(() => setLoading(false));
  }, [contractId]);

  if (loading) return <p className="text-sm text-foreground-muted">Loading review eligibility.</p>;
  if (!eligibility) return <p className="text-sm text-red-600">Review eligibility unavailable.</p>;

  return (
    <div data-testid="review-page" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leave Review</h1>
        <p className="mt-1 text-sm text-foreground-muted">One review is allowed per contract participant.</p>
      </div>
      <ReviewEligibility eligibility={eligibility} />
      {eligibility.eligible && (
        <ReviewForm
          onSubmit={async (payload) => {
            await createContractReview(contractId, payload);
            router.push(`/${locale}/contracts/${contractId}`);
          }}
        />
      )}
    </div>
  );
}
