/**
 * Playwright E2E: Client reviews, accepts, and rejects offers.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Client Offer Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.client.username);
    await page.fill('#password', OFFER_USER_FIXTURES.client.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);
  });

  test("client can view incoming offers", async ({ page }) => {
    await page.goto(OFFER_PAGES.clientList);
    // Should see at least the submitted offer
    await expect(page.locator("text=150,000").first()).toBeVisible();
  });

  test("client can view offer detail", async ({ page }) => {
    await page.goto(OFFER_PAGES.clientDetail(OFFER_FIXTURES.submitted.uuid));
    await expect(page.locator("text=Submitted")).toBeVisible();
    await expect(page.locator("text=150,000")).toBeVisible();
  });

  test("client can reject an offer", async ({ page }) => {
    // Accept the confirmation dialog
    page.on("dialog", (dialog) => dialog.accept());

    await page.goto(OFFER_PAGES.clientDetail(OFFER_FIXTURES.forRejection.uuid));
    await expect(page.locator("text=Submitted")).toBeVisible();

    // Click reject
    await page.click("text=Reject Offer");
    await page.waitForTimeout(1000);

    // Verify rejected state
    await expect(page.locator("text=Rejected")).toBeVisible();
  });
});
