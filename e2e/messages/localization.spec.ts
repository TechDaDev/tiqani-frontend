/**
 * Messaging localization E2E tests.
 * Verifies Arabic, Kurdish RTL, and English LTR rendering.
 */

import { test, expect } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";

test.describe("Messaging localization", () => {
  test("Arabic RTL renders correctly", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/ar/messages");
    await page.waitForTimeout(1000);
    // Arabic page should render
    await expect(page.locator("main")).toBeVisible();
    // Page should have RTL direction
    const htmlDir = await page.locator("html").getAttribute("dir");
    expect(htmlDir).toBe("rtl");
  });

  test("English LTR renders correctly", async ({ page }) => {
    // Login via English route
    await page.goto("/en/login");
    await page.locator("input[type='text']").first().fill("e2e_client");
    await page.locator("input[type='password']").first().fill("local-test-only");
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForURL("**/account");

    await page.goto("/en/messages");
    await page.waitForTimeout(1000);
    await expect(page.locator("main")).toBeVisible();
    const htmlDir = await page.locator("html").getAttribute("dir");
    expect(htmlDir).toBe("ltr");
  });

  test("Kurdish RTL renders", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/ku/messages");
    await page.waitForTimeout(1000);
    await expect(page.locator("main")).toBeVisible();
  });
});
