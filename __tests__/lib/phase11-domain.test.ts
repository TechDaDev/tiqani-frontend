import { describe, expect, it } from "vitest";
import { ReviewCreateSchema } from "@/lib/reviews/schemas";
import { mapReview, mapReviewEligibility } from "@/lib/reviews/mappers";
import { mapReputation } from "@/lib/reputation/mappers";
import { mapNotification, safeNotificationTargetUrl } from "@/lib/notifications/mappers";
import { unreadCount } from "@/lib/notifications/actions";

describe("Phase 11 review domain", () => {
  it("validates rating bounds", () => {
    expect(ReviewCreateSchema.safeParse({ rating: 5 }).success).toBe(true);
    expect(ReviewCreateSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(ReviewCreateSchema.safeParse({ rating: 6 }).success).toBe(false);
  });

  it("maps review payload and strips null-safe values", () => {
    const review = mapReview({
      id: "11111111-1111-4111-8111-111111111111",
      reviewer: "22222222-2222-4222-8222-222222222222",
      reviewer_role: "client",
      rating: 5,
      title: "Great",
      comment: "Clean work",
      status: "published",
      is_verified: true,
      created_at: "2026-06-27T00:00:00Z",
      updated_at: "2026-06-27T00:00:00Z",
    });

    expect(review.rating).toBe(5);
    expect(review.reviewee).toBeNull();
    expect(review.is_verified).toBe(true);
  });

  it("maps review eligibility", () => {
    const eligibility = mapReviewEligibility({
      eligible: true,
      reason_code: "ELIGIBLE",
      reviewee: {
        id: "33333333-3333-4333-8333-333333333333",
        username: "tech",
        full_name: "Tech User",
        role: "technician",
      },
      existing_review: null,
      editable: false,
    });

    expect(eligibility.eligible).toBe(true);
    expect(eligibility.reviewee?.role).toBe("technician");
  });
});

describe("Phase 11 reputation domain", () => {
  it("maps transparent reputation aggregate", () => {
    const reputation = mapReputation({
      user: "33333333-3333-4333-8333-333333333333",
      role: "technician",
      average_rating: "4.50",
      review_count: 2,
      rating_5_count: 1,
      rating_4_count: 1,
      completed_contract_count: 3,
      label: "established",
    });

    expect(reputation.average_rating).toBe("4.50");
    expect(reputation.rating_5_count).toBe(1);
    expect(reputation.completed_contract_count).toBe(3);
  });
});

describe("Phase 11 notification domain", () => {
  it("keeps only safe internal target links", () => {
    expect(safeNotificationTargetUrl("/contracts/1")).toBe("/contracts/1");
    expect(safeNotificationTargetUrl("https://evil.example")).toBe("/notifications");
    expect(safeNotificationTargetUrl("//evil.example")).toBe("/notifications");
  });

  it("strips private metadata-like keys", () => {
    const notification = mapNotification({
      id: "44444444-4444-4444-8444-444444444444",
      notification_type: "review_created",
      title: "Review",
      message: "Review received",
      target_url: "/reviews/1",
      metadata: {
        review_id: "1",
        wallet_id: "secret",
        provider_secret: "secret",
      },
      is_read: false,
      created_at: "2026-06-27T00:00:00Z",
    });

    expect(notification.metadata.review_id).toBe("1");
    expect(notification.metadata.wallet_id).toBeUndefined();
    expect(notification.metadata.provider_secret).toBeUndefined();
  });

  it("counts unread notifications", () => {
    expect(unreadCount([
      mapNotification({ id: "55555555-5555-4555-8555-555555555555", title: "A", is_read: false }),
      mapNotification({ id: "66666666-6666-4666-8666-666666666666", title: "B", is_read: true }),
    ])).toBe(1);
  });
});
