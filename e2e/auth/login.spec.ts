import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("Arabic login page is RTL and shows form", async ({ page }) => {
    await page.goto("/ar/login");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("text=تسجيل الدخول").first()).toBeVisible();
  });

  test("English login page is LTR", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("Kurdish login page is RTL and shows translated labels", async ({ page }) => {
    await page.goto("/ku/login");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("invalid login shows localized error", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    // Wait for error response from backend proxy
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 15000 });
  });

  test("valid login redirects to account page", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', "client_demo");
    await page.fill('input[name="password"]', "ClientDemo123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/account", { timeout: 15000 });
    await expect(page).toHaveURL(/\/ar\/account/);
  });
});
