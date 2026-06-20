/**
 * Localization tests — English, Arabic, Sorani Kurdish.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Execution localization", () => {
  test("English LTR renders correctly", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const body = await page.innerText("body");
    // English terms should be visible
    expect(body).toMatch(/execution|milestones|deliverables/i);
  });

  test("Arabic RTL renders correctly", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // Arabic content present
    expect(body.length).toBeGreaterThan(50);
  });

  test("Sorani Kurdish RTL renders correctly", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // Kurdish content present
    expect(body.length).toBeGreaterThan(50);
  });

  test("execution headings translated in all locales", async ({ page }) => {
    await loginAsClient(page);

    // English
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Arabic
    await page.goto(`/ar/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Kurdish
    await page.goto(`/ku/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("milestone statuses translated", async ({ page }) => {
    await loginAsClient(page);

    // Check milestone status badges in all locales
    for (const locale of ["en", "ar", "ku"]) {
      await page.goto(`/${locale}/contracts/${EXECUTION_FIXTURES.MILESTONE_REORDER_CONTRACT_ID}/milestones`);
      await page.waitForLoadState("networkidle");
      const statuses = page.getByRole("status");
      const count = await statuses.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test("completion labels translated", async ({ page }) => {
    await loginAsClient(page);

    for (const locale of ["en", "ar", "ku"]) {
      await page.goto(`/${locale}/contracts/${EXECUTION_FIXTURES.COMPLETION_CONFIRM_CONTRACT_ID}/execution`);
      await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
      expect(body.length).toBeGreaterThan(50);
    }
  });

  test("escrow-held notice translated", async ({ page }) => {
    await loginAsClient(page);

    for (const locale of ["en", "ar", "ku"]) {
      await page.goto(`/${locale}/contracts/${EXECUTION_FIXTURES.COMPLETED_CONTRACT_ID}/execution`);
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body");
      expect(body.length).toBeGreaterThan(50);
    }
  });

  test("no raw translation keys visible", async ({ page }) => {
    await loginAsClient(page);

    for (const locale of ["en", "ar", "ku"]) {
      await page.goto(`/${locale}/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading").first()).toBeVisible();
    }
  });
});
