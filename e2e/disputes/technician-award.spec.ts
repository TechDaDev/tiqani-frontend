/**
 * Technician award display.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Technician award", () => {
  test("tech award shows resolved status", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.TECH_AWARD);
    await expect(page.getByText(/resolved/i)).toBeVisible({ timeout: 10000 });
  });

  test("no refund to client shown", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.TECH_AWARD);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/500000.*refund/i);
  });
});
