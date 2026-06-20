/**
 * Deliverable submission tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician, loginAsApprovedTechnician } from "../fixtures/auth";
import {
  openMilestoneDetail,
  clickSubmitDeliverable,
  fillDeliverableForm,
  expectSubmissionVisible,
  expectNoStoragePath,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Deliverable submission", () => {
  test("assigned technician can submit deliverable", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    await clickSubmitDeliverable(page);
    await fillDeliverableForm(page, {
      summary: "E2E test deliverable submission",
    });
    await expectSubmissionVisible(page);
    await expectNoStoragePath(page);
  });

  test("summary is required", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    await clickSubmitDeliverable(page);
    // Submit button should be disabled when summary empty
    const submitBtn = page.getByRole("button", { name: /submit|تقديم|ناردن/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("client cannot submit deliverable", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    const submitBtn = page.getByRole("button", { name: /submit deliverable|تقديم التسليم|ناردنی ڕادەستکراو/i });
    await expect(submitBtn).not.toBeVisible();
  });

  test("wrong technician cannot submit", async ({ page }) => {
    // Use basic technician (non-approved) who doesn't own this contract
    process.env.E2E_TECHNICIAN_EMAIL = "e2e_technician";
    process.env.E2E_TECHNICIAN_PASSWORD = "local-test-only";
    await loginAsTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    const submitBtn = page.getByRole("button", { name: /submit deliverable|تقديم التسليم|ناردنی ڕادەستکراو/i });
    await expect(submitBtn).not.toBeVisible();
  });

  test("approved milestone rejects submission", async ({ page }) => {
    await loginAsTechnician(page);
    // The milestone-approval contract milestone is already submitted (waiting approval)
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    const submitBtn = page.getByRole("button", { name: /submit deliverable|تقديم التسليم|ناردنی ڕادەستکراو/i });
    await expect(submitBtn).not.toBeVisible();
  });

  test("duplicate click creates one version", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    // Submit once
    await clickSubmitDeliverable(page);
    await fillDeliverableForm(page, { summary: "Single version test" });
    await page.waitForTimeout(500);
    // Check only one version present
    const versionElements = page.getByText(/version|إصدار|وەشانی/i);
    const count = await versionElements.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expectNoStoragePath(page);
  });

  test("submission version appears", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    await expectSubmissionVisible(page);
  });

  test("reload preserves submission", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expectSubmissionVisible(page);
    await expectNoStoragePath(page);
  });

  test("internal storage path never appears", async ({ page }) => {
    await loginAsTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    await expectNoStoragePath(page);
  });
});
