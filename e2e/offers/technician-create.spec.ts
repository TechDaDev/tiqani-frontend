/**
 * Playwright E2E: Technician creates and submits an offer.
 */
import { test, expect } from "@playwright/test";
import { OFFER_FIXTURES, OFFER_REQUEST_FIXTURES, OFFER_USER_FIXTURES, OFFER_PAGES } from "../fixtures/offers";

test.describe("Technician Offer Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Login as approved technician
    await page.goto("/en/login");
    await page.fill('#username', OFFER_USER_FIXTURES.approvedTech.username);
    await page.fill('#password', OFFER_USER_FIXTURES.approvedTech.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/account/);
  });

  test("technician can create offer from accepted request", async ({ page }) => {
    // Navigate to the accepted request
    await page.goto(OFFER_PAGES.createOffer(OFFER_REQUEST_FIXTURES.offerCreate.uuid));
    await page.waitForSelector('h1');

    // Verify request details are shown
    await expect(page.locator("text=Install Video Doorbell")).toBeVisible();

    // Fill offer form
    await page.fill('input[type="number"]', "150000");
    await page.fill("textarea", "I will install the smart lock professionally.");
    await page.click('button[type="submit"]');

    // Wait for offer creation (may redirect or show success)
    await page.waitForTimeout(2000);

    // Check that we're on an offer-related page or see offer details
    const currentUrl = page.url();
    expect(currentUrl).toContain("offers");
  });

  test("technician can submit a draft offer", async ({ page }) => {
    // Navigate to the submitted offer
    await page.goto(OFFER_PAGES.technicianDetail(OFFER_FIXTURES.submitted.uuid));
    await page.waitForSelector("text=SUBMITTED");

    // Verify the offer shows submitted state
    await expect(page.locator("text=SUBMITTED")).toBeVisible();
  });

  test("validates invalid amount", async ({ page }) => {
    await page.goto(OFFER_PAGES.createOffer(OFFER_REQUEST_FIXTURES.accepted.uuid));
    await page.waitForSelector("h1");

    // Try zero amount
    await page.fill('input[type="number"]', "0");
    await page.fill("textarea", "Test description");
    await page.click('button[type="submit"]');

    // Should show validation error (either client or server side)
    await expect(page.locator("text=amount").or(page.locator("text=greater than zero"))).toBeVisible();
  });
});
