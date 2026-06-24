/**
 * Dispute localization — Arabic and Kurdish translations.
 *
 * Use innerText() not textContent("body") to avoid RSC server payload data.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute localization", () => {
  // ── English ───────────────────────────────────────────────────────────

  test("English dispute page loads showing status badge", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    // Check heading presence
    await expect(page.getByRole("heading", { name: /dispute details/i })).toBeVisible({ timeout: 10000 });
  });

  test("English page has LTR direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  // ── Arabic ────────────────────────────────────────────────────────────

  test("Arabic dispute page loads", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /تفاصيل النزاع/i })).toBeVisible({ timeout: 10000 });
  });

  test("Arabic page has RTL direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("Arabic dispute creation form translated", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${FIXTURE.CONTRACT.OPEN_ELIGIBLE}/dispute`);
    await page.waitForLoadState("networkidle");
    // Check for form elements with Arabic labels
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/نزاع|سبب|مبلغ/i);
  });

  // ── Kurdish ───────────────────────────────────────────────────────────

  test("Kurdish dispute page loads", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    // Check Kurdish heading: "وردەکاری ناکۆکی" = Dispute Details
    await expect(page.getByRole("heading", { name: /وردەکاری ناکۆکی/i })).toBeVisible({ timeout: 10000 });
  });

  test("Kurdish page has RTL direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  // ── Status badges across locales ──────────────────────────────────────

  test("all dispute status badges rendered without raw keys", async ({ page }) => {
    await loginAsClient(page);

    // Open dispute
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const openText = await page.locator("body").innerText();
    expect(openText).not.toMatch(/dispute\.status\.open/i);

    // Under review dispute
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.UNDER_REVIEW}`);
    await page.waitForLoadState("networkidle");
    const reviewText = await page.locator("body").innerText();
    expect(reviewText).not.toMatch(/dispute\.status\.under_review/i);

    // Resolved dispute
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.FULL_REFUND}`);
    await page.waitForLoadState("networkidle");
    const resolvedText = await page.locator("body").innerText();
    expect(resolvedText).not.toMatch(/dispute\.status\.resolved/i);
  });

  test("Arabic statuses have no raw keys", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/dispute\.status\./i);
  });

  test("Kurdish statuses have no raw keys", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/dispute\.status\./i);
  });
});
