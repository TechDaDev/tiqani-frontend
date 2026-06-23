/**
 * Dispute eligibility tests.
 *
 * The contract dispute page renders the DisputeForm directly when eligible,
 * NOT a separate eligibility panel. Ineligible contracts show "not eligible" text.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsSecondTechnician } from "../fixtures/auth";
import { openContractDisputePage, checkDisputeEligibility, checkDisputeIneligibility } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute eligibility", () => {
  test("client sees dispute form on own eligible contract (no pre-existing dispute)", async ({ page }) => {
    await loginAsClient(page);
    // OPEN_ELIGIBLE has no pre-existing dispute, so the form renders directly
    await openContractDisputePage(page, FIXTURE.CONTRACT.OPEN_ELIGIBLE);
    await checkDisputeEligibility(page);
  });

  test("active contract with existing dispute shows active dispute banner", async ({ page }) => {
    await loginAsClient(page);
    // ACTIVE_ELIGIBLE has a pre-existing open dispute, shows banner
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await expect(page.getByTestId("active-dispute-banner")).toBeVisible({ timeout: 10000 });
  });

  test("unrelated user denied — second technician cannot see dispute form", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    // Unrelated user should not see the dispute form
    await expect(page.getByTestId("dispute-form")).not.toBeVisible({ timeout: 10000 });
  });

  test("anonymous user redirected to login", async ({ page }) => {
    await page.goto(`/en/contracts/${FIXTURE.CONTRACT.ACTIVE_ELIGIBLE}/dispute`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });

  test("invalid contract UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/00000000-0000-0000-0000-000000000000/dispute`);
    await page.waitForLoadState("networkidle");
    // Should handle gracefully — no traceback
    await expect(page.getByText(/traceback|Internal Server Error/i)).not.toBeVisible({ timeout: 5000 });
  });
});
