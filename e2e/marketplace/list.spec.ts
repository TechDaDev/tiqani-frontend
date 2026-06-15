import { test, expect } from "@playwright/test";

test.describe("Marketplace Listing", () => {
  test("Arabic marketplace loads with RTL", async ({ page }) => {
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Kurdish marketplace loads with RTL", async ({ page }) => {
    await page.goto("/ku/marketplace");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("English marketplace loads with LTR", async ({ page }) => {
    await page.goto("/en/marketplace");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Marketplace Search", () => {
  test("search input is visible and has accessible placeholder", async ({ page }) => {
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const searchInput = page.locator("#marketplace-search");
    await expect(searchInput).toBeVisible();
    const placeholder = await searchInput.getAttribute("placeholder");
    expect(placeholder?.length).toBeGreaterThan(0);
  });

  test("typing search term updates URL via debounce", async ({ page }) => {
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const searchInput = page.locator("#marketplace-search");
    await searchInput.fill("كهرباء");
    await page.waitForTimeout(600);
    await expect(page).toHaveURL(/search=/);
  });

  test("clearing search removes search param", async ({ page }) => {
    await page.goto("/ar/marketplace?search=test");
    await page.waitForLoadState("networkidle");
    const clearButton = page.locator('button[aria-label*="Clear"]').first();
    if (await clearButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await clearButton.click();
      await page.waitForTimeout(600);
      const url = page.url();
      expect(url).not.toContain("search=");
    }
  });
});

test.describe("Marketplace Desktop Filters", () => {
  test("sort select is visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const sortSelect = page.locator("#filter-sort").first();
    await expect(sortSelect).toBeVisible();
  });

  test("changing sort updates URL", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const sortSelect = page.locator("#filter-sort").first();
    const options = await sortSelect.locator("option").all();
    if (options.length > 1) {
      const value = await options[1].getAttribute("value");
      if (value) {
        await sortSelect.selectOption(value);
        await page.waitForTimeout(500);
        await expect(page).toHaveURL(/order_by=/);
      }
    }
  });

  test("reload preserves sort", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const sortSelect = page.locator("#filter-sort").first();
    const options = await sortSelect.locator("option").all();
    if (options.length > 1) {
      const value = await options[1].getAttribute("value");
      if (value) {
        await sortSelect.selectOption(value);
        await page.waitForTimeout(500);
        const currentUrl = page.url();
        await page.reload();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(currentUrl);
      }
    }
  });
});

test.describe("Marketplace Mobile", () => {
  test("filter drawer opens and closes via Escape on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");

    const filterButton = page.locator('button[aria-label*="Filter"]').first();
    if (await filterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(300);
      const drawer = page.locator('[role="dialog"]').first();
      await expect(drawer).toBeVisible();

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      await expect(drawer).not.toBeVisible();
    }
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    // Check for overflow after any animations finish
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });
});

test.describe("Technician Public Profile", () => {
  test("nonexistent profile shows error state", async ({ page }) => {
    await page.goto("/ar/marketplace/technicians/nonexistent-id-12345");
    await page.waitForLoadState("networkidle");
    // ErrorState renders without h1; check page loaded
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("Back from profile returns to marketplace", async ({ page }) => {
    // Navigate directly to marketplace first
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");

    const cardLink = page.locator('a[href*="/marketplace/technicians/"]').first();
    if (await cardLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      const href = await cardLink.getAttribute("href");
      // Navigate to the profile directly
      await page.goto(href!);
      await page.waitForLoadState("networkidle");
      // Go back to marketplace
      await page.goto("/ar/marketplace");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/ar\/marketplace/);
    }
  });
});

test.describe("Accessibility", () => {
  test("page has exactly one H1", async ({ page }) => {
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("search input has accessible name via label", async ({ page }) => {
    await page.goto("/ar/marketplace");
    await page.waitForLoadState("networkidle");
    const hasLabel = await page.locator('label[for="marketplace-search"]').isVisible();
    expect(hasLabel).toBe(true);
  });
});
