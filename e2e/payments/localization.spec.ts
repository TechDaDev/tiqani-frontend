/**
 * Localization — Arabic and Kurdish payment UI.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Payment localization", () => {
  test("Arabic page has RTL direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${PAYMENT_FIXTURES.FUNDED_VIEW_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("Arabic shows funding status", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${PAYMENT_FIXTURES.LOCALIZATION_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/غير ممول|تمويل/i);
  });

  test("Arabic sandbox warning on funding page", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${PAYMENT_FIXTURES.LOCALIZATION_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/اختبارية|وهمي/i);
  });

  test("Kurdish page has RTL direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/contracts/${PAYMENT_FIXTURES.FUNDED_VIEW_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("Kurdish shows funding status", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/contracts/${PAYMENT_FIXTURES.LOCALIZATION_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/پاره‌دار نه‌کراوه|پاره‌دار/i);
  });
});
