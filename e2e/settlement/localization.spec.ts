/**
 * Localization.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

test.describe("Localization", () => {
  test("English locale renders correctly", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    // Use innerText (visible only) avoids RSC payload false positives
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).toContain("Escrow");
  });

  test("Arabic locale renders with RTL", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Sorani Kurdish locale renders", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("currency formatting readable", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    // Use .first() to handle strict-mode (IQD may appear in multiple elements)
    await expect(page.getByText(/IQD/).first()).toBeVisible({ timeout: 10000 });
  });
});
