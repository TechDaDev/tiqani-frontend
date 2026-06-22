/**
 * Security — body spoofing, sensitive data, duplicate operations.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician } from "../fixtures/auth";
import { openSettlementPageFor, openWallet, openWithdrawals } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Security", () => {
  test("no production credentials exposed", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    await expect(page.getByText(/sk_live_/i)).not.toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/pk_live_/i)).not.toBeVisible({ timeout: 3000 });
  });

  test("no traceback exposed", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    await expect(page.getByText(/traceback/i)).not.toBeVisible({ timeout: 3000 });
  });

  test("no internal wallet ID exposed", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWallet(page);
    await expect(page.getByText(/internal wallet/i)).not.toBeVisible({ timeout: 3000 });
  });

  test("no provider secret exposed", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openWithdrawals(page);
    await expect(page.getByText(/provider secret|sandbox secret/i)).not.toBeVisible({ timeout: 3000 });
  });
});
