/**
 * Messaging logout behavior E2E tests.
 * Verifies conversation access is blocked after logout.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openConversationList } from "../fixtures/messages";

test.describe("Messaging logout", () => {
  test("conversation list redirects to login after logout", async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);

    // Logout
    await page.getByRole("button", { name: /log out/i }).click();
    await page.waitForTimeout(1000);

    // Try to access messages
    await page.goto("/ar/messages");
    await page.waitForTimeout(1000);

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test("specific conversation redirects after logout", async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);

    await page.getByRole("button", { name: /log out/i }).click();
    await page.waitForTimeout(1000);

    await page.goto("/ar/messages/some-conversation-id");
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/login/);
  });
});
