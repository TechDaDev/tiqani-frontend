import { test, expect } from "@playwright/test";
import { loginAsClient, expectNoTokensInStorage } from "../fixtures/auth";

test.describe("Session Persistence", () => {
  test("page reload preserves auth session", async ({ page }) => {
    // Login using fixture
    await loginAsClient(page);

    // Reload
    await page.reload();
    await page.waitForURL("**/account", { timeout: 10000 });
    await expect(page).toHaveURL(/\/ar\/account/);
  });

  test("auth tokens not stored in localStorage or sessionStorage", async ({ page }) => {
    await loginAsClient(page);
    await expectNoTokensInStorage(page);
  });
});
