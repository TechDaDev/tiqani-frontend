import { expect, test } from "@playwright/test";
import { loginAsClient, loginAsStaff } from "../fixtures/auth";
import { PHASE11 } from "../fixtures/phase11";

test.describe("Phase 11 review moderation", () => {
  test("reported review appears in staff queue and can be hidden", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/review-reports");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("admin-review-reports-page")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId(`admin-review-report-${PHASE11.REVIEW.REPORTED}`)).toBeVisible();
    await page.getByTestId(`admin-review-report-${PHASE11.REVIEW.REPORTED}`).getByTestId("admin-review-hide").click();
    await expect(page.getByTestId(`admin-review-report-${PHASE11.REVIEW.REPORTED}`).getByTestId("admin-review-restore")).toBeVisible();
  });

  test("non-staff cannot access review report queue", async ({ page }) => {
    await loginAsClient(page);
    const response = await page.request.get("/api/admin/review-reports/");
    expect([401, 403]).toContain(response.status());
  });
});
