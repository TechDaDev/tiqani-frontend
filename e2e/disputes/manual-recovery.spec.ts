/**
 * Manual recovery display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Manual recovery", () => {
  test("manual recovery dispute shows status", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.MANUAL_RECOVERY);
    await expect(page.getByText("Resolved", { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("recovery amount displayed", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.MANUAL_RECOVERY);
    const text = await page.locator("body").innerText();
    expect(text).toMatch(/300000/);
  });
});
