/**
 * Milestone management tests.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openMilestonesPage,
  clickCreateMilestone,
  fillMilestoneForm,
  expectMilestoneVisible,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Milestone management", () => {
  test("client can create milestone", async ({ page }) => {
    await loginAsClient(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_CREATE_CONTRACT_ID);
    await clickCreateMilestone(page);
    await fillMilestoneForm(page, {
      title: "Test Milestone",
      description: "E2E test milestone",
    });
    await expectMilestoneVisible(page, "Test Milestone");
  });

  test("required fields validated", async ({ page }) => {
    await loginAsClient(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_CREATE_CONTRACT_ID);
    await clickCreateMilestone(page);
    // Try submitting without title
    const submitBtn = page.getByRole("button", { name: /create|إنشاء|دروستکردن/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("sequence shown correctly", async ({ page }) => {
    await loginAsClient(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_REORDER_CONTRACT_ID);
    // Should show #1, #2, #3 markers
    await expect(page.getByText("#1")).toBeVisible();
    await expect(page.getByText("#2")).toBeVisible();
    await expect(page.getByText("#3")).toBeVisible();
  });

  test("technician cannot create milestone", async ({ page }) => {
    await loginAsTechnician(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_CREATE_CONTRACT_ID);
    const createBtn = page.getByRole("button", { name: /create milestone|إنشاء مرحلة|دروستکردنی هەنگاو/i });
    await expect(createBtn).not.toBeVisible();
  });

  test("unrelated client cannot access milestones", async ({ page }) => {
    await loginAsClient(page);
    // Client B's contract
    await openMilestonesPage(page, EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID);
    // Should show error or 404
    const body = await page.innerText("body");
    const hasError = body.includes("404") || body.includes("error");
    expect(hasError).toBeTruthy();
  });

  test("reload preserves milestone order", async ({ page }) => {
    await loginAsClient(page);
    await openMilestonesPage(page, EXECUTION_FIXTURES.MILESTONE_REORDER_CONTRACT_ID);
    await expect(page.getByText("#1")).toBeVisible();
    await expect(page.getByText("#2")).toBeVisible();
    await expect(page.getByText("#3")).toBeVisible();
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("#1")).toBeVisible();
    await expect(page.getByText("#2")).toBeVisible();
    await expect(page.getByText("#3")).toBeVisible();
  });
});
