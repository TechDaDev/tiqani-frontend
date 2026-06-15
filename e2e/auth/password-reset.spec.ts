import { test, expect } from "@playwright/test";

test.describe("Password Reset", () => {
  test("forgot password page loads", async ({ page }) => {
    await page.goto("/ar/forgot-password");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toBeVisible();
  });
});
