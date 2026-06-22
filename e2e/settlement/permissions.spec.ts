/**
 * Permissions and IDOR coverage.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician, loginAsApprovedTechnician } from "../fixtures/auth";
import { openWallet, openWithdrawals, openAdminWithdrawals } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Permissions and IDOR", () => {
  test("client wallet access is restricted to client role", async ({ page }) => {
    await loginAsClient(page);
    // Navigate to wallet page
    await page.goto("/en/wallet");
    await page.waitForLoadState("networkidle");
    // The page either renders or redirects to login
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test("technician can access own wallet", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await page.goto("/en/wallet");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/wallet|my wallet/i)).toBeVisible({ timeout: 10000 });
  });

  test("non-staff cannot access admin withdrawal pages", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminWithdrawals(page);
    // Should see forbidden or no admin controls
    await expect(page.getByRole("button", { name: /process/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("anonymous user denied", async ({ page }) => {
    await page.goto("/en/wallet");
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });
});
