import { expect, test } from "@playwright/test";
import { loginAsClient, loginAsStaff, logout } from "../fixtures/auth";

test.describe("Phase 12 admin permissions", () => {
  test("non-staff redirected away from admin system page", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/en/admin/system");
    await expect(page).not.toHaveURL(/\/admin\/system$/);
  });

  test("staff logout prevents back navigation to admin dashboard", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/dashboard");
    await expect(page.getByTestId("admin-dashboard-page")).toBeVisible();
    await logout(page);
    await page.goBack();
    await expect(page.getByTestId("admin-dashboard-page")).not.toBeVisible({ timeout: 3000 });
  });
});
