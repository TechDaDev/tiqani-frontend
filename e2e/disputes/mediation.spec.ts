/**
 * Dispute mediation.
 */
import { test, expect } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Mediation", () => {
  test("staff sees mediation dispute", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto(`/en/admin/disputes/${FIXTURE.DISPUTE.MEDIATION}`);
    await page.waitForLoadState("networkidle");
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/traceback|Internal Server Error/i);
  });
});
