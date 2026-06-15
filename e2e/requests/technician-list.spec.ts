/**
 * E2E tests for technician request inbox page.
 */
import { test, expect } from "@playwright/test";
import { loginAsTechnician, loginAsClient } from "../fixtures/auth";
import { REQUEST_PAGES } from "../fixtures/requests";

test.describe("Technician Request Inbox", () => {
  test("page loads for authenticated technician", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(REQUEST_PAGES.technicianList);
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toContain("login");
  });

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(REQUEST_PAGES.technicianList);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/login/);
  });

  test("heading visible for authenticated technician", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(REQUEST_PAGES.technicianList);
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });
});
