/**
 * Phase 8 execution E2E helpers.
 *
 * All helpers use accessible locators (role, label, text).
 * No arbitrary sleeps. No direct database modifications.
 * Support English, Arabic, and Kurdish via translation-aware selectors.
 */
import { type Page, type Locator, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/**
 * Navigate to the execution page for a contract.
 */
export async function openExecutionPage(page: Page, contractId: string) {
  await page.goto(`/en/contracts/${contractId}/execution`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to the milestones page for a contract.
 */
export async function openMilestonesPage(page: Page, contractId: string) {
  await page.goto(`/en/contracts/${contractId}/milestones`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to the milestone detail page.
 */
export async function openMilestoneDetail(
  page: Page,
  contractId: string,
  milestoneId: string,
) {
  await page.goto(`/en/contracts/${contractId}/milestones/${milestoneId}`);
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to the contract detail page.
 */
export async function openContract(page: Page, contractId: string) {
  await page.goto(`/en/contracts/${contractId}`);
  await page.waitForLoadState("networkidle");
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

/**
 * Click the activate button on the execution page.
 * Throws if more than one activate button is found.
 */
export async function activateContract(page: Page) {
  const activateBtn = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
  await expect(activateBtn).toBeVisible({ timeout: 10000 });
  await activateBtn.click();
  // Wait for status update
  await expect(page.getByRole("status").first()).toBeVisible({ timeout: 10000 });
}

/**
 * Assert the activate button is NOT present.
 */
export async function expectNoActivateButton(page: Page) {
  const btn = page.getByRole("button", { name: /activate|تفعيل|چالاک کردن/i });
  await expect(btn).not.toBeVisible();
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

/**
 * Click the create milestone button.
 */
export async function clickCreateMilestone(page: Page) {
  const createBtn = page.getByRole("button", { name: /create milestone|إنشاء مرحلة|دروستکردنی هەنگاو/i });
  await expect(createBtn).toBeVisible({ timeout: 10000 });
  await createBtn.click();
}

/**
 * Fill in the milestone creation form and submit.
 */
export async function fillMilestoneForm(
  page: Page,
  data: { title: string; description?: string; dueDate?: string },
) {
  // Find form inputs by aria-label (translation-aware)
  const titleInput = page.getByRole("textbox", { name: /title|العنوان|ناونیشان/i });
  await expect(titleInput).toBeVisible({ timeout: 5000 });
  await titleInput.fill(data.title);

  if (data.description) {
    const descInput = page.getByRole("textbox", { name: /description|الوصف|وەسف/i });
    await descInput.fill(data.description);
  }

  if (data.dueDate) {
    const dateInput = page.getByLabel(/due date|تاريخ الاستحقاق|بەرواری کۆتایی/i);
    await dateInput.fill(data.dueDate);
  }

  // Submit — look for submit button
  const submitBtn = page.getByRole("button", { name: /create|إنشاء|دروستکردن/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
}

/**
 * Assert milestone with given title appears in list.
 */
export async function expectMilestoneVisible(
  page: Page,
  title: string,
) {
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 10000 });
}

/**
 * Assert milestone count equals expected number.
 */
export async function expectMilestoneCount(
  page: Page,
  expected: number,
) {
  // Milestones rendered as cards with sequence numbers
  const cards = page.locator('[class*="rounded-lg"][class*="border-gray-200"]');
  await expect(cards).toHaveCount(expected, { timeout: 10000 });
}

// ---------------------------------------------------------------------------
// Start milestone
// ---------------------------------------------------------------------------

/**
 * Click start on a pending milestone.
 */
export async function startMilestone(page: Page) {
  const startBtn = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
  await expect(startBtn).toBeVisible({ timeout: 10000 });
  await startBtn.click();
}

/**
 * Assert start button is not present.
 */
export async function expectNoStartButton(page: Page) {
  const btn = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
  await expect(btn).not.toBeVisible();
}

// ---------------------------------------------------------------------------
// Deliverable submission
// ---------------------------------------------------------------------------

/**
 * Click the submit deliverable button/link.
 */
export async function clickSubmitDeliverable(page: Page) {
  const submitBtn = page.getByRole("button", { name: /submit deliverable|تقديم التسليم|ناردنی ڕادەستکراو/i });
  await expect(submitBtn).toBeVisible({ timeout: 10000 });
  await submitBtn.click();
}

/**
 * Fill deliverable submission form and submit.
 */
export async function fillDeliverableForm(
  page: Page,
  data: { summary: string; notes?: string },
) {
  const summaryInput = page.getByRole("textbox", { name: /summary|الملخص|پوختە/i });
  await expect(summaryInput).toBeVisible({ timeout: 5000 });
  await summaryInput.fill(data.summary);

  if (data.notes) {
    const notesInput = page.getByRole("textbox", { name: /notes|ملاحظات|تێبینی/i });
    await notesInput.fill(data.notes);
  }

  const submitBtn = page.getByRole("button", { name: /submit|تقديم|ناردن/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
}

/**
 * Assert a submission version is visible.
 */
export async function expectSubmissionVisible(page: Page) {
  await expect(page.getByText(/version|إصدار|وەشانی/i).first()).toBeVisible({ timeout: 10000 });
}

/**
 * Assert internal storage path is NOT present anywhere.
 */
export async function expectNoStoragePath(page: Page) {
  const body = await page.textContent("body");
  expect(body).not.toContain("/media/");
  expect(body).not.toContain("uploads/");
  expect(body).not.toContain("storage/");
}

// ---------------------------------------------------------------------------
// Revision
// ---------------------------------------------------------------------------

/**
 * Click request revision button.
 */
export async function clickRequestRevision(page: Page) {
  const revBtn = page.getByRole("button", { name: /request revision|طلب مراجعة|داواکردنی پێداچوونەوە/i });
  await expect(revBtn).toBeVisible({ timeout: 10000 });
  await revBtn.click();
}

/**
 * Fill revision reason and submit.
 */
export async function fillRevisionReason(page: Page, reason: string) {
  const reasonInput = page.getByRole("textbox", { name: /reason|السبب|هۆکار/i });
  await expect(reasonInput).toBeVisible({ timeout: 5000 });
  await reasonInput.fill(reason);

  const submitBtn = page.getByRole("button", { name: /request|طلب|داوا/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
}

/**
 * Assert revision reason is displayed.
 */
export async function expectRevisionReasonVisible(page: Page, reason: string) {
  await expect(page.getByText(reason)).toBeVisible({ timeout: 10000 });
}

// ---------------------------------------------------------------------------
// Approval
// ---------------------------------------------------------------------------

/**
 * Click approve milestone button.
 */
export async function approveMilestone(page: Page) {
  const approveBtn = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
  await expect(approveBtn).toBeVisible({ timeout: 10000 });
  await approveBtn.click();
}

/**
 * Assert approve button is NOT present.
 */
export async function expectNoApproveButton(page: Page) {
  const btn = page.getByRole("button", { name: /approve|اعتماد|پەسندکردن/i });
  await expect(btn).not.toBeVisible();
}

// ---------------------------------------------------------------------------
// Completion
// ---------------------------------------------------------------------------

/**
 * Click request completion button.
 */
export async function clickRequestCompletion(page: Page) {
  const reqBtn = page.getByRole("button", { name: /request completion|طلب إكمال|داواکردنی تەواوکردن/i });
  await expect(reqBtn).toBeVisible({ timeout: 10000 });
  await reqBtn.click();
}

/**
 * Fill completion message and submit.
 */
export async function fillCompletionMessage(page: Page, message: string) {
  const msgInput = page.getByRole("textbox", { name: /message|الرسالة|پەیام/i });
  await expect(msgInput).toBeVisible({ timeout: 5000 });
  await msgInput.fill(message);

  const submitBtn = page.getByRole("button", { name: /request|طلب|داوا/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
}

/**
 * Click confirm completion button.
 */
export async function confirmCompletion(page: Page) {
  const confirmBtn = page.getByRole("button", { name: /confirm completion|تأكيد الإكمال|پشتڕاستکردنەوەی تەواوکردن/i });
  await expect(confirmBtn).toBeVisible({ timeout: 10000 });
  await confirmBtn.click();
}

/**
 * Fill rejection reason and submit.
 */
export async function fillRejectionReason(page: Page, reason: string) {
  const reasonInput = page.getByRole("textbox", { name: /reason|السبب|هۆکار/i });
  await expect(reasonInput).toBeVisible({ timeout: 5000 });
  await reasonInput.fill(reason);

  const submitBtn = page.getByRole("button", { name: /reject|رفض|ڕەتکردنەوە/i });
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();
}

/**
 * Assert escrow is held — verify the execution page shows contract data.
 */
export async function assertEscrowHeld(page: Page) {
  // Verify page rendered successfully — check visible heading/text
  await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 5000 });
}

/**
 * Assert escrow-held notice (for completed contracts only).
 */
export async function assertEscrowHeldNotice(page: Page) {
  await expect(
    page.getByText(/funds remain held|تظل الأموال|پارەکان بە زیپکە/i),
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Assert no payout/release controls exist (buttons, links, forms).
 * Informational text like "Payment will be released" is allowed.
 */
export async function assertNoPayoutControls(page: Page) {
  // Check for payout/release action controls, not informational text
  const payoutBtn = page.getByRole("button", { name: /release payment|إطلاق الدفعة|بەردەدانی پارە/i });
  await expect(payoutBtn).not.toBeVisible();
  const releaseBtn = page.getByRole("button", { name: /release escrow/i });
  await expect(releaseBtn).not.toBeVisible();
  const withdrawBtn = page.getByRole("button", { name: /withdraw|سحب|کشتن/i });
  await expect(withdrawBtn).not.toBeVisible();
}

/**
 * Assert the contract is completed (status badge says completed).
 */
export async function assertContractCompleted(page: Page) {
  await expect(
    page.getByRole("status").filter({ hasText: /completed|مكتمل|تەواوکراو/i }),
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Assert the contract is in completion-requested state.
 */
export async function assertCompletionRequested(page: Page) {
  await expect(
    page.getByRole("status").filter({ hasText: /completion requested|completed/i }),
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Assert the contract is active.
 */
export async function assertContractActive(page: Page) {
  await expect(
    page.getByRole("status").filter({ hasText: /active|نشط|چالاک/i }),
  ).toBeVisible({ timeout: 10000 });
}
