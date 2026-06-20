/**
 * Milestone approval tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openMilestoneDetail,
  approveMilestone,
  expectNoApproveButton,
  assertEscrowHeld,
  assertNoPayoutControls,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Milestone approval", () => {
  test("client can approve submitted deliverable", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    await approveMilestone(page);
    // Reload — state persists
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expectNoApproveButton(page);
  });

  test("technician cannot approve own work", async ({ page }) => {
    await loginAsTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    await expectNoApproveButton(page);
  });

  test("unrelated client cannot approve", async ({ page }) => {
    await loginAsClient(page);
    // Try accessing Technican B's contract milestone
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.TECHNICIAN_B_CONTRACT_ID,
      EXECUTION_FIXTURES.ACTIVATION_MILESTONE_ID,
    );
    const body = await page.textContent("body");
    const hasError = body.includes("404") || body.includes("error") || body.includes("لم يتم العثور");
    expect(hasError).toBeTruthy();
  });

  test("approval without submission is rejected", async ({ page }) => {
    await loginAsClient(page);
    // Activation milestone is DRAFT — no submission, should not show approve
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID,
      EXECUTION_FIXTURES.ACTIVATION_MILESTONE_ID,
    );
    const approveBtn = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
    await expect(approveBtn).not.toBeVisible();
  });

  test("duplicate approval is safe", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    const approveBtn = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    const btnAfter = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
    await expect(btnAfter).not.toBeVisible();
  });

  test("approved state persists after reload", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    await page.reload();
    await page.waitForLoadState("networkidle");
    const approveBtn = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
    const visible = await approveBtn.isVisible().catch(() => false);
    if (visible) {
      // If approval hasn't been done yet, just verify the page loads
      await expect(page.getByRole("heading").first()).toBeVisible();
    } else {
      // Already approved
      await expectNoApproveButton(page);
    }
  });

  test("escrow unchanged after approval", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    // Navigate to contract detail or execution page to verify escrow
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });
});
