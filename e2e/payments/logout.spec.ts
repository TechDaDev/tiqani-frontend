/**
 * Logout and cache security tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment logout security", () => {
  test("logout clears access to funding page", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");

    // Clear auth by removing cookies and navigating
    await page.context().clearCookies();
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test("direct protected funding URL redirects without auth", async ({ page }) => {
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});
