import { expect, test } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { PHASE11 } from "../fixtures/phase11";
import { fetchEligibility, openContractReview, openUserReviews, submitReview } from "../helpers/reviews";

test.describe("Phase 11 review creation and reputation", () => {
  test("client submits one contract review and backend returns already-reviewed state", async ({ page }) => {
    await loginAsClient(page);
    await openContractReview(page, PHASE11.CONTRACT.CREATE_REVIEW);
    await submitReview(page, {
      rating: 5,
      title: "Focused Phase 11 review",
      comment: "Submitted by focused Playwright workflow.",
    });
    await page.waitForURL(new RegExp(`/contracts/${PHASE11.CONTRACT.CREATE_REVIEW}$`), { timeout: 20_000 });

    const eligibility = await fetchEligibility(page, PHASE11.CONTRACT.CREATE_REVIEW);
    expect(eligibility.reason_code).toBe("ALREADY_REVIEWED");
    expect(eligibility.existing_review).toBeTruthy();
  });

  test("public profile shows reputation and excludes hidden review fixture", async ({ page }) => {
    await loginAsClient(page);
    const eligibility = await fetchEligibility(page, PHASE11.CONTRACT.REVIEWED);
    expect(eligibility.reviewee?.id).toBeTruthy();

    await openUserReviews(page, eligibility.reviewee!.id);
    await expect(page.getByTestId("reputation-summary")).toBeVisible();
    await expect(page.getByTestId("rating-distribution")).toBeVisible();
    await expect(page.getByTestId(`review-card-${PHASE11.REVIEW.PUBLISHED}`)).toBeVisible();
    await expect(page.getByTestId(`review-card-${PHASE11.REVIEW.HIDDEN}`)).toHaveCount(0);
  });
});
