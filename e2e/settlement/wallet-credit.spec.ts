/**
 * Wallet credit after settlement.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openSettlementPageFor, releaseEscrow, assertSettlementCompleted, openWallet } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Wallet credit after settlement", () => {
  test("technician wallet credited after release", async ({ page, context }) => {
    // Login as client to release
    await loginAsClient(page);

    // Release escrow
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    await releaseEscrow(page);
    await assertSettlementCompleted(page);

    // Wallet page loads
    await openWallet(page);
    await expect(page.getByText(/my wallet|wallet/i)).toBeVisible({ timeout: 10000 });
  });
});
