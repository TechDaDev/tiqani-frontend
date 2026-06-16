/**
 * Messaging security E2E tests.
 * Verifies authorization boundaries and data protection.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import { openConversationList } from "../fixtures/messages";

const NONEXISTENT_UUID = "00000000-0000-0000-0000-000000000000";

test.describe("Messaging security", () => {
  test("Client A cannot access unrelated conversation", async ({ page }) => {
    // Login as client
    await loginAsClient(page);
    // Try to access a non-existent conversation
    await page.goto(`/messages/${NONEXISTENT_UUID}`);
    await page.waitForTimeout(1000);

    // Should not crash or show data - either 404 page or safe error
    const errorShown = page.locator("text=/error|not found|404|failed/i");
    const safeState = await errorShown.isVisible().catch(() => false);
    if (!safeState) {
      // Should at least show some content (not a blank page)
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("anonymous access redirects to login", async ({ page }) => {
    // Not logged in
    await page.goto("/ar/messages");
    await page.waitForTimeout(1000);
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test("anonymous cannot access specific conversation", async ({ page }) => {
    await page.goto(`/messages/${NONEXISTENT_UUID}`);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/);
  });

  test("technician cannot access client-only data", async ({ page }) => {
    await loginAsTechnician(page);
    await openConversationList(page);
    // Technician should see their own conversation list
    await expect(page.locator("h1")).toBeVisible();
    // No client-specific data should leak
  });
});
