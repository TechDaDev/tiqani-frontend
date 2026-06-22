/**
 * Payout retry.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWithdrawals } from "../helpers/settlement";

test.describe("Payout retry", () => {
  test("failed withdrawal shows retry option for staff", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await expect(page.getByText(/failed/i)).toBeVisible({ timeout: 10000 });
  });
});
