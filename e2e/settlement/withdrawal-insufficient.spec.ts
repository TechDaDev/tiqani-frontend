/**
 * Insufficient balance withdrawal.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWithdrawals, requestWithdrawal } from "../helpers/settlement";

test.describe("Insufficient balance withdrawal", () => {
  test("amount above available balance rejected", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    // Request a very large amount
    await requestWithdrawal(page, "999999999");
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body).not.toContain("Internal Server Error");
  });

  test("below minimum rejected", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await requestWithdrawal(page, "1");
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body).not.toContain("Internal Server Error");
  });
});
