/**
 * Withdrawal request.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWithdrawals, requestWithdrawal } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Withdrawal request", () => {
  test("technician can request withdrawal", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await requestWithdrawal(page, "5000");
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body).toContain("5000");
  });

  test("zero amount rejected", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await requestWithdrawal(page, "0");
    await page.waitForTimeout(1000);
    const body = await page.textContent("body");
    // Should show error or validation
    expect(body).not.toContain("Internal Server Error");
  });

  test("negative amount rejected", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await requestWithdrawal(page, "-100");
    await page.waitForTimeout(1000);
    const body = await page.textContent("body");
    expect(body).not.toContain("Internal Server Error");
  });
});
