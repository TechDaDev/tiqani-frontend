/**
 * Post-settlement reversal display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Post-settlement reversal", () => {
  test("post-settlement dispute shows resolved status", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.POST_SETTLE_REFUND);
    await expect(page.getByText(/resolved/i)).toBeVisible({ timeout: 10000 });
  });

  test("wallet reversal amount displayed", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.POST_SETTLE_REFUND);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/500000/);
  });
});
