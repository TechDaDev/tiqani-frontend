/**
 * E2E tests for the client request creation page.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { REQUEST_PAGES } from "../fixtures/requests";

test.describe("Client Create Request", () => {
  test("shows create request form for authenticated client", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(REQUEST_PAGES.clientNew);
    await page.waitForLoadState("networkidle");

    // The page should have a form or heading
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(REQUEST_PAGES.clientNew);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/login/);
  });
});
