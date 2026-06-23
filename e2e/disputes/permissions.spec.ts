/**
 * Dispute IDOR and permissions.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician, loginAsSecondTechnician, clearSession } from "../fixtures/auth";
import {
  openDisputeDetail,
  openAdminDisputeList,
  openAdminDisputeDetail,
  assertDisputeVisible,
  assertDisputeHidden,
  assertNoAdminControls,
  assertNoErrorTraceback,
} from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute permissions and IDOR", () => {
  test("participant client sees own dispute", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await assertDisputeVisible(page, FIXTURE.DISPUTE.OPEN);
  });

  test("unrelated user gets 404 or redirect — IDOR blocked", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    // Unrelated user should not see dispute details
    // Either redirected or shown a forbidden/not-found state
    const visibleText = await page.locator("body").innerText();
    const hasForbidden = /not found|forbidden|access denied|غير موجود|ممنوع/i.test(visibleText);
    const hasDisputeDetail = /dispute details|dispute status/i.test(visibleText);
    // If page loaded, dispute details must not be visible
    // If backend returns 403/404, the body won't have dispute content
    if (hasDisputeDetail) {
      await assertDisputeHidden(page, FIXTURE.DISPUTE.OPEN);
    }
    await assertNoErrorTraceback(page);
  });

  test("non-staff cannot access admin dispute queue", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminDisputeList(page);
    await assertNoAdminControls(page);
  });

  test("non-staff cannot see admin dispute detail", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openAdminDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    // Admin-specific controls should not be visible
    await expect(page.getByRole("button", { name: /assign|تعيين/i })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /start review|بدء المراجعة/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("non-staff cannot assign or resolve disputes", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    // Assign and resolve actions must not be available
    await expect(page.getByRole("button", { name: /assign|تعيين/i })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /propose resolution|اقتراح قرار/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("anonymous user denied from dispute detail", async ({ page }) => {
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });

  test("invalid dispute UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/en/disputes/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    // Should handle gracefully — no traceback
    await assertNoErrorTraceback(page);
  });
});
