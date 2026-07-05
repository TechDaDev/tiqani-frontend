import { expect, test, type Page } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";

const receiptFile = {
  name: "wallet-recharge-receipt.jpg",
  mimeType: "image/jpeg",
  buffer: Buffer.from("wallet recharge receipt fixture"),
};

async function cancelPendingRecharges(page: Page) {
  const response = await page.request.get("/api/wallet/recharge-requests/");
  expect(response.ok()).toBeTruthy();
  const items = (await response.json()) as Array<{ id: string; status: string }>;
  for (const item of items.filter((entry) => entry.status === "pending_review")) {
    const cancel = await page.request.post(`/api/wallet/recharge-requests/${item.id}/cancel/`);
    expect(cancel.ok()).toBeTruthy();
  }
}

test.describe.serial("wallet recharge user flow", () => {
  test("opens wallet with balance and recharge section", async ({ page }) => {
    await loginAsClient(page);
    await cancelPendingRecharges(page);

    await page.goto("/en/wallet");

    await expect(page.getByRole("heading", { name: "My Wallet" })).toBeVisible();
    await expect(page.getByText("Total Balance").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recharge Wallet" })).toBeVisible();
    await expect(page.getByPlaceholder("Amount")).toBeVisible();
  });

  test("submits recharge, blocks a second pending request, and allows cancellation", async ({ page }) => {
    await loginAsClient(page);
    await cancelPendingRecharges(page);

    const note = `RC7 user pending ${Date.now()}`;
    await page.goto("/en/wallet");
    await page.getByPlaceholder("Amount").fill("15000");
    await page.getByPlaceholder("Note").fill(note);
    await page.locator('input[type="file"]').setInputFiles(receiptFile);
    await page.getByRole("button", { name: "Submit recharge" }).click();

    const pendingRow = page.getByRole("row").filter({ hasText: "15000.00 IQD" });
    await expect(page.getByRole("status")).toContainText("Recharge request submitted");
    await expect(pendingRow).toContainText("Pending review");
    await expect(page.getByText("You already have a recharge request under review.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit recharge" })).toBeDisabled();

    await pendingRow.getByRole("button", { name: "Cancel" }).click();
    await expect(pendingRow).toContainText("Cancelled");
    await expect(page.getByRole("button", { name: "Submit recharge" })).toBeEnabled();
  });

  test("rejects unauthenticated and non-admin recharge review access", async ({ page, request }) => {
    const anonymous = await request.get("/api/admin/financial/recharge-requests/");
    expect(anonymous.status()).toBe(401);

    await loginAsClient(page);
    const client = await page.request.get("/api/admin/financial/recharge-requests/");
    expect(client.status()).toBe(403);
  });
});
