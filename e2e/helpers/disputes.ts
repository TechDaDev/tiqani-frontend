/**
 * Phase 10 Dispute E2E helpers.
 *
 * All helpers use accessible locators (role, label, text).
 * No arbitrary sleeps. No direct database modifications.
 * Support English, Arabic, and Kurdish via translation-aware selectors.
 */
import { type Page, expect } from "@playwright/test";

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Get the current locale from the URL, defaulting to "en".
 */
async function getLocale(page: Page): Promise<string> {
  const url = page.url();
  const match = url.match(/\/([a-z]{2}(-[A-Z]{2})?)\//);
  return match?.[1] ?? "en";
}

// ── Navigation ──────────────────────────────────────────────────────────

/**
 * Navigate to the disputes list page.
 */
export async function openDisputePage(page: Page, locale = "en") {
  await page.goto(`/${locale}/disputes`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to a specific dispute detail page.
 */
export async function openDisputeDetail(page: Page, disputeId: string, locale = "en") {
  await page.goto(`/${locale}/disputes/${disputeId}`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to the contract dispute page (dispute creation context).
 */
export async function openContractDisputePage(page: Page, contractId: string, locale = "en") {
  await page.goto(`/${locale}/contracts/${contractId}/disputes`);
  await page.waitForLoadState("networkidle");
}

// ── Eligibility ─────────────────────────────────────────────────────────

/**
 * Assert the dispute eligibility panel is visible.
 */
export async function checkDisputeEligibility(page: Page) {
  await expect(
    page.getByText(/eligible for dispute|dispute eligibility|مؤهل للنزاع/i).first()
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Assert the dispute eligibility panel indicates ineligibility.
 */
export async function checkDisputeIneligibility(page: Page) {
  await expect(
    page.getByText(/not eligible|غير مؤهل/i).first()
  ).toBeVisible({ timeout: 10000 });
}

// ── Form interaction ────────────────────────────────────────────────────

/**
 * Fill the dispute creation form with reason, amount, and statement.
 */
export async function fillDisputeForm(
  page: Page,
  data: { reason: string; amount?: string; statement: string }
) {
  // Reason dropdown — translation-aware
  const reasonSelect = page.getByRole("combobox", { name: /reason|السبب|هۆکار/i });
  await expect(reasonSelect).toBeVisible({ timeout: 5000 });
  await reasonSelect.selectOption(data.reason);

  // Amount input (optional — some disputes are non-monetary)
  if (data.amount) {
    const amountInput = page.getByRole("textbox", { name: /amount|المبلغ|بڕ/i });
    await amountInput.fill(data.amount);
  }

  // Statement textarea
  const statementInput = page.getByRole("textbox", { name: /statement|البيان|ڕاگەیاندن/i });
  await expect(statementInput).toBeVisible({ timeout: 5000 });
  await statementInput.fill(data.statement);
}

/**
 * Submit the dispute creation form.
 */
export async function submitDisputeForm(page: Page) {
  const submitBtn = page.getByRole("button", { name: /submit dispute|تقديم النزاع|ناردنی ناڕەزایەتی/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
  await page.waitForLoadState("networkidle");
}

// ── Status ──

/**
 * Wait for a dispute status badge with the expected text to appear.
 */
export async function waitForDisputeStatus(page: Page, expectedStatus: string) {
  // Status is rendered as a badge — match the status label text
  await expect(
    page.getByText(new RegExp(expectedStatus.replace(/_/g, " "), "i")).first()
  ).toBeVisible({ timeout: 15000 });
}

// ── Statements ──────────────────────────────────────────────────────────

/**
 * Add a new statement to an existing dispute.
 */
export async function addStatement(page: Page, text: string) {
  const textarea = page.getByRole("textbox", { name: /add statement|إضافة بيان|زیادکردنی ڕاگەیاندن/i });
  await expect(textarea).toBeVisible({ timeout: 5000 });
  await textarea.fill(text);

  const submitBtn = page.getByRole("button", { name: /send|إرسال|ناردن/i });
  await submitBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Cancel an open dispute.
 */
export async function cancelDispute(page: Page) {
  const cancelBtn = page.getByRole("button", { name: /cancel dispute|إلغاء النزاع|پشکینیینی ناڕەزایەتی/i });
  await expect(cancelBtn).toBeVisible({ timeout: 5000 });
  await cancelBtn.click();
  // Confirm cancellation dialog
  const confirmBtn = page.getByRole("button", { name: /confirm|تأكيد|پشتڕاستکردن/i });
  await confirmBtn.click();
  await page.waitForLoadState("networkidle");
}

// ── Admin ───────────────────────────────────────────────────────────────

/**
 * Open the admin dispute queue.
 */
export async function openAdminDisputeList(page: Page, locale = "en") {
  await page.goto(`/${locale}/admin/disputes`);
  await page.waitForLoadState("networkidle");
}

/**
 * Open a specific admin dispute detail page.
 */
export async function openAdminDisputeDetail(page: Page, disputeId: string, locale = "en") {
  await page.goto(`/${locale}/admin/disputes/${disputeId}`);
  await page.waitForLoadState("networkidle");
}

/**
 * Click the assign button to take ownership of a dispute.
 */
export async function assignDispute(page: Page) {
  const assignBtn = page.getByRole("button", { name: /assign|تعيين|دیاریکردن/i });
  await expect(assignBtn).toBeVisible({ timeout: 5000 });
  await assignBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Click start review to begin reviewing a dispute.
 */
export async function startReview(page: Page) {
  const reviewBtn = page.getByRole("button", { name: /start review|بدء المراجعة|دەستپێکردنی پێداچوونەوە/i });
  await expect(reviewBtn).toBeVisible({ timeout: 5000 });
  await reviewBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Click start mediation to escalate a dispute to mediation.
 */
export async function startMediation(page: Page) {
  const mediationBtn = page.getByRole("button", { name: /start mediation|بدء الوساطة|دەستپێکردنی نێوانگیری/i });
  await expect(mediationBtn).toBeVisible({ timeout: 5000 });
  await mediationBtn.click();
  await page.waitForLoadState("networkidle");
}

/**
 * Propose a resolution for a dispute with the given resolution type.
 */
export async function proposeResolution(page: Page, resolutionType: string) {
  // Resolution type dropdown
  const typeSelect = page.getByRole("combobox", { name: /resolution type|نوع القرار|جۆری بڕیار/i });
  await expect(typeSelect).toBeVisible({ timeout: 5000 });
  await typeSelect.selectOption(resolutionType);

  const proposeBtn = page.getByRole("button", { name: /propose resolution|اقتراح قرار|پێشنیاری بڕیار/i });
  await expect(proposeBtn).toBeEnabled({ timeout: 5000 });
  await proposeBtn.click();
  await page.waitForLoadState("networkidle");
}

// ── Chargebacks & Refunds ───────────────────────────────────────────────

/**
 * Open the admin chargeback list page.
 */
export async function openChargebackList(page: Page, locale = "en") {
  await page.goto(`/${locale}/admin/chargebacks`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to a specific refund detail page.
 */
export async function openRefundDetail(page: Page, refundId: string, locale = "en") {
  await page.goto(`/${locale}/admin/refunds/${refundId}`);
  await page.waitForLoadState("networkidle");
}

// ── Security assertions ─────────────────────────────────────────────────

/**
 * Assert a dispute is visible on the current page.
 */
export async function assertDisputeVisible(page: Page, disputeId: string) {
  // Dispute cards/rows typically show partial UUID or a visual reference
  const shortId = disputeId.substring(0, 8);
  await expect(page.getByText(shortId).first()).toBeVisible({ timeout: 10000 });
}

/**
 * Assert a dispute is NOT visible on the current page (IDOR protection).
 */
export async function assertDisputeHidden(page: Page, disputeId: string) {
  const shortId = disputeId.substring(0, 8);
  // Check visible text only — avoids RSC payload false positives
  const visibleText = await page.locator("body").innerText();
  expect(visibleText).not.toContain(shortId);
}

/**
 * Assert no admin controls are visible on the page.
 */
export async function assertNoAdminControls(page: Page) {
  const adminPatterns = [
    /assign|تعيين/i,
    /start review|بدء المراجعة/i,
    /propose resolution|اقتراح قرار/i,
  ];
  const visibleText = await page.locator("body").innerText();
  for (const pattern of adminPatterns) {
    expect(visibleText).not.toMatch(pattern);
  }
}

/**
 * Assert no traceback or internal server error is visible.
 */
export async function assertNoErrorTraceback(page: Page) {
  await expect(page.getByText(/traceback|Internal Server Error|KeyError|ValueError/i)).not.toBeVisible({ timeout: 5000 });
}
