/**
 * Playwright E2E: Offer withdrawal.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Offer Withdrawal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', OFFER_USER_FIXTURES.approvedTech.username);
    await page.fill('input[name="password"]', OFFER_USER_FIXTURES.approvedTech.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/ar\/account/);
  });

  test("technician can view withdrawn offer", async ({ page }) => {
    await page.goto(OFFER_PAGES.technicianDetail(OFFER_FIXTURES.withdrawn.uuid));
    await expect(page.locator("text=WITHDRAWN")).toBeVisible();
  });
});
