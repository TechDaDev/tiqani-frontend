/**
 * Dispute eligibility tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsSecondTechnician, clearSession } from "../fixtures/auth";
import { openContractDisputePage, checkDisputeEligibility, checkDisputeIneligibility } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute eligibility", () => {
  test("client sees eligibility on own eligible contract", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);
  });

  test("completion-requested contract is eligible", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.COMPLETION_REQUESTED);
    await checkDisputeEligibility(page);
  });

  test("pre-settlement contract is eligible", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.PRE_SETTLEMENT);
    await checkDisputeEligibility(page);
  });

  test("unrelated user denied — second technician cannot see eligibility", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    // Unrelated user should not see eligibility controls
    await expect(page.getByText(/eligible for dispute|dispute eligibility/i)).not.toBeVisible({ timeout: 10000 });
  });

  test("anonymous user redirected to login", async ({ page }) => {
    await page.goto(`/en/contracts/${FIXTURE.CONTRACT.ACTIVE_ELIGIBLE}/disputes`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });

  test("invalid contract UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/00000000-0000-0000-0000-000000000000/disputes`);
    await page.waitForLoadState("networkidle");
    // Should handle gracefully — no traceback
    await expect(page.getByText(/traceback|Internal Server Error/i)).not.toBeVisible({ timeout: 5000 });
  });
});
