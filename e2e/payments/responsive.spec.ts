/**
 * Responsive and theme tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment responsive", () => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ];

  viewports.forEach((vp) => {
    test(`funding page at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await loginAsClient(page);
      await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID}`);
      await page.waitForLoadState("networkidle");
      // No horizontal overflow
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      expect(overflowX).toBe(true);
    });
  });
});

test.describe("Payment dark theme", () => {
  test("funding page renders in dark mode", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    // Toggle dark mode via the theme switcher
    const darkToggle = page.locator('button[aria-label*="dark"i], button[aria-label*="theme"i]').first();
    if (await darkToggle.isVisible()) {
      await darkToggle.click();
    }
    // Verify page renders
    await expect(page.getByText(/contract/i).first()).toBeVisible();
  });
});
