/**
 * Payment failure flow.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openFundingPage, startFunding, confirmSandboxFailure } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment success flow", () => {
  test("sandbox success funds contract", async ({ page }) => {
    await loginAsClient(page);

    await openFundingPage(page, PAYMENT_FIXTURES.CLIENT_A_FAILURE_CONTRACT_ID);

    await startFunding(page);
    await confirmSandboxFailure(page);

    await expect(page.getByText(/payment failed/i)).toBeVisible();
  });
});
