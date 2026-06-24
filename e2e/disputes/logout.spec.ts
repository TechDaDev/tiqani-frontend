/**
 * Logout and cache coverage — session cleared, protected routes denied.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, logout } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Logout and cache", () => {
  test("protected dispute route denied after logout", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await logout(page);
    // After logout, try accessing dispute detail directly
    await page.goto(`/en/disputes/${FIXTURE.DISPUTE.OPEN}`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });

  test("admin queue inaccessible after logout", async ({ page }) => {
    await loginAsClient(page);
    await logout(page);
    await page.goto("/en/admin/disputes");
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("login");
  });
});
