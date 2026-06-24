/**
 * Reconciliation display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Reconciliation", () => {
  test("resolved dispute shows financial details", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.FULL_REFUND);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/500000/);
  });
});
