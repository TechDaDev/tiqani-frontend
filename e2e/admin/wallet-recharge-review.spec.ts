import { expect, test, type Page } from "@playwright/test";
import { loginAsSecondTechnician, loginAsStaff, logout } from "../fixtures/auth";

const receiptFile = {
  name: "wallet-recharge-receipt.jpg",
  mimeType: "image/jpeg",
  buffer: Buffer.from("admin wallet recharge receipt fixture"),
};

type RechargeRequest = {
  id: string;
  status: string;
  amount: string;
  receipt_download_url?: string;
  approved_transaction_id?: string | null;
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

async function createRecharge(page: Page, amount: string, note: string): Promise<RechargeRequest> {
  const response = await page.request.post("/api/wallet/recharge-requests/", {
    multipart: {
      amount,
      note,
      receipt_file: receiptFile,
    },
  });
  expect(response.status()).toBe(201);
  return (await response.json()) as RechargeRequest;
}

async function walletBalance(page: Page): Promise<string> {
  const response = await page.request.get("/api/wallet/me/");
  expect(response.ok()).toBeTruthy();
  const wallet = (await response.json()) as { balance: string };
  return wallet.balance;
}

test.describe.serial("admin wallet recharge review", () => {
  test("shows a pending request with a safe receipt link and approves it", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await cancelPendingRecharges(page);
    const note = `RC7 admin approve ${Date.now()}`;
    const created = await createRecharge(page, "22000", note);
    await logout(page);

    await loginAsStaff(page);
    await page.goto("/en/admin/financial/recharges");

    const row = page.getByRole("row").filter({ hasText: created.id.slice(0, 8) });
    await expect(row).toBeVisible();
    await expect(row).toContainText("Pending Review");
    const receipt = row.getByRole("link", { name: /wallet-recharge-receipt\.jpg/i });
    await expect(receipt).toBeVisible();
    const href = await receipt.getAttribute("href");
    expect(href).toContain(`/api/admin/financial/recharge-requests/${created.id}/receipt/`);
    expect(href).not.toContain("wallet_recharge_receipts");

    await row.getByPlaceholder("Review note").fill("Receipt matched RC7 validation.");
    await row.getByRole("button", { name: "Approve" }).click();
    await expect(row).toBeHidden();

    const detailResponse = await page.request.get(`/api/admin/financial/recharge-requests/${created.id}/`);
    expect(detailResponse.ok()).toBeTruthy();
    const detail = (await detailResponse.json()) as RechargeRequest;
    expect(detail.status).toBe("approved");
    expect(detail.approved_transaction_id).toBeTruthy();
  });

  test("rejects a separate pending request without crediting the user wallet", async ({ page }) => {
    await loginAsSecondTechnician(page);
    await cancelPendingRecharges(page);
    const beforeBalance = await walletBalance(page);
    const note = `RC7 admin reject ${Date.now()}`;
    const created = await createRecharge(page, "13000", note);
    await logout(page);

    await loginAsStaff(page);
    await page.goto("/en/admin/financial/recharges");

    const row = page.getByRole("row").filter({ hasText: created.id.slice(0, 8) });
    await expect(row).toBeVisible();
    await row.getByPlaceholder("Review note").fill("Receipt does not match payment.");
    await row.getByRole("button", { name: "Reject" }).click();
    await expect(row).toBeHidden();

    const detailResponse = await page.request.get(`/api/admin/financial/recharge-requests/${created.id}/`);
    expect(detailResponse.ok()).toBeTruthy();
    const detail = (await detailResponse.json()) as RechargeRequest;
    expect(detail.status).toBe("rejected");

    await logout(page);
    await loginAsSecondTechnician(page);
    expect(await walletBalance(page)).toBe(beforeBalance);
  });
});
