import { expect, test } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 audit", () => {
  test("staff loads audit trail", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/audit");
    await expect(page.getByTestId("admin-audit-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Audit Trail" })).toBeVisible();
  });

  test("audit endpoint is staff-only data", async ({ page }) => {
    await loginAsStaff(page);
    const response = await page.request.get("/api/admin/audit-events/");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).not.toMatch(/password|authorization|cookie/i);
  });
});
