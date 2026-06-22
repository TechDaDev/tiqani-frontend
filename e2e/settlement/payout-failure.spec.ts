/**
 * Payout failure.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWithdrawals } from "../helpers/settlement";




test.describe("Sandbox payout failure", () => {
  test("failed withdrawal shows failure status", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    // The seed creates a failed withdrawal
    await expect(page.getByText(/failed/i)).toBeVisible({ timeout: 10000 });
  });
});
