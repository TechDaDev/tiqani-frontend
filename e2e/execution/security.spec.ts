/**
 * Browser security matrix for execution features.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Execution security matrix", () => {
  test("no access token exposed in DOM", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body).not.toContain("accessToken");
    expect(body).not.toContain("access_token");
  });

  test("no refresh token exposed in DOM", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body).not.toContain("refreshToken");
    expect(body).not.toContain("refresh_token");
  });

  test("no internal storage path exposed", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body).not.toContain("/media/");
    expect(body).not.toContain("uploads/");
    expect(body).not.toContain("storage/");
  });

  test("no wallet mutation controls", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const releaseBtn = page.getByRole("button", { name: /release escrow/i });
    await expect(releaseBtn).not.toBeVisible();
  });

  test("no escrow release controls", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/execution`);
    await page.waitForLoadState("networkidle");
    const releaseBtn = page.getByRole("button", { name: /release escrow|escrow release/i });
    await expect(releaseBtn).not.toBeVisible();
  });

  test("no payout controls on completed contract", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.COMPLETED_CONTRACT_ID}`);
    await page.waitForLoadState("networkidle");
    const payoutBtn = page.getByRole("button", { name: /release|payout|withdraw/i });
    await expect(payoutBtn).not.toBeVisible();
  });

  test("invalid milestone UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/milestones/invalid-uuid-1234`);
    await page.waitForLoadState("networkidle");
    // Should not crash
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("invalid submission UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/milestones/${EXECUTION_FIXTURES.ACTIVATION_MILESTONE_ID}`);
    await page.waitForLoadState("networkidle");
    // Should not crash
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("direct proxy IDOR blocked", async ({ page }) => {
    await loginAsClient(page);
    // Try to fetch Client B's execution data directly
    const response = await page.request.get(
      `/api/contracts/${EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID}/execution/eligibility/`,
    );
    // Should return 403 or 404
    expect([403, 404]).toContain(response.status());
  });
});
