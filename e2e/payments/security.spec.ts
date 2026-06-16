/**
 * Security — financial IDOR and authorization tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import { openContract, openFundingPage } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Financial security", () => {
  test("technician cannot initiate funding", async ({ page }) => {
    await loginAsTechnician(page);
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);
    // Technician should NOT see fund button
    const fundBtn = page.getByRole("link", { name: /fund contract/i });
    await expect(fundBtn).not.toBeVisible();
  });

  test("client cannot fund another clients contract", async ({ page }) => {
    await loginAsClient(page);
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);
    // Should get 404 or no fund button
    const fundBtn = page.getByRole("link", { name: /fund contract/i });
    await expect(fundBtn).not.toBeVisible();
  });

  test("anonymous access redirects", async ({ page }) => {
    await openFundingPage(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});
