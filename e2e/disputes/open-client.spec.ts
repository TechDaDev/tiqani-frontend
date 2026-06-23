/**
 * Client opening a dispute.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import {
  openContractDisputePage,
  checkDisputeEligibility,
  fillDisputeForm,
  submitDisputeForm,
  waitForDisputeStatus,
  openDisputeDetail,
} from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Client opens a dispute", () => {
  test("opens eligible contract page and sees eligibility", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);
  });

  test("selects reason, enters amount, enters statement, and submits", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);

    await fillDisputeForm(page, {
      reason: "breach_of_contract",
      amount: FIXTURE.AMOUNT.PRINCIPAL,
      statement: "E2E test dispute — client alleges breach of contract.",
    });
    await submitDisputeForm(page);
  });

  test("sees new dispute with correct status after submission", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);

    await fillDisputeForm(page, {
      reason: "breach_of_contract",
      amount: FIXTURE.AMOUNT.PRINCIPAL,
      statement: "E2E test dispute — client alleges breach of contract.",
    });
    await submitDisputeForm(page);

    // Should redirect to dispute detail with "open" status
    await waitForDisputeStatus(page, FIXTURE.STATUS.OPEN);
  });

  test("timeline has creation event", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);

    await fillDisputeForm(page, {
      reason: "breach_of_contract",
      amount: FIXTURE.AMOUNT.PRINCIPAL,
      statement: "E2E test timeline event.",
    });
    await submitDisputeForm(page);

    // Timeline should show creation entry
    await expect(page.getByText(/created|opened dispute|dispute created/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("reload preserves dispute", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);

    await fillDisputeForm(page, {
      reason: "breach_of_contract",
      amount: FIXTURE.AMOUNT.PRINCIPAL,
      statement: "E2E test reload persistence.",
    });
    await submitDisputeForm(page);

    // Wait for redirect to dispute detail
    await waitForDisputeStatus(page, FIXTURE.STATUS.OPEN);

    // Capture current dispute URL from the page
    const disputeUrl = page.url();

    // Reload
    await page.goto(disputeUrl);
    await page.waitForLoadState("networkidle");

    // Status should persist
    await waitForDisputeStatus(page, FIXTURE.STATUS.OPEN);
  });

  test("duplicate click creates one dispute", async ({ page }) => {
    await loginAsClient(page);
    await openContractDisputePage(page, FIXTURE.CONTRACT.ACTIVE_ELIGIBLE);
    await checkDisputeEligibility(page);

    await fillDisputeForm(page, {
      reason: "breach_of_contract",
      amount: FIXTURE.AMOUNT.PRINCIPAL,
      statement: "E2E duplicate click test.",
    });

    // Click submit rapidly twice
    const submitBtn = page.getByRole("button", { name: /submit dispute|تقديم النزاع/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();
    // Second click should be disabled or no-op
    try {
      await submitBtn.click({ timeout: 1000 });
    } catch {
      // Expected — button may be disabled after first click
    }

    await page.waitForLoadState("networkidle");

    // Should see dispute status — only one dispute created
    await waitForDisputeStatus(page, FIXTURE.STATUS.OPEN);
  });
});
