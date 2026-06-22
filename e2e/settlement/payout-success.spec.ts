/**
 * Payout success.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openAdminWithdrawals } from "../helpers/settlement";

test.describe("Sandbox payout success", () => {
  test("non-staff cannot access admin payout", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminWithdrawals(page);
    // Non-staff should not see admin controls
    await expect(page.getByRole("button", { name: /confirm payout/i })).not.toBeVisible({ timeout: 5000 });
  });
});
