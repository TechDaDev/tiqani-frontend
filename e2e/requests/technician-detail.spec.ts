/**
 * E2E tests for technician request detail page.
 */
import { test, expect } from "@playwright/test";
import { loginAsTechnician } from "../fixtures/auth";
import { REQUEST_FIXTURES, REQUEST_PAGES } from "../fixtures/requests";

test.describe("Technician Request Detail", () => {
  test("detail page loads for assigned request", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(REQUEST_PAGES.technicianDetail(REQUEST_FIXTURES.pending.uuid));
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toContain("login");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test("redirects unauthenticated users", async ({ page }) => {
    await page.goto(REQUEST_PAGES.technicianDetail(REQUEST_FIXTURES.pending.uuid));
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/login/);
  });
});
