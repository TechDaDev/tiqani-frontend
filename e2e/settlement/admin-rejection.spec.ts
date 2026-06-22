/**
 * Admin rejection.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openAdminWithdrawals } from "../helpers/settlement";

test.describe("Admin withdrawal rejection", () => {
  test("non-staff denied rejection access", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminWithdrawals(page);
    await expect(page.getByRole("button", { name: /process/i })).not.toBeVisible({ timeout: 5000 });
  });
});
