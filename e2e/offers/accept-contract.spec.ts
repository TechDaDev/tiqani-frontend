/**
 * Playwright E2E: Offer acceptance creates a contract.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_CONTRACT_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Offer Acceptance and Contract", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.client.username);
    await page.fill('#password', OFFER_USER_FIXTURES.client.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);
  });

  test("client can view contract detail from accepted offer", async ({ page }) => {
    // Navigate to contract detail for the contract created from the accepted offer
    await page.goto(OFFER_PAGES.contractDetail(OFFER_CONTRACT_FIXTURES.fromAcceptedOffer.uuid));
    // Wait for page to load (allows up to 15s for first compilation)
    await page.waitForLoadState("networkidle", { timeout: 15_000 });
    // Should show contract details without error
    await expect(page.locator("body")).toContainText("Scope of Work");
  });
});
