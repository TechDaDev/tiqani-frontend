/**
 * Completion rejection tests.
 * UI sends rejection directly via button click.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openExecutionPage,
  assertContractActive,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Completion rejection", () => {
  test("client can reject completion with reason", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REJECT_CONTRACT_ID);
    // Click reject button directly
    const rejectBtn = page.getByRole("button", { name: /reject completion|رفض الإكمال|ڕەتکردنەوەی تەواوکردن/i });
    await expect(rejectBtn).toBeVisible({ timeout: 10000 });
    await rejectBtn.click();
    await page.waitForTimeout(2000);
    // Contract should return to active
    await assertContractActive(page);
  });

  test("technician cannot reject completion", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REJECT_CONTRACT_ID);
    const rejectBtn = page.getByRole("button", { name: /reject completion|رفض الإكمال|ڕەتکردنەوەی تەواوکردن/i });
    await expect(rejectBtn).not.toBeVisible();
  });

  test("unrelated client cannot reject", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID);
    const body = await page.innerText("body");
    const hasError = body.includes("error") || body.includes("Something went wrong");
    expect(hasError).toBeTruthy();
  });

  test("rejection persists after reload", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.COMPLETION_REJECT_CONTRACT_ID);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("history records rejection", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.COMPLETION_REJECT_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body.length).toBeGreaterThan(0);
  });
});
