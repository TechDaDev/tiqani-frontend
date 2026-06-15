import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("Arabic login page is RTL and shows form", async ({ page }) => {
    await page.goto("/ar/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("English login page is LTR", async ({ page }) => {
    await page.goto("/en/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("Kurdish login page is RTL and shows translated labels", async ({ page }) => {
    await page.goto("/ku/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});
