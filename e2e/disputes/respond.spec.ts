/**
 * Responding to a dispute.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician, loginAsSecondTechnician } from "../fixtures/auth";
import { openDisputeDetail, addStatement } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute response", () => {
  test("respondent can add statement to awaiting-response dispute", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    await addStatement(page, "E2E test response statement explaining the situation in detail.");
  });

  test("statements render from API", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    // Verify seed statements render (proves API + mapper work)
    await expect(page.getByText("Quality of work is below")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("I delivered all work as agreed")).toBeVisible({ timeout: 10000 });
  });

  test("unrelated user cannot add statement", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    // Unrelated user should not see statement form on this dispute
    const statementInput = page.getByRole("textbox", { name: /add statement|إضافة بيان/i });
    await expect(statementInput).not.toBeVisible({ timeout: 5000 });
  });
});
