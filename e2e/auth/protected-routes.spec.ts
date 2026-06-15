import { test, expect } from "@playwright/test";
import { loginAsClient, clearSession } from "../fixtures/auth";

test.describe("Protected Routes", () => {
  test("unauthenticated user is redirected from /account", async ({ page }) => {
    await page.goto("/ar/account");
    // Should redirect to login
    await expect(page).toHaveURL(/\/ar\/login/, { timeout: 10000 });
  });

  test("authenticated user can access /account", async ({ page }) => {
    // Login using fixture
    await loginAsClient(page);
    await expect(page).toHaveURL(/\/ar\/account/);
  });

  test("clearing session forces redirect from /account to login", async ({ page, context }) => {
    // Login, then clear session, then try /account
    await loginAsClient(page);
    await clearSession(context);
    await page.goto("/ar/account");
    await expect(page).toHaveURL(/\/ar\/login/, { timeout: 10000 });
  });
});
