/**
 * Successful settlement release.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openSettlementPageFor, openSettlementPage, releaseEscrow, assertSettlementCompleted } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Successful settlement release", () => {
  test("full settlement flow", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);

    // Verify eligibility text
    await expect(page.getByText(/eligible for escrow release/i).first()).toBeVisible({ timeout: 15000 });

    // Release escrow
    await releaseEscrow(page);

    // Assert completed
    await assertSettlementCompleted(page);

    // Reload preserves state
    await openSettlementPage(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    await expect(page.getByText(/settlement receipt/i).first()).toBeVisible({ timeout: 10000 });
  });
});
