/**
 * Idempotency tests — duplicate funding prevention.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openFundingPage } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Funding idempotency", () => {
  test("double-click creates one pending intent", async ({ page }) => {
    await loginAsClient(page);
    await openFundingPage(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);

    // Rapid double-click
    const btn = page.getByRole("button", { name: /start funding/i });
    await btn.click();
    await btn.click({ delay: 50 });

    // Should show intent created once
    await expect(page.getByText(/payment intent created/i)).toBeVisible({ timeout: 10000 });
    // No duplicate error
    const errorText = page.getByText(/error/i);
    await expect(errorText).not.toBeVisible();
  });

  test("funded contract cannot start funding again", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_FUNDED_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");

    // Fund button should not exist for already-funded contract
    const fundBtn = page.getByRole("link", { name: /fund contract/i });
    await expect(fundBtn).not.toBeVisible();
  });
});
