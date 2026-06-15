import { test, expect } from "@playwright/test";

test.describe("Session Persistence", () => {
  test("page reload preserves auth session", async ({ page }) => {
    // Login
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', "client_demo");
    await page.fill('input[name="password"]', "ClientDemo123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/account", { timeout: 15000 });

    // Reload
    await page.reload();
    await page.waitForURL("**/account", { timeout: 10000 });
    await expect(page).toHaveURL(/\/ar\/account/);
  });

  test("auth tokens not stored in localStorage or sessionStorage", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', "client_demo");
    await page.fill('input[name="password"]', "ClientDemo123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/account", { timeout: 15000 });

    const localStorageData = await page.evaluate(() => ({ ...localStorage }));
    const sessionStorageData = await page.evaluate(() => ({ ...sessionStorage }));

    // No auth tokens in browser storage
    for (const key of Object.keys({ ...localStorageData, ...sessionStorageData })) {
      expect(key.toLowerCase()).not.toContain("token");
      expect(key.toLowerCase()).not.toContain("access");
      expect(key.toLowerCase()).not.toContain("refresh");
      expect(key.toLowerCase()).not.toContain("jwt");
    }
  });
});
