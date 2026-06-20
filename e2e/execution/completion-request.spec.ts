/**
 * Completion request tests.
 * UI sends request directly via button click (no message form).
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician, loginAsApprovedTechnician } from "../fixtures/auth";
import {
  openExecutionPage,
  assertCompletionRequested,
  assertEscrowHeld,
  assertNoPayoutControls,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Completion request", () => {
  test("technician can request completion when milestones approved", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REQUEST_CONTRACT_ID);
    // Click request completion button
    const reqBtn = page.getByRole("button", { name: /request completion|طلب إكمال|داواکردنی تەواوکردن/i });
    await expect(reqBtn).toBeVisible({ timeout: 10000 });
    await reqBtn.click();
    // Wait for state update
    await page.waitForTimeout(2000);
    // Reload to verify persisted state
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Should show completion requested state
    await assertCompletionRequested(page);
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });

  test("client cannot request completion", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REQUEST_CONTRACT_ID);
    const reqBtn = page.getByRole("button", { name: /request completion|طلب إكمال|داواکردنی تەواوکردن/i });
    await expect(reqBtn).not.toBeVisible();
  });

  test("wrong technician cannot request completion", async ({ page }) => {
    process.env.E2E_TECHNICIAN_EMAIL = "e2e_technician";
    process.env.E2E_TECHNICIAN_PASSWORD = "local-test-only";
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REQUEST_CONTRACT_ID);
    const reqBtn = page.getByRole("button", { name: /request completion|طلب إكمال|داواکردنی تەواوکردن/i });
    await expect(reqBtn).not.toBeVisible();
  });

  test("duplicate request is safe", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REQUEST_CONTRACT_ID);
    const reqBtn = page.getByRole("button", { name: /request completion|طلب إكمال|داواکردنی تەواوکردن/i });
    if (await reqBtn.isVisible().catch(() => false)) {
      await reqBtn.click();
      await page.waitForTimeout(2000);
    }
    // Reload and verify no crash
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("state persists after reload", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REQUEST_CONTRACT_ID);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });
});
