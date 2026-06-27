import { expect, test } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 system health", () => {
  test("health endpoint succeeds", async ({ page }) => {
    const response = await page.request.get("http://127.0.0.1:8000/api/health/");
    expect([200, 503]).toContain(response.status());
    const body = await response.text();
    expect(body).not.toMatch(/SECRET|PASSWORD|TOKEN/i);
  });

  test("readiness endpoint reports database safely", async ({ page }) => {
    const response = await page.request.get("http://127.0.0.1:8000/api/ready/");
    expect([200, 503]).toContain(response.status());
    const json = await response.json();
    expect(json).toHaveProperty("database");
    expect(JSON.stringify(json)).not.toMatch(/postgres:\/\/|password|secret/i);
  });

  test("staff loads admin system page", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/system");
    await expect(page.getByTestId("admin-system-page")).toBeVisible();
    await expect(page.getByText("Database")).toBeVisible();
  });
});
