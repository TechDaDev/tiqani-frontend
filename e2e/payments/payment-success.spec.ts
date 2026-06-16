/**
 * Payment success flow.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openFundingPage, startFunding, confirmSandboxSuccess } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment success flow", () => {
  test("sandbox success funds contract", async ({ page }) => {
    await loginAsClient(page);

    await openFundingPage(page, PAYMENT_FIXTURES.DUPLICATE_CONFIRM_CONTRACT_ID);

    await startFunding(page);
    await confirmSandboxSuccess(page);

    await expect(page.getByText(/funding successful/i)).toBeVisible();
  });
});
