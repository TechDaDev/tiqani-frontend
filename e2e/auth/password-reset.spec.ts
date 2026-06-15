import { test, expect } from "@playwright/test";

test.describe("Password Reset", () => {
  test("forgot password page loads", async ({ page }) => {
    await page.goto("/ar/forgot-password");
    await expect(page.locator("text=استعادة كلمة المرور").first()).toBeVisible({ timeout: 5000 });
  });
});
