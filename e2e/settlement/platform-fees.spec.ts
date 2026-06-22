/**
 * Platform fee and reconciliation coverage.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician } from "../fixtures/auth";
import { openSettlementPageFor } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Platform fees and reconciliation", () => {
  test("commission and fee appear in breakdown", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);

    // Use exact text match to avoid strict mode violations
    await expect(page.getByText("50000.00 IQD", { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("25000.00 IQD", { exact: true }).first()).toBeVisible();
  });

  test("platform wallet not shown to ordinary user", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    // Platform wallet text should not be visible
    const pw = page.getByText(/platform wallet/i);
    await expect(pw).not.toBeVisible({ timeout: 3000 });
  });
});
