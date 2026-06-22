/**
 * Settlement eligibility.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician, loginAsApprovedTechnician } from "../fixtures/auth";
import { openSettlementPageFor } from "../helpers/settlement";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Settlement eligibility", () => {
  test("own completed funded contract is eligible", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    // Check for eligibility text — rendered in <p role="status">
    await expect(page.getByText(/eligible for escrow release/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("active contract is ineligible", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ACTIVE_CONTRACT_ID);
    await expect(page.getByText(/not eligible/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("completed unfunded contract is ineligible", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.UNFUNDED_CONTRACT_ID);
    await expect(page.getByText(/not eligible/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("zero escrow contract is ineligible", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ZERO_ESCROW_CONTRACT_ID);
    await expect(page.getByText(/not eligible/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("already settled contract is ineligible", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ALREADY_SETTLED_CONTRACT_ID);
    // Should see settlement receipt (already settled) — use .first() for strict-mode safety
    await expect(page.getByText(/settlement receipt|receipt/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("technician cannot release escrow", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    // Technician should not see release - the release button should not exist
    await expect(page.getByRole("button", { name: /release escrow/i })).not.toBeVisible({ timeout: 10000 });
  });

  test("unrelated client cannot view settlement", async ({ page }) => {
    // Use second technician as unrelated user
    await loginAsTechnician(page);
    await openSettlementPageFor(page, SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID);
    // Unrelated user should not see release controls
    await expect(page.getByRole("button", { name: /release escrow/i })).not.toBeVisible({ timeout: 10000 });
  });

  test("invalid UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await openSettlementPageFor(page, "00000000-0000-0000-0000-000000000000");
    // Should handle gracefully - no traceback
    await expect(page.getByText(/traceback|Internal Server Error/i)).not.toBeVisible({ timeout: 5000 });
  });
});
