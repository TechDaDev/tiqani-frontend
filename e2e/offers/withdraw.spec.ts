/**
 * Playwright E2E: Offer withdrawal.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Offer Withdrawal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.approvedTech.username);
    await page.fill('#password', OFFER_USER_FIXTURES.approvedTech.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);
  });

  test("technician can view withdrawn offer", async ({ page }) => {
    await page.goto(OFFER_PAGES.technicianDetail(OFFER_FIXTURES.withdrawn.uuid));
    await expect(page.locator("body")).toContainText("Withdrawn");
  });
});
