/**
 * Evidence upload.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openDisputeDetail } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute evidence", () => {
  test("evidence section visible on dispute detail", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    await expect(page.getByText(/evidence|إثبات/i)).toBeVisible({ timeout: 10000 });
  });

  test("evidence file input present", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    // Choose file button should be present
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached({ timeout: 5000 });
  });

  test("upload button disabled without file", async ({ page }) => {
    await loginAsClient(page);
    await openDisputeDetail(page, FIXTURE.DISPUTE.OPEN);
    const uploadBtn = page.getByRole("button", { name: /upload/i });
    await expect(uploadBtn).toBeDisabled({ timeout: 5000 });
  });
});
