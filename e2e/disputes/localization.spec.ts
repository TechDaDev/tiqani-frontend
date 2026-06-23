/**
 * Dispute localization — Arabic and Kurdish translations.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute localization", () => {
  // ── English ───────────────────────────────────────────────────────────

  test("English dispute statuses translated", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/open|status/i);
  });

  test("English page has LTR direction", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  // ── Arabic ────────────────────────────────────────────────────────────

  test("Arabic dispute statuses translated", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/مفتوح|حالة/i);
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
    await page.goto(`/ar/contracts/${FIXTURE.CONTRACT.ACTIVE_ELIGIBLE}/disputes`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/نزاع|سبب|مبلغ/i);
  });

  // ── Kurdish ───────────────────────────────────────────────────────────

  test("Kurdish dispute statuses translated", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/ناڕەزایەتی|کراوە/i);
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
    const openBody = await page.textContent("body");
    expect(openBody).not.toMatch(/dispute\.status\.open|dispute_status_open/i);

    // Under review dispute
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.UNDER_REVIEW}`);
    await page.waitForLoadState("networkidle");
    const reviewBody = await page.textContent("body");
    expect(reviewBody).not.toMatch(/dispute\.status\.under_review|dispute_status_under_review/i);

    // Resolved dispute
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.FULL_REFUND}`);
    await page.waitForLoadState("networkidle");
    const resolvedBody = await page.textContent("body");
    expect(resolvedBody).not.toMatch(/dispute\.status\.resolved|dispute_status_resolved/i);
  });

  test("Arabic statuses have no raw keys", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).not.toMatch(/dispute\.status\.|dispute_status_/i);
  });

  test("Kurdish statuses have no raw keys", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).not.toMatch(/dispute\.status\.|dispute_status_/i);
  });
});
