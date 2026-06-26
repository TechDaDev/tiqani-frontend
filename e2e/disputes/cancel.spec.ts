/**
 * Cancelling a dispute.
 */
import { test, expect } from "@playwright/test";
import { loginAsClient, loginAsApprovedTechnician } from "../fixtures/auth";
import { openDisputeDetail, cancelDispute } from "../helpers/disputes";
import { FIXTURE } from "../fixtures/disputes";

test.describe("Dispute cancellation", () => {
  test("opener can cancel open dispute", async ({ page }) => {
    await loginAsClient(page);

    const before = await page.request.get(`/api/disputes/${FIXTURE.DISPUTE.CANCEL}/`);
    expect(before.status()).toBe(200);
    const beforeBody = await before.json();
    expect(beforeBody.status).toBe(FIXTURE.STATUS.OPEN);

    await openDisputeDetail(page, FIXTURE.DISPUTE.CANCEL);
    const cancelResponse = await cancelDispute(page, FIXTURE.DISPUTE.CANCEL);
    expect(cancelResponse.status()).toBe(200);
    const cancelBody = await cancelResponse.json();
    expect(cancelBody.status).toBe(FIXTURE.STATUS.CANCELED);

    const after = await page.request.get(`/api/disputes/${FIXTURE.DISPUTE.CANCEL}/`);
    expect(after.status()).toBe(200);
    const afterBody = await after.json();
    expect(afterBody.status).toBe(FIXTURE.STATUS.CANCELED);
    expect(afterBody.audit_events.filter((event: { event_type: string }) => event.event_type === "DISPUTE_CANCELED")).toHaveLength(1);

    await page.reload();
    await expect(page.getByText("Canceled", { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /cancel dispute/i })).toHaveCount(0);

    const repeated = await page.request.post(`/api/disputes/${FIXTURE.DISPUTE.CANCEL}/cancel/`);
    expect(repeated.status()).toBe(400);
    const afterRepeated = await page.request.get(`/api/disputes/${FIXTURE.DISPUTE.CANCEL}/`);
    expect(afterRepeated.status()).toBe(200);
    const afterRepeatedBody = await afterRepeated.json();
    expect(afterRepeatedBody.status).toBe(FIXTURE.STATUS.CANCELED);
    expect(afterRepeatedBody.audit_events.filter((event: { event_type: string }) => event.event_type === "DISPUTE_CANCELED")).toHaveLength(1);

    const activeDispute = await page.request.get(`/api/contracts/${FIXTURE.CONTRACT.CANCEL_CONTRACT}/active-dispute/`);
    expect(activeDispute.status()).toBe(200);
    await expect(activeDispute).toBeOK();
    const activeBody = await activeDispute.json();
    expect(activeBody.active).toBe(false);

    const eligibility = await page.request.get(`/api/contracts/${FIXTURE.CONTRACT.CANCEL_CONTRACT}/dispute-eligibility/`);
    expect(eligibility.status()).toBe(200);
    const eligibilityBody = await eligibility.json();
    expect(eligibilityBody.eligible).toBe(true);
  });

  test("respondent cannot cancel", async ({ page }) => {
    await loginAsClient(page);
    const before = await page.request.get(`/api/disputes/${FIXTURE.DISPUTE.TECHNICIAN_OPENED}/`);
    expect(before.status()).toBe(200);
    const beforeBody = await before.json();
    expect(beforeBody.status).toBe(FIXTURE.STATUS.OPEN);

    await openDisputeDetail(page, FIXTURE.DISPUTE.TECHNICIAN_OPENED);
    const cancelBtn = page.getByRole("button", { name: /cancel dispute/i });
    await expect(cancelBtn).toHaveCount(0);
  });

  test("under-review dispute cannot cancel", async ({ page }) => {
    await loginAsClient(page);
    const before = await page.request.get(`/api/disputes/${FIXTURE.DISPUTE.UNDER_REVIEW}/`);
    expect(before.status()).toBe(200);
    const beforeBody = await before.json();
    expect(beforeBody.status).toBe(FIXTURE.STATUS.UNDER_REVIEW);

    await openDisputeDetail(page, FIXTURE.DISPUTE.UNDER_REVIEW);
    const cancelBtn = page.getByRole("button", { name: /cancel dispute/i });
    await expect(cancelBtn).toHaveCount(0);
  });
});
