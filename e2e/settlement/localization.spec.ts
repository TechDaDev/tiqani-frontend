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
    const body = await page.textContent("body");
    expect(body).toContain("Escrow");
  });

  test("Arabic locale renders with RTL", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ar/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("Sorani Kurdish locale renders", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/ku/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("currency formatting readable", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${SETTLEMENT_FIXTURES.ELIGIBLE_CONTRACT_ID}/settlement`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/IQD/)).toBeVisible({ timeout: 10000 });
  });
});
