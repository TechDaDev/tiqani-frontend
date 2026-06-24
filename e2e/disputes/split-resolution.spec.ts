/**
 * Split resolution display.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Split resolution", () => {
  test("split resolution shows resolved status", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.SPLIT_RESOLUTION);
    await expect(page.getByText("Resolved", { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("split amounts displayed", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.SPLIT_RESOLUTION);
    const text = await page.locator("body").innerText();
    // Client refund + technician retained = principal
    expect(text).toMatch(/250000/);
  });
});
