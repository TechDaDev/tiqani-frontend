import { expect, test } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 technician management", () => {
  test("staff loads technician management", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/technicians");
    await expect(page.getByTestId("admin-technicians-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technicians" })).toBeVisible();
  });

  test("technician action dialog is keyboard reachable", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/technicians");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: /Approve|Suspend/ }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Reason")).toBeVisible();
  });
});
