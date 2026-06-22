/**
 * Settlement idempotency.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openSettlementPageFor, releaseEscrow, assertSettlementCompleted } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Settlement idempotency", () => {
  test("duplicate release does not create duplicate settlement", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.DUPLICATE_CONTRACT_ID);

    await expect(page.getByText(/eligible/i)).toBeVisible({ timeout: 15000 });
    await releaseEscrow(page);
    await assertSettlementCompleted(page);

    // Navigate away and back
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.DUPLICATE_CONTRACT_ID);
    await expect(page.getByText(/settlement receipt/i)).toBeVisible({ timeout: 15000 });

    // Should not show release checkbox again
    await expect(page.getByRole("checkbox", { name: /confirm/i })).not.toBeVisible({ timeout: 5000 });
  });
});
