/**
 * Messaging logout behavior E2E tests.
 * Verifies conversation access is blocked after logout.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient, logout } from "../fixtures/auth";
import { openConversationList } from "../fixtures/messages";

test.describe("Messaging logout", () => {
  test("conversation list redirects to login after logout", async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);

    await logout(page);

    // Try to access messages
    await page.goto("/ar/messages");
    // Should redirect to login (allow up to 15s for middleware compilation)
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  });

  test("specific conversation redirects after logout", async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);

    await logout(page);

    await page.goto("/ar/messages/some-conversation-id");
    // Allow up to 15s for middleware compilation on fresh Next.js dev boot
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  });
});
