/**
 * Responsive layout tests — dispute pages at various viewports.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { FIXTURE } from "../fixtures/disputes";

const VIEWPORTS = [
  { width: 390, height: 844, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1024, height: 768, name: "desktop-small" },
  { width: 1440, height: 900, name: "desktop-large" },
];

test.describe("Responsive dispute page", () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await loginAsClient(page);
      await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
      await page.waitForLoadState("networkidle");
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      expect(overflowX).toBe(true);
    });

    test(`dispute form usable at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await loginAsClient(page);
      await page.goto(`/en/contracts/${FIXTURE.CONTRACT.OPEN_ELIGIBLE}/dispute`);
      await page.waitForLoadState("networkidle");
      const form = page.getByTestId("dispute-form");
      await expect(form).toBeVisible({ timeout: 10000 });
    });
  }
});
