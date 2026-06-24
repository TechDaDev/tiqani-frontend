/**
 * Admin review of disputes.
 */
import { test, expect } from "@playwright/test";
import { loginAsStaff, loginAsApprovedTechnician } from "../fixtures/auth";
import { openAdminDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Admin review", () => {
  test("staff can view dispute under review", async ({ page }) => {
    await loginAsStaff(page);
    await openAdminDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/traceback|Internal Server Error/i);
  });

  test("non-staff cannot access admin detail", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/assign|تعيين/i);
  });
});
