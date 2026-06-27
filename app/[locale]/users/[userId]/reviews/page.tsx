"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserReviews } from "@/lib/api/reviews";
import { fetchUserReputation } from "@/lib/api/reputation";
import type { Review } from "@/lib/reviews/types";
import type { ReputationSnapshot } from "@/lib/reputation/types";
import { ReviewList } from "@/components/reviews/review-list";
import { ReputationSummary } from "@/components/reputation/reputation-summary";
import { RatingDistribution } from "@/components/reputation/rating-distribution";
import { TrustIndicators } from "@/components/reputation/trust-indicators";

export default function UserReviewsPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reputation, setReputation] = useState<ReputationSnapshot | null>(null);

  useEffect(() => {
    fetchUserReviews(userId).then(setReviews).catch(() => setReviews([]));
    fetchUserReputation(userId).then(setReputation).catch(() => setReputation(null));
  }, [userId]);

  return (
    <main data-testid="user-reviews-page" className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      {reputation && (
        <>
          <ReputationSummary reputation={reputation} />
          <TrustIndicators reputation={reputation} />
          <RatingDistribution reputation={reputation} />
        </>
      )}
      <ReviewList reviews={reviews} />
    </main>
  );
}
