/**
 * Client funding flow — successful sandbox payment.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openContract, openFundingPage, startFunding, confirmSandboxSuccess } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Client funding — success flow", () => {
  test("full success flow", async ({ page }) => {
    await loginAsClient(page);

    // 2. Open eligible unfunded contract
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);

    // 3. See fund button and navigate
    const fundBtn = page.getByRole("link", { name: /fund contract/i });
    await expect(fundBtn).toBeVisible();
    await fundBtn.click();

    // 4. Funding page shows sandbox warning
    await expect(page.getByText(/sandbox/i)).toBeVisible();

    // 5. Create payment intent
    await startFunding(page);

    // 6. Confirm sandbox success
    await confirmSandboxSuccess(page);

    // 7. Contract funded
    await expect(page.getByText(/funding successful/i)).toBeVisible();

    // 8. Reload preserves state
    await page.reload();
    await expect(page.getByText(/funding successful/i)).toBeVisible();
  });
});
