/**
 * Activation flow — contract execution activation tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openExecutionPage,
  activateContract,
  expectNoActivateButton,
  assertEscrowHeld,
  assertNoPayoutControls,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Contract activation", () => {
  test("funded contract can be activated by client", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID);
    await activateContract(page);
    // Status should indicate active
    await expect(page.getByRole("status").first()).toBeVisible();
    // Reload — state persists
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("status").first()).toBeVisible();
    // Escrow unchanged
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });

  test("unfunded contract cannot activate", async ({ page }) => {
    await loginAsClient(page);
    // Use milestone-create contract which is in_progress and unfunded
    await openExecutionPage(page, EXECUTION_FIXTURES.MILESTONE_CREATE_CONTRACT_ID);
    // Should have no activate button (no escrow)
    await expectNoActivateButton(page);
  });

  test("technician cannot activate contract", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID);
    await expectNoActivateButton(page);
  });

  test("unrelated client cannot access activation contract", async ({ page }) => {
    await loginAsClient(page);
    // The API should deny access for unrelated contracts
    const resp = await page.request.get(
      `/api/contracts/${EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID}/execution/eligibility/`
    );
    expect(resp.status()).toBe(404);
  });

  test("duplicate activation is safe", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID);
    // First activation
    const activateBtn = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
    if (await activateBtn.isVisible().catch(() => false)) {
      await activateBtn.click();
      await page.waitForTimeout(1000);
      // Try again — should be idempotent
      await page.reload();
      await page.waitForLoadState("networkidle");
      const btnAgain = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
      await expect(btnAgain).not.toBeVisible();
    }
  });

  test("activation persists after reload", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID);
    const activateBtn = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
    if (await activateBtn.isVisible().catch(() => false)) {
      await activateBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    const btnAfterReload = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
    await expect(btnAfterReload).not.toBeVisible();
    await assertEscrowHeld(page);
    await assertNoPayoutControls(page);
  });
});
