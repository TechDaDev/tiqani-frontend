/**
 * Chargeback received display.
 */
import { test, expect } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";
import { openChargebackList } from "../helpers/disputes";

test.describe("Chargeback received", () => {
  test("staff sees chargeback list", async ({ page }) => {
    await loginAsStaff(page);
    await openChargebackList(page);
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/traceback|Internal Server Error/i);
  });

  test("non-staff redirected from chargeback list", async ({ page }) => {
    await page.goto("/en/admin/chargebacks");
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });
});
