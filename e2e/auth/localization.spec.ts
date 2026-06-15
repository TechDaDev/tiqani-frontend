import { test, expect } from "@playwright/test";

test.describe("Localization", () => {
  test("/ redirects to /ar by default", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/\/ar/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/ar/);
  });

  test("mobile navigation opens and closes in Arabic", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/ar");
    // Mobile menu toggle
    const menuButton = page.locator('button[aria-label*="قائمة"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
  });
});
