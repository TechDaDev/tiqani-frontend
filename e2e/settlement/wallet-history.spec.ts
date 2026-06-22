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
    // Wallet page has <h1>{t("myWallet")}</h1> = "My Wallet" (en)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test("wallet balance card shows balance", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);
    // Check visible text only — avoids RSC payload
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).toMatch(/IQD/);
  });
});
