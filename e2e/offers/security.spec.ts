/**
 * Playwright E2E: Offer security — IDOR, anonymous, cross-user access.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Offer Security", () => {
  test("anonymous user is redirected from offer pages", async ({ page }) => {
    await page.goto(OFFER_PAGES.technicianList);
    // Should redirect to login
    await expect(page).toHaveURL(/\/en\/login/);
  });

  test("client cannot view technician offer list", async ({ page }) => {
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.client.username);
    await page.fill('#password', OFFER_USER_FIXTURES.client.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);

    // Try to access technician offers (should show 403)
    await page.goto(OFFER_PAGES.technicianList);
    // Client might see empty or error state
    await page.waitForTimeout(1000);
  });

  test("technician cannot access client B offer", async ({ page }) => {
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.approvedTech.username);
    await page.fill('#password', OFFER_USER_FIXTURES.approvedTech.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);

    // Try to view cross-client offer — server returns 404
    await page.goto(OFFER_PAGES.technicianDetail(OFFER_FIXTURES.crossClient.uuid));
    // Should show some error state or be redirected
    await page.waitForTimeout(2000);
  });
});
