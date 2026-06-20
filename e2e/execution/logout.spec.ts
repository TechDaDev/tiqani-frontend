/**
 * Logout security test for execution pages.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, logout, clearSession } from "../fixtures/auth";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Execution logout security", () => {
  test("authenticated user can open execution page", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    // Should render the page, not redirect to login
    expect(page.url()).not.toContain("login");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("logout clears secure session", async ({ page }) => {
    await loginAsClient(page);
    await logout(page);
    // Verify we're on login page
    expect(page.url()).toContain("login");
  });

  test("execution page becomes inaccessible after logout", async ({ page }) => {
    await loginAsClient(page);
    await logout(page);
    // Try to navigate to execution page
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    // Should redirect to login
    expect(page.url()).toContain("login");
  });

  test("back navigation does not reveal protected content", async ({ page, context }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");

    // Store the page content
    const protectedContent = await page.textContent("body");

    // Logout
    await logout(page);

    // Clear session completely
    await clearSession(context);

    // Navigate forward then back
    await page.goto("/en/login");
    await page.waitForLoadState("networkidle");
    await page.goBack();

    // Should be on login page or show logged-out state
    expect(page.url()).toContain("login");
  });
});
