/**
 * Client funding flow — successful sandbox payment.
 * Navigates directly to fund page to avoid auth-loading race on contract detail.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openFundingPage, startFunding, confirmSandboxSuccess } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Client funding — success flow", () => {
  test("full success flow", async ({ page }) => {
    await loginAsClient(page);

    // Navigate directly to funding page
    await openFundingPage(page, PAYMENT_FIXTURES.SUCCESS_CONTRACT_ID);

    // 2. Funding page shows sandbox warning
    await expect(page.getByText(/sandbox/i)).toBeVisible();

    // 3. Create payment intent
    await startFunding(page);

    // 4. Confirm sandbox success
    await confirmSandboxSuccess(page);

    // 5. Contract funded
    await expect(page.getByText(/funding successful/i)).toBeVisible();

    // 6. Reload — funded status persists
    await page.reload();
    await expect(page.getByText(/funded/i).first()).toBeVisible();
  });
});
