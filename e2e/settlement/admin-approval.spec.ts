/**
 * Admin approval.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openAdminWithdrawals } from "../helpers/settlement";

test.describe("Admin withdrawal approval", () => {
  test("non-staff denied approval access", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminWithdrawals(page);
    // Non-staff should not see admin controls
    // Non-staff should not see admin controls - check for specific admin buttons
    await expect(page.getByRole("button", { name: /process/i })).not.toBeVisible({ timeout: 5000 });
  });
});
