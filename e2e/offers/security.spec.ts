/**
 * Playwright E2E: Offer security — IDOR, anonymous, cross-user access.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Offer Security", () => {
  test("anonymous user is redirected from offer pages", async ({ page }) => {
    await page.goto(OFFER_PAGES.technicianList);
    // Should redirect to login
    await expect(page).toHaveURL(/\/ar\/login/);
  });

  test("client cannot view technician offer list", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', OFFER_USER_FIXTURES.client.username);
    await page.fill('input[name="password"]', OFFER_USER_FIXTURES.client.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/ar\/account/);

    // Try to access technician offers (should show empty or 404)
    await page.goto(OFFER_PAGES.technicianList);
    // Client might see a 403-style message or empty state
    await expect(page.locator("text=No offers").or(page.locator("text=denied"))).toBeVisible();
  });

  test("technician cannot access client B offer", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill('input[name="username"]', OFFER_USER_FIXTURES.approvedTech.username);
    await page.fill('input[name="password"]', OFFER_USER_FIXTURES.approvedTech.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/ar\/account/);

    // Try to view cross-client offer
    await page.goto(OFFER_PAGES.technicianDetail(OFFER_FIXTURES.crossClient.uuid));
    // Should show not-found or error
    await expect(page.locator("text=not found").or(page.locator("text=NotFound"))).toBeVisible();
  });
});
