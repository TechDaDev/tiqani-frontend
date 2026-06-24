/**
 * Cancelling a dispute.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician } from "../fixtures/auth";
import { openDisputeDetail, cancelDispute } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute cancellation", () => {
  test("opener can cancel open dispute", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await cancelDispute(page);
    await expect(page.getByText(/canceled|cancelled/i)).toBeVisible({ timeout: 10000 });
  });

  test("respondent cannot cancel", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    const cancelBtn = page.getByRole("button", { name: /cancel dispute/i });
    await expect(cancelBtn).not.toBeVisible({ timeout: 5000 });
  });

  test("under-review dispute cannot cancel", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    const cancelBtn = page.getByRole("button", { name: /cancel dispute/i });
    await expect(cancelBtn).not.toBeVisible({ timeout: 5000 });
  });
});
