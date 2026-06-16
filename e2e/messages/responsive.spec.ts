/**
 * Messaging responsive E2E tests.
 * Validates layout at various viewport sizes.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openConversationList } from "../fixtures/messages";

test.describe("Messaging responsive", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
  });

  test("mobile viewport (390px) has no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openConversationList(page);
    await page.waitForTimeout(500);
    // Check for horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth - viewportWidth).toBeLessThan(50); // Allow minimal overflow from scrollbar
  });

  test("tablet viewport (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openConversationList(page);
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth - viewportWidth).toBeLessThan(50);
  });

  test("desktop viewport (1024px)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await openConversationList(page);
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth - viewportWidth).toBeLessThan(50);
  });

  test("wide viewport (1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openConversationList(page);
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth - viewportWidth).toBeLessThan(50);
  });
});
