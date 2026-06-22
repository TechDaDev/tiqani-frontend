/**
 * Responsive and accessibility coverage.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

const VIEWPORTS = [
  { width: 390, height: 844, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1024, height: 768, name: "desktop-small" },
  { width: 1440, height: 900, name: "desktop-large" },
];

for (const vp of VIEWPORTS) {
  test.describe(`Viewport ${vp.name} (${vp.width}x${vp.height})`, () => {
    test("settlement page has no horizontal overflow", async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await loginAsClient(page);
      await page.goto(`/en/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
      await page.waitForLoadState("networkidle");
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      expect(overflowX).toBeTruthy();
    });
  });
}
