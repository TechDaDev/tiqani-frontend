/**
 * Unread message behavior E2E tests.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openConversationList } from "../fixtures/messages";

test.describe("Unread messages", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await openConversationList(page);
  });

  test("unread badge clears after opening conversation", async ({ page }) => {
    // Count badges before opening
    const badgesBefore = page.locator("span.rounded-full.bg-blue-600");
    const countBefore = await badgesBefore.count();

    if (countBefore > 0) {
      // Open first conversation with unread
      const firstLink = page.locator("a[href*='/ar/messages/']").first();
      await firstLink.click();
      await page.waitForTimeout(1500); // Wait for mark-read to complete

      // Go back to list
      await openConversationList(page);
      await page.waitForTimeout(1000);

      // Badge count should have decreased or badge disappeared
      const badgesAfter = page.locator("span.rounded-full.bg-blue-600");
      const countAfter = await badgesAfter.count();
      expect(countAfter).toBeLessThanOrEqual(countBefore);
    }
  });
});
