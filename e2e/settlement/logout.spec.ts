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
    await expect(page.getByText(/wallet/i)).toBeVisible({ timeout: 10000 });

    await logout(page);

    // Wallet should be inaccessible
    await page.goto("/en/wallet");
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });

  test("back navigation does not reveal balance", async ({ page, context }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);

    await logout(page);

    // Try back navigation
    await page.goBack();
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });
});
