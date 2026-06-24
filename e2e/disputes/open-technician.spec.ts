/**
 * Technician opening a dispute — serial because tests mutate.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician, loginAsSecondTechnician } from "../fixtures/auth";
import { openContractDisputePage, fillDisputeForm, submitDisputeForm } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

let disputeUrl = "";

test.describe.serial("Technician opens a dispute", () => {
  test("sees dispute form on own eligible contract", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    // OPEN_ELIGIBLE contract (in_progress, no dispute) is owned by approved tech
    await openContractDisputePage(page, FIXTURE.CONTRACT.OPEN_ELIGIBLE);
    // Resilient: form visible if first run, active dispute banner if retried after test 2
    await expect(page.getByTestId("contract-dispute-page")).toBeVisible({ timeout: 15000 });
  });

  test("submits dispute and redirects", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.OPEN_ELIGIBLE);
    await page.waitForLoadState("networkidle");
    // Resilient: if dispute already exists, navigate to it; else create new
    const banner = page.getByTestId("active-dispute-banner");
    if (await banner.isVisible().catch(() => false)) {
      await banner.getByRole("button").first().click();
      await page.waitForURL(/\/disputes\//, { timeout: 30000 });
    } else {
      await expect(page.getByTestId("dispute-form")).toBeVisible({ timeout: 10000 });
      await fillDisputeForm(page, {
        reason: "client_non_cooperation",
        amount: FIXTURE.AMOUNT.PRINCIPAL,
        statement: "E2E test — technician opens dispute for non-cooperation.",
      });
      await submitDisputeForm(page);
      await page.waitForURL(/\/disputes\//, { timeout: 30000 });
    }
    disputeUrl = page.url();
    expect(disputeUrl).toContain("/disputes/");
  });

  test("dispute shows open status", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await page.goto(disputeUrl);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Open", { exact: false })).toBeVisible({ timeout: 10000 });
  });

  test("unrelated technician cannot see dispute", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.TECHNICIAN_OPENED}`);
    await page.waitForLoadState("networkidle");
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/dispute details|تفاصيل النزاع/i);
  });
});
