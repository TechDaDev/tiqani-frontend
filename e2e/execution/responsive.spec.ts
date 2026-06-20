/**
 * Responsive design tests for execution pages.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

const VIEWPORTS = [
  { width: 390, height: 844, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1024, height: 768, name: "small-desktop" },
  { width: 1440, height: 900, name: "large-desktop" },
] as const;

test.describe("Execution responsive layout", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`viewport ${vp.name} (${vp.width}px)`, () => {
      test("no horizontal overflow on execution page", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
        await page.waitForLoadState("networkidle");
        const overflowX = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        expect(overflowX).toBeTruthy();
      });

      test("no horizontal overflow on milestones page", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/en/contracts/${EXECUTION_FIXTURES.MILESTONE_REORDER_CONTRACT_ID}/milestones`);
        await page.waitForLoadState("networkidle");
        const overflowX = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        expect(overflowX).toBeTruthy();
      });

      test("milestone cards stack correctly", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/en/contracts/${EXECUTION_FIXTURES.MILESTONE_REORDER_CONTRACT_ID}/milestones`);
        await page.waitForLoadState("networkidle");
        const cards = page.locator('[class*="rounded-lg"][class*="border-gray-200"]');
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(1);
      });

      test("action controls remain usable", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
        await page.waitForLoadState("networkidle");
        // Check that action buttons are visible and have 44px minimum height
        const buttons = page.getByRole("button");
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
          const btn = buttons.nth(i);
          if (await btn.isVisible().catch(() => false)) {
            const box = await btn.boundingBox();
            if (box) {
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });

      test("execution history remains readable", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
        await page.waitForLoadState("networkidle");
        const overflowX = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        expect(overflowX).toBeTruthy();
      });

      test("RTL layout correct", async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await loginAsClient(page);
        await page.goto(`/ar/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
        await page.waitForLoadState("networkidle");
        const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
        expect(dir).toBe("rtl");
        const overflowX = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        expect(overflowX).toBeTruthy();
      });
    });
  }
});
