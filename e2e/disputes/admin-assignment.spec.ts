/**
 * Admin assignment of disputes.
 */
import { test, expect } from "@playwright/test";
import { loginAsStaff, loginAsApprovedTechnician } from "../fixtures/auth";
import { openAdminDisputeList } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Admin assignment", () => {
  test("staff sees dispute queue", async ({ page }) => {
    await loginAsStaff(page);
    await openAdminDisputeList(page);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/traceback|Internal Server Error/i);
  });

  test("non-staff denied from admin queue", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminDisputeList(page);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/assign|تعيين/i);
  });
});
