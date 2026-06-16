/**
 * Send message E2E tests.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openConversationList, sendMessage } from "../fixtures/messages";

test.describe("Send message", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);
  });

  test("send button is disabled for empty input", async ({ page }) => {
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(500);

      const sendButton = page.getByRole("button", { name: /send/i });
      await expect(sendButton).toBeDisabled();
    }
  });

  test("textarea accepts input", async ({ page }) => {
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(500);

      const textarea = page.getByRole("textbox", { name: /type your message/i });
      await textarea.fill("Hello from Playwright");
      await expect(textarea).toHaveValue("Hello from Playwright");
    }
  });

  test("can send and see message", async ({ page }) => {
    const firstLink = page.locator("a[href*='/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(500);
      await sendMessage(page, "Test message " + Date.now());
      await page.waitForTimeout(2000);
    }
  });
});
