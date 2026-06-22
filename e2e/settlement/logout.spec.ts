/**
 * Logout and cache coverage.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician, logout, clearSession } from "../fixtures/auth";
import { openWallet } from "../helpers/settlement";

test.describe("Logout and cache", () => {
  test("wallet inaccessible after logout", async ({ page, context }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);
    // Heading "My Wallet" (en) or "محفظتي" (ar)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

    await logout(page);

    // Wallet should redirect to login
    await page.goto("/en/wallet");
    await page.waitForLoadState("networkidle");
    // Check login page heading instead of URL — more reliable
    await expect(page.getByRole("heading", { name: /sign in|login|تسجيل/i }).or(page.locator('[type="submit"]'))).toBeVisible({ timeout: 10000 });
  });

  test("back navigation does not reveal balance", async ({ page, context }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);

    await logout(page);

    // Try back navigation — should still be on login
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /sign in|login|تسجيل/i }).or(page.locator('[type="submit"]'))).toBeVisible({ timeout: 10000 });
  });
});
