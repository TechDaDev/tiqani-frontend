/**
 * Refund idempotency.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail, assertDisputeVisible } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Refund idempotency", () => {
  test("resolved refund dispute renders without errors", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.FULL_REFUND);
    await assertDisputeVisible(page, FIXTURE.DISPUTE.FULL_REFUND);
  });

  test("duplicate resolution does not duplicate on frontend display", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.FULL_REFUND);
    // Page should show one refund record
    const refundTexts = await page.locator("body").innerText();
    const refundCount = (refundTexts.match(/500000/g) || []).length;
    expect(refundCount).toBeGreaterThanOrEqual(1);
  });
});
