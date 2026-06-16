/**
 * Payment failure flow.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openFundingPage, startFunding, confirmSandboxFailure } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment failure flow", () => {
  test("sandbox failure does not fund contract", async ({ page }) => {
    await loginAsClient(page);

    await openFundingPage(page, PAYMENT_FIXTURES.FAILURE_CONTRACT_ID);

    await startFunding(page);
    await confirmSandboxFailure(page);

    await expect(page.getByText(/payment failed/i)).toBeVisible();
  });
});
