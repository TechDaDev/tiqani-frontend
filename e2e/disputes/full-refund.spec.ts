/**
 * Full refund display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Full refund", () => {
  test("full refund dispute shows resolved status", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.FULL_REFUND);
    await expect(page.getByText(/resolved|تم الحل/i)).toBeVisible({ timeout: 10000 });
  });

  test("refund amount displayed", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.FULL_REFUND);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/500000/);
  });
});
