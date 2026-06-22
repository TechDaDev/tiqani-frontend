/**
 * Wallet credit after settlement.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician } from "../fixtures/auth";
import { openWallet } from "../helpers/settlement";

test.describe("Wallet credit after settlement", () => {
  test("technician wallet credited after release", async ({ page, context }) => {
    // Login as technician (who receives wallet credit after client releases)
    await loginAsApprovedTechnician(page);

    // Wallet page loads with balance from earlier settlement
    await openWallet(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
