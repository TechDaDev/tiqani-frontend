/**
 * Security and spoofing coverage — IDOR, token exposure, etc.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsSecondTechnician } from "../fixtures/auth";
import { openDisputeDetail, assertDisputeVisible, assertDisputeHidden, assertNoErrorTraceback } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute security", () => {
  test("contract IDOR blocked — unrelated user cannot view dispute contract", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await assertDisputeHidden(page, FIXTURE.DISPUTE.OPEN);
    await assertNoErrorTraceback(page);
  });

  test("dispute IDOR blocked", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await assertDisputeHidden(page, FIXTURE.DISPUTE.OPEN);
  });

  test("no access token exposed in DOM", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    const html = await page.locator("html").innerHTML();
    expect(html).not.toMatch(/tiqani_access|access_token|eyJ/i);
  });

  test("no raw database error visible", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/en/disputes/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    await assertNoErrorTraceback(page);
  });

  test("no traceback on invalid UUID", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/en/contracts/00000000-0000-0000-0000-000000000000/dispute");
    await page.waitForLoadState("networkidle");
    await assertNoErrorTraceback(page);
  });
});
