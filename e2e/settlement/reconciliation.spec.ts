/**
 * Financial reconciliation.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician } from "../fixtures/auth";
import { openSettlementPageFor } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Financial reconciliation", () => {
  test("settlement receipt shows correct amounts", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ALREADY_SETTLED_CONTRACT_ID);

    // Should show receipt since already settled
    await expect(page.getByText(/settlement receipt/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(`${SETTLEMENT_FIXTURES.SETTLED_TECH_NET} IQD`, { exact: true }).first()).toBeVisible();
  });
});
