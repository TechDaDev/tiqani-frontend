import { expect, test } from "@playwright/test";
import { loginAsClient, loginAsStaff } from "../fixtures/auth";

test.describe("Admin financial oversight", () => {
  test("admin opens financial overview", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial");
    await expect(page.getByTestId("admin-financial-overview")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Admin Financial Overview" })).toBeVisible();
    await expect(page.getByText("Gross payments")).toBeVisible();
    await expect(page.getByRole("link", { name: "Payments" })).toBeVisible();
  });

  test("participant cannot access financial overview API", async ({ page }) => {
    await loginAsClient(page);
    const response = await page.request.get("/api/admin/financial/overview/");
    expect(response.status()).toBe(403);
  });

  test("financial charts and cards render", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial");
    await expect(page.getByText("Payments by status")).toBeVisible();
    await expect(page.getByText("Withdrawals by status")).toBeVisible();
    await expect(page.getByText("Ledger by type")).toBeVisible();
  });

  test("payments page handles current state", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial/payments");
    await expect(page.getByTestId("admin-financial-payments")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Payments" })).toBeVisible();
  });

  test("refunds page handles current state", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial/refunds");
    await expect(page.getByTestId("admin-financial-refunds")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Refunds" })).toBeVisible();
  });

  test("ledger page is read-only", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial/ledger");
    await expect(page.getByTestId("admin-financial-ledger")).toBeVisible();
    await expect(page.getByText("Ledger history is read-only")).toBeVisible();
    await expect(page.getByRole("button", { name: /delete|edit|adjust/i })).toHaveCount(0);
  });

  test("withdrawals page shows safe status", async ({ page }) => {
    await loginAsStaff(page);
    await page.goto("/en/admin/financial/withdrawals");
    await expect(page.getByTestId("admin-financial-withdrawals")).toBeVisible();
    await expect(page.getByText("Read-only oversight")).toBeVisible();
  });
});
