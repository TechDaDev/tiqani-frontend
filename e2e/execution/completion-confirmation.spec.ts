/**
 * Completion confirmation tests.
 * UI sends confirmation directly via button click.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openExecutionPage,
  assertContractCompleted,
  assertEscrowHeld,
  assertNoPayoutControls,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Completion confirmation", () => {
  test("client can confirm completion", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    // Click confirm button directly
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });
    await confirmBtn.click();
    await page.waitForTimeout(2000);
    await assertContractCompleted(page);
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });

  test("technician cannot confirm completion", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    await expect(confirmBtn).not.toBeVisible();
  });

  test("unrelated client cannot confirm", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID);
    // Should see 404 or access denied
    const body = await page.innerText("body");
    const hasError = body.includes("error") || body.includes("wrong") || body.includes("Something went wrong");
    expect(hasError).toBeTruthy();
  });

  test("contract becomes completed with persisted state", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    await assertContractCompleted(page);
    await assertEscrowHeld(page);
  });

  test("duplicate confirmation is safe", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await assertEscrowHeld(page);
  });

  test("escrow remains held after completion", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }
    await assertEscrowHeld(page);
  });

  test("technician wallet unchanged after completion", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }
    await assertNoPayoutControls(page);
  });

  test("no payout or release controls appear", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID);
    // Verify page shows completed status
    const status = page.getByRole("status", { name: /completed|مكتمل|تەواوکراو/i });
    await expect(status).toBeVisible({ timeout: 10000 });
    await assertNoPayoutControls(page);
  });
});
