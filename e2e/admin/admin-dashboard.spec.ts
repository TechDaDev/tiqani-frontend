import { expect, test } from "@playwright/test";
import { loginAsClient, loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 admin dashboard", () => {
  test("staff loads admin dashboard", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/dashboard");
    await expect(page.getByTestId("admin-dashboard-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Users", { exact: true })).toBeVisible();
    await expect(page.getByTestId("admin-dashboard-charts")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users by Role" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Platform Workflow" })).toBeVisible();
  });

  test("participant cannot access admin dashboard API", async ({ page }) => {
    await loginAsClient(page);
    const response = await page.request.get("/api/admin/dashboard/");
    expect(response.status()).toBe(403);
  });

  test("admin dashboard has security headers", async ({ page }) => {
    const response = await page.goto("/en/login");
    expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
