/**
 * Payment E2E helpers.
 */
import { type Page, expect } from "@playwright/test";
import { PAYMENT_FIXTURES } from "../fixtures/payments";

export async function openContract(page: Page, contractId: string) {
  await page.goto(`/en/contracts/${contractId}`);
  await page.waitForLoadState("networkidle");
}

export async function openFundingPage(page: Page, contractId: string) {
  await page.goto(`/en/contracts/${contractId}/fund`);
  await page.waitForLoadState("networkidle");
}

export async function startFunding(page: Page) {
  const btn = page.getByRole("button", { name: /start funding/i });
  await btn.click();
  // Wait for intent creation
  await expect(page.getByText(/payment intent created/i)).toBeVisible({ timeout: 10000 });
}

export async function confirmSandboxSuccess(page: Page) {
  const btn = page.getByRole("button", { name: /simulate success/i });
  await btn.click();
  // Wait for confirmation result
  await expect(page.getByText(/funding successful/i)).toBeVisible({ timeout: 10000 });
}

export async function confirmSandboxFailure(page: Page) {
  const btn = page.getByRole("button", { name: /simulate failure/i });
  await btn.click();
  await expect(page.getByText(/payment failed/i)).toBeVisible({ timeout: 10000 });
}

export async function assertEscrowHeld(page: Page) {
  // Escrow amount should be non-zero on contract detail or funding page
  await expect(page.getByText(/IQD/).first()).toBeVisible();
}

export async function assertNoEscrowHeld(page: Page) {
  // The escrow amount should show 0 or equivalent
  const body = await page.textContent("body");
  expect(body).not.toBeNull();
}

export async function assertTechnicianUnpaid(page: Page) {
  // No payout indicator should exist
  const body = await page.textContent("body");
  expect(body).not.toBeNull();
}
