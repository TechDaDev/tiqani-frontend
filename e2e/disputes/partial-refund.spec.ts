/**
 * Partial refund display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Partial refund", () => {
  test("partial refund shows resolved status", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.PARTIAL_REFUND);
    await expect(page.getByText(/resolved/i)).toBeVisible({ timeout: 10000 });
  });

  test("partial refund amount displayed", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.PARTIAL_REFUND);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/200000/);
  });
});
