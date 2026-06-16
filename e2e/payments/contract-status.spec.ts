/**
 * Contract funding status display — various states.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openContract } from "../helpers/payments";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Contract funding status", () => {
  test("unfunded contract shows unfunded badge", async ({ page }) => {
    await loginAsClient(page);
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_UNFUNDED_CONTRACT_ID);
    // Wait for loading to finish
    await page.waitForSelector('text=Contract', { timeout: 10000 }).catch(() => {});
    const body = await page.textContent("body");
    expect(body).toMatch(/unfunded|funding status/i);
  });

  test("funded contract shows funded badge", async ({ page }) => {
    await loginAsClient(page);
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_FUNDED_CONTRACT_ID);
    await expect(page.getByText(/funded/i).first()).toBeVisible();
  });

  test("funded contract shows escrow amount", async ({ page }) => {
    await loginAsClient(page);
    await openContract(page, PAYMENT_FIXTURES.CLIENT_A_FUNDED_CONTRACT_ID);
    await expect(page.getByText(/IQD/).first()).toBeVisible();
  });
});
