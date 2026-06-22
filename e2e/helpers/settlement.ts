/**
 * Phase 9 Settlement, Wallet, and Withdrawal E2E helpers.
 */
import { type Page, expect } from "@playwright/test";
import { SETTLEMENT_FIXTURES } from "../fixtures/settlement";

// ── Settlement ──────────────────────────────────────────────────────────

/**
 * Open a contract's settlement page.
 */
export async function openSettlementPage(page: Page, contractId: string) {
  await page.goto(`/${await getLocale(page)}/contracts/${contractId}/settlement`);
  await page.waitForLoadState("networkidle");
}

/**
 * Open a contract detail page.
 */
export async function openContractDetail(page: Page, contractId: string) {
  await page.goto(`/${await getLocale(page)}/contracts/${contractId}`);
  await page.waitForLoadState("networkidle");
}

/**
 * Check the eligibility checkbox and click release.
 */
export async function releaseEscrow(page: Page) {
  // Check the confirmation checkbox — accessible name is translation of
  // "I understand this action cannot be undone." so use getByRole without name filter
  const checkbox = page.getByRole("checkbox");
  await checkbox.check();

  // Click release button — match English or Arabic
  const releaseBtn = page.getByRole("button", { name: /release escrow|تحرير/i });
  await releaseBtn.click();
}

/**
 * Assert settlement completed successfully and receipt is visible.
 */
export async function assertSettlementCompleted(page: Page) {
  // Use .first() to handle multiple matches (heading + card body)
  await expect(page.getByText(/settlement receipt|settlement completed/i).first()).toBeVisible({ timeout: 15000 });
}

// ── Wallet ──────────────────────────────────────────────────────────────

/**
 * Open the wallet page.
 */
export async function openWallet(page: Page) {
  await page.goto(`/${await getLocale(page)}/wallet`);
  await page.waitForLoadState("networkidle");
}

/**
 * Assert wallet balance values.
 */
export async function assertWalletBalances(
  page: Page,
  opts: { minTotal?: string; exactTotal?: string } = {}
) {
  if (opts.exactTotal) {
    await expect(page.getByText(opts.exactTotal).first()).toBeVisible({ timeout: 10000 });
  }
  if (opts.minTotal) {
    // Check visible text only — avoids RSC payload false positives
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).toContain(opts.minTotal);
  }
}

/**
 * Open the transactions page.
 */
export async function openTransactions(page: Page) {
  const btn = page.getByRole("link", { name: /view transactions|transactions/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

// ── Withdrawals ─────────────────────────────────────────────────────────

/**
 * Open the withdrawals page.
 */
export async function openWithdrawals(page: Page) {
  await page.goto(`/${await getLocale(page)}/wallet/withdrawals`);
  await page.waitForLoadState("networkidle");
}

/**
 * Request a withdrawal.
 */
export async function requestWithdrawal(page: Page, amount: string) {
  // Withdrawal amount input: placeholder="1000.00" (hardcoded, locale-independent)
  const input = page.getByPlaceholder("1000.00");
  await input.fill(amount);
  // Submit button — match English or Arabic
  const submitBtn = page.getByRole("button", { name: /submit request|تقديم/i });
  await submitBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Cancel a pending withdrawal.
 */
export async function cancelWithdrawal(page: Page) {
  const cancelBtn = page.getByRole("button", { name: /cancel/i });
  await cancelBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Open admin withdrawal list page.
 */
export async function openAdminWithdrawals(page: Page) {
  await page.goto(`/${await getLocale(page)}/admin/withdrawals`);
  await page.waitForLoadState("networkidle");
}

/**
 * Open a specific admin withdrawal detail page.
 */
export async function openAdminWithdrawalDetail(page: Page, withdrawalId: string) {
  await page.goto(`/${await getLocale(page)}/admin/withdrawals/${withdrawalId}`);
  await page.waitForLoadState("networkidle");
}

/**
 * Approve a withdrawal as staff.
 */
export async function approveWithdrawal(page: Page) {
  const btn = page.getByRole("button", { name: /approve/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Reject a withdrawal as staff with a reason.
 */
export async function rejectWithdrawal(page: Page, reason: string) {
  const textarea = page.getByRole("textbox", { name: /reason|rejection reason/i });
  await textarea.fill(reason);
  const btn = page.getByRole("button", { name: /reject/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Process an approved withdrawal.
 */
export async function processWithdrawal(page: Page) {
  // Use exact "Process" button — avoid matching "Processing" status label
  const btn = page.getByRole("button", { name: /^process$/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Confirm sandbox payout success.
 */
export async function confirmSandboxSuccess(page: Page) {
  const btn = page.getByRole("button", { name: /confirm success|simulate success|confirm payout/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Confirm sandbox payout failure.
 */
export async function confirmSandboxFailure(page: Page) {
  const btn = page.getByRole("button", { name: /simulate failure|confirm failure/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Retry a failed payout.
 */
export async function retryPayout(page: Page) {
  const btn = page.getByRole("button", { name: /retry/i });
  await btn.click();
  await page.waitForLoadState("networkidle");
}

// ── Security assertions ─────────────────────────────────────────────────

/**
 * Assert no private financial data is visible on the page.
 */
export async function assertNoPrivateFinancialData(page: Page) {
  // Check visible text only — avoid RSC payload false positives
  const visibleText = await page.locator("body").innerText();
  const sensitivePatterns = [
    /platform.?wallet/i, /internal.?wallet/i,
    /provider.?secret/i, /sandbox.?secret/i,
  ];
  for (const pattern of sensitivePatterns) {
    expect(visibleText).not.toMatch(pattern);
  }
}

/**
 * Assert no production payout credentials are exposed.
 */
export async function assertNoProductionCredentials(page: Page) {
  // Use visible text only — avoids RSC payload false positives
  const visibleText = await page.locator("body").innerText();
  const credentialPatterns = [
    /sk_live_/, /pk_live_/, /sandbox_secret/i,
    /stripe.*secret/i, /production.*key/i,
    /live.*token/i, /live.*secret/i,
  ];
  for (const pattern of credentialPatterns) {
    expect(visibleText).not.toMatch(pattern);
  }
}

/**
 * Assert the page shows a 403 or unauthorized message.
 */
export async function assertForbidden(page: Page) {
  // Check visible elements only — avoids RSC payload false positives
  const visible = page.locator("body");
  const isForbidden =
    (await visible.getByText(/403|forbidden|unauthorized|not authorized|permission denied/i).first().isVisible().catch(() => false));
  expect(isForbidden).toBeTruthy();
}

/**
 * Assert the page shows a 404 or not found message.
 */
export async function assertNotFound(page: Page) {
  const visible = page.locator("body");
  const is404 =
    (await visible.getByText(/not found|404|does not exist/i).first().isVisible().catch(() => false));
  expect(is404).toBeTruthy();
}

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Get the current locale from the URL, defaulting to "en".
 */
async function getLocale(page: Page): Promise<string> {
  const url = page.url();
  const match = url.match(/\/([a-z]{2}(-[A-Z]{2})?)\//);
  return match?.[1] ?? "en";
}

/**
 * Navigate to a settlement page for a contract under a specific locale.
 */
export async function openSettlementPageFor(page: Page, contractId: string, locale = "en") {
  await page.goto(`/${locale}/contracts/${contractId}/settlement`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to a page with a specific locale.
 */
export async function navigateTo(page: Page, path: string, locale = "en") {
  await page.goto(`/${locale}${path}`);
  await page.waitForLoadState("networkidle");
}
