import { expect, test } from "@playwright/test";
import { loginAsApprovedTechnician, loginAsClient } from "../fixtures/auth";
import { PHASE11 } from "../fixtures/phase11";
import { expectReviewEligible, expectReviewIneligible, openContractReview } from "../helpers/reviews";

test.describe("Phase 11 review eligibility", () => {
  test("client sees review form for completed eligible contract", async ({ page }) => {
    await loginAsClient(page);
    await openContractReview(page, PHASE11.CONTRACT.CLIENT_REVIEW_ELIGIBLE);
    await expectReviewEligible(page);
  });

  test("technician can review completed contract client", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openContractReview(page, PHASE11.CONTRACT.TECHNICIAN_REVIEW_ELIGIBLE);
    await expectReviewEligible(page);
  });

  test("blocks incomplete, disputed, and already reviewed contracts", async ({ page }) => {
    await loginAsClient(page);
    await openContractReview(page, PHASE11.CONTRACT.INCOMPLETE);
    await expectReviewIneligible(page, /completion/i);

    await openContractReview(page, PHASE11.CONTRACT.DISPUTED);
    await expectReviewIneligible(page, /dispute/i);

    await openContractReview(page, PHASE11.CONTRACT.REVIEWED);
    await expectReviewIneligible(page, /already/i);
  });
});
