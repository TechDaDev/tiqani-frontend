/**
 * Chargeback partial display.
 */
import { test, expect } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Chargeback partial", () => {
  test("staff chargeback list loads", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto(`/en/admin/chargebacks`);
    await page.waitForLoadState("networkidle");
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/traceback|Internal Server Error/i);
  });
});
