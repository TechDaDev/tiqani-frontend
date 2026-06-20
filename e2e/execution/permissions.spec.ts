/**
 * Permission boundary tests for execution features.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "../fixtures/auth";
import {
  openExecutionPage,
  openMilestonesPage,
  openMilestoneDetail,
  expectNoApproveButton,
} from "../helpers/execution";
import { EXECUTION_FIXTURES } from "../fixtures/execution";

test.describe("Execution permissions", () => {
  test("Client A cannot access Client B execution", async ({ page }) => {
    await loginAsClient(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.CLIENT_B_ONLY_CONTRACT_ID);
    const body = await page.innerText("body");
    const isDenied = body.includes("404") || body.includes("not found") || body.includes("error");
    expect(isDenied).toBeTruthy();
  });

  test("Technician A cannot access Technician B execution", async ({ page }) => {
    await loginAsTechnician(page);
    await openExecutionPage(page, EXECUTION_FIXTURES.TECHNICIAN_B_CONTRACT_ID);
    // Should not render execution UI
    const body = await page.innerText("body");
    const hasExecutionUI = body.includes("Contract Execution") || body.includes("Activate");
    expect(hasExecutionUI).toBeFalsy();
  });

  test("technician cannot approve milestone", async ({ page }) => {
    await loginAsTechnician(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.MILESTONE_APPROVAL_CONTRACT_ID,
      EXECUTION_FIXTURES.APPROVAL_MS_ID,
    );
    await expectNoApproveButton(page);
  });

  test("client cannot submit deliverable", async ({ page }) => {
    await loginAsClient(page);
    await openMilestoneDetail(
      page,
      EXECUTION_FIXTURES.DELIVERABLE_SUBMIT_CONTRACT_ID,
      EXECUTION_FIXTURES.DELIVERABLE_MS_ID,
    );
    const submitBtn = page.getByRole("button", { name: /submit deliverable|تقديم التسليم|ناردنی ڕادەستکراو/i });
    await expect(submitBtn).not.toBeVisible();
  });

  test("invalid contract UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto("/en/contracts/00000000-0000-0000-0000-000000000000/execution");
    await page.waitForLoadState("networkidle");
    // Should show error — not crash
    const body = await page.innerText("body");
    const hasExecutionUI = body.includes("Contract Execution") || body.includes("Activate");
    expect(hasExecutionUI).toBeFalsy();
  });

  test("invalid milestone UUID handled safely", async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`/en/contracts/${EXECUTION_FIXTURES.ACTIVATION_CONTRACT_ID}/milestones/00000000-0000-0000-0000-000000000000`);
    await page.waitForLoadState("networkidle");
    // Should show error — not crash
    const body = await page.innerText("body");
    const hasMilestoneUI = body.includes("#1") || body.includes("Milestone");
    expect(hasMilestoneUI).toBeFalsy();
  });
});
