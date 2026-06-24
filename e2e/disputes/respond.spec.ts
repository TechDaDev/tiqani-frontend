/**
 * Responding to a dispute.
 */
import { test, expect } from "@playwright/test";
import { loginAsApprovedTechnician, loginAsClient } from "../fixtures/auth";
import { openDisputeDetail, addStatement } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute response", () => {
  test("respondent can add statement to awaiting-response dispute", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    await addStatement(page, "E2E test response statement explaining the situation in detail.");
  });

  test("statement persists after reload", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/explaining the situation/i);
  });

  test("non-respondent cannot add statement", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.AWAITING_RESPONSE);
    // Statement textbox should not be available for the opener
    const statementInput = page.getByRole("textbox", { name: /add statement|إضافة بيان/i });
    await expect(statementInput).not.toBeVisible({ timeout: 5000 });
  });
});
