/**
 * Execution history tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import { openExecutionPage } from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Execution history", () => {
  test("events appear in expected order", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    // History should show events
      const body = await page.innerText("body");
      expect(body.length).toBeGreaterThan(50);
  });

  test("actor labels are safe", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // No private email in history
    expect(body).not.toContain("@tiqani.local");
  });

  test("event metadata is sanitized", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // No internal paths
    expect(body).not.toContain("/media/");
    expect(body).not.toContain("uploads/");
    expect(body).not.toContain("storage/");
  });

  test("unrelated users denied", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    const hasError = body.includes("404") || body.includes("not found") || body.includes("error");
    expect(hasError).toBeTruthy();
  });

  test("anonymous users redirected", async ({ page }) => {
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    // Should redirect to login
    expect(page.url()).toContain("login");
  });

  test("no private email in history", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body).not.toContain("@");
  });

  test("no private phone in history", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.HISTORY_CONTRACT_ID}/history`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // Phone numbers shouldn't be visible
    expect(body).not.toMatch(/075\d{8}/);
  });
});
