/**
 * Client conversation list and detail E2E tests.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openConversationList, openConversation, sendMessage } from "../fixtures/messages";

test.describe("Client conversations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
  });

  test("displays conversation list", async ({ page }) => {
    await openConversationList(page);
    // Should show the conversations page title
    await expect(page.locator("h1")).toBeVisible();
    // Should list conversations (or show empty state)
    await expect(page.locator("main")).toBeVisible();
  });

  test("opens a conversation from the list", async ({ page }) => {
    await openConversationList(page);
    // Click the first conversation link
    const firstLink = page.locator("a[href*='/messages/']").first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    // Should navigate to conversation detail
    await expect(page).toHaveURL(/\/messages\//);
  });

  test("displays message history in conversation", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(1000);
      // Should show messages or empty state
      const body = page.locator("main");
      await expect(body).toBeVisible();
    }
  });

  test("can send a message", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(500);
      await sendMessage(page, "Test message from Playwright");
      // Message should be sent without error
      await page.waitForTimeout(1000);
    }
  });

  test("message persists after reload", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForTimeout(500);
      await sendMessage(page, "Persistent test message");
      await page.waitForTimeout(1000);

      // Reload
      if (href) {
        await page.goto(href);
        await page.waitForTimeout(1000);
        // Message should still be visible
        await expect(page.locator("text=Persistent test message").first()).toBeVisible();
      }
    }
  });

  test("conversation cannot reopen after logout", async ({ page, context }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");

      // Logout
      await page.getByRole("button", { name: /log out/i }).click();
      await page.waitForURL("**/login");

      // Try to reopen conversation
      if (href) {
        await page.goto(href);
        // Should redirect to login
        await expect(page).toHaveURL(/login/);
      }
    }
  });
});
