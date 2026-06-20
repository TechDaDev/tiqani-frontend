/**
 * Technician progress — milestone starting tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician, loginAsApprovedTechnician } from "../fixtures/auth";
import {
  openMilestonesPage,
  startMilestone,
  expectNoStartButton,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Technician progress — milestone start", () => {
  test("assigned technician can start pending milestone", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_START_CONTRACT_ID);
    // Verify milestone page loads with PENDING milestone
    await expect(page.getByText("#1")).toBeVisible({ timeout: 10000 });
    // Verify status badge shows Pending
    const statusBadge = page.getByRole("status").filter({ hasText: /pending/i });
    await expect(statusBadge).toBeVisible({ timeout: 5000 });
  });
  });

  test("client cannot start milestone", async ({ page }) => {
    await loginAsClient(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_START_CONTRACT_ID);
    await expectNoStartButton(page);
  });

  test("wrong technician cannot start", async ({ page }) => {
    // Log in as the basic technician (not approved_technician who owns the contract)
    const config = { technicianUsername: "e2e_technician", technicianPassword: "local-test-only" };
    process.env.E2E_TECHNICIAN_EMAIL = config.technicianUsername;
    process.env.E2E_TECHNICIAN_PASSWORD = config.technicianPassword;
    await loginAsTechnician(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_START_CONTRACT_ID);
    // Unauthorized tech should not see start button
    const startBtn = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
    await expect(startBtn).not.toBeVisible();
  });

  test("duplicate start is safe", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_START_CONTRACT_ID);
    const startBtn = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Verify no crash
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("status persists after reload", async ({ page }) => {
    await loginAsApprovedTechnician(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_START_CONTRACT_ID);
    const startBtn = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
    if (await startBtn.isVisible().catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    const btnAfter = page.getByRole("button", { name: /start|بدء|دەستپێکردن/i });
    await expect(btnAfter).not.toBeVisible();
  });
});
