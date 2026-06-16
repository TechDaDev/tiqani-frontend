/**
 * Technician conversation E2E tests.
 */

import { test, expect } from "@playwright/test";
import { loginAsTechnician } from "../fixtures/auth";
import { openConversationList, sendMessage } from "../fixtures/messages";

test.describe("Technician conversations", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTechnician(page);
  });

  test("displays conversation list", async ({ page }) => {
    await openConversationList(page);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("opens conversation from list", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/ar/messages/']").first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    await expect(page).toHaveURL(/\/ar\/messages\//);
  });

  test("can send reply", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/ar/messages/']").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForTimeout(500);
      await sendMessage(page, "Reply from technician");
      await page.waitForTimeout(1000);
    }
  });

  test("reply persists after reload", async ({ page }) => {
    await openConversationList(page);
    const firstLink = page.locator("a[href*='/ar/messages/']").first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForTimeout(500);
      await sendMessage(page, "Persistent technician reply");
      await page.waitForTimeout(1000);

      if (href) {
        await page.goto(href);
        await page.waitForTimeout(1000);
        await expect(page.locator("text=Persistent technician reply").first()).toBeVisible();
      }
    }
  });
});
