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
    // Non-staff should not see admin controls — use exact "Process" match
    // avoids matching "Processing" status label or "Approved" username
    await expect(page.getByRole("button", { name: /^process$/i })).not.toBeVisible({ timeout: 5000 });
  });
});
