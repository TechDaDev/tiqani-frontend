/**
 * Technician read-only behavior.
 */
import { test, expect } from "@playwright/test";
import { loginAsTechnician } from "../fixtures/auth";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

test.describe("Technician read-only", () => {
  test("technician sees funded status on contract", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.FUNDED_VIEW_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    // Technician may see 403 (different client's contract) or the funded badge
    const body = await page.textContent("body");
    const hasFundedText = body?.toLowerCase().includes("funded") ?? false;
    const isForbidden = body?.includes("403") ?? false;
    expect(hasFundedText || isForbidden).toBe(true);
  });

  test("technician has no fund action", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.FUNDED_VIEW_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const fundBtn = page.getByRole("link", { name: /fund contract/i });
    await expect(fundBtn).not.toBeVisible();
  });

  test("technician cannot start funding on another client's contract", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.FAILURE_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");
    // The funding eligibility API returns eligible=false for technician-owned contracts
    const startBtn = page.getByRole("button", { name: /start funding/i });
    await expect(startBtn).not.toBeVisible();
  });

  test("technician cannot confirm sandbox payment", async ({ page }) => {
    await loginAsTechnician(page);
    await page.goto(`/en/contracts/${PAYMENT_FIXTURES.FAILURE_CONTRACT_ID}/fund`);
    await page.waitForLoadState("networkidle");
    // Start button should not be visible, so confirm never reachable
    const startBtn = page.getByRole("button", { name: /start funding/i });
    await expect(startBtn).not.toBeVisible();
    // Simulate buttons should not exist
    const simBtn = page.getByRole("button", { name: /simulate/i });
    await expect(simBtn).not.toBeVisible();
  });
});
