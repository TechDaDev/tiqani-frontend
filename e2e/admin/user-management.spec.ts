import { expect, test } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 user management", () => {
  test("staff loads user management", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/users");
    await expect(page.getByTestId("admin-users-page")).toBeVisible();
    await expect(page.getByLabel("Search users")).toBeVisible();
  });

  test("suspend dialog requires reason", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/users");
    await page.getByRole("button", { name: "Suspend" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Suspend" }).click();
    await expect(dialog.getByText("Reason required.")).toBeVisible();
  });

  test("user detail route loads safe account data", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/users");
    const link = page.locator('[data-testid="admin-users-page"] table tbody a').first();
    await link.click();
    await expect(page.getByTestId("admin-user-detail-page")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/password|refresh token|access token/i);
  });
});
