import { test, expect } from "@playwright/test";

test.describe("Registration Page", () => {
  test("registration page loads and shows form", async ({ page }) => {
    await page.goto("/ar/register");
    await expect(page.locator("text=إنشاء حساب").first()).toBeVisible();
  });

  test("registration reaches Django and shows field errors for empty form", async ({ page }) => {
    await page.goto("/ar/register");
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 15000 });
  });
});
