/**
 * E2E tests for client request listing page.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { REQUEST_FIXTURES, REQUEST_PAGES } from "../fixtures/requests";

test.describe("Client Request List", () => {
  test("page loads and shows content for authenticated client", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(REQUEST_PAGES.clientList);
    await page.waitForLoadState("networkidle");

    // Page should not redirect to login
    expect(page.url()).not.toContain("login");
    // Page should have at least some visible content
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test("shows title heading", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(REQUEST_PAGES.clientList);
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(REQUEST_PAGES.clientList);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/login/);
  });
});
