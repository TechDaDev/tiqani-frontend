import { expect, test } from "@playwright/test";
import { loginAsStaff } from "../fixtures/auth";

test.describe("Phase 12 technician management", () => {
  test("staff loads technician management", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/technicians");
    await expect(page.getByTestId("admin-technicians-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technicians" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Documents" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Links" })).toBeVisible();
  });

  test("admin opens technician review detail from list", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/technicians");
    await page.getByRole("link", { name: "Review" }).first().click();
    await expect(page.getByTestId("admin-technician-detail-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Review / })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Approval checklist" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();
    await expect(page.getByText("GitHub URL", { exact: true })).toBeVisible();
    await expect(page.getByText("LinkedIn URL", { exact: true })).toBeVisible();
  });

  test("technician action dialog is keyboard reachable", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/technicians");
    await page.keyboard.press("Tab");
    await page.getByRole("button", { name: "Suspend" }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Reason")).toBeVisible();
  });
});
