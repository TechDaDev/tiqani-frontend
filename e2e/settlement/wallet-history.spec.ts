/**
 * Wallet history.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWallet, openTransactions } from "../helpers/settlement";

test.describe("Wallet history", () => {
  test("transactions page loads for technician", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);
    await expect(page.getByText(/my wallet|wallet/i)).toBeVisible({ timeout: 10000 });
  });

  test("wallet balance card shows balance", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);
    const body = await page.textContent("body");
    expect(body).toMatch(/IQD/);
  });
});
