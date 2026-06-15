import { test, expect } from "@playwright/test";

test.describe("Protected Routes", () => {
  test("unauthenticated user is redirected from /account", async ({ page }) => {
    await page.goto("/ar/account");
    // Should redirect to login
    await expect(page).toHaveURL(/\/ar\/login/, { timeout: 10000 });
  });

  test("authenticated user can access /account", async ({ page }) => {
    // Login first
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', "client_demo");
    await page.fill('input[name="password"]', "ClientDemo123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/account", { timeout: 15000 });
    await expect(page).toHaveURL(/\/ar\/account/);

    // Logout clears session
    await page.goto("/ar/logout");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/ar\/login/);
  });
});
