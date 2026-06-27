import { expect, test } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { PHASE11 } from "../fixtures/phase11";
import { notificationItem, openNotifications } from "../helpers/notifications";

test.describe("Phase 11 notifications feed", () => {
  test("client sees unread notification and marks it read", async ({ page }) => {
    await loginAsClient(page);
    await openNotifications(page);

    const item = await notificationItem(page, PHASE11.NOTIFICATION.UNREAD);
    await expect(item).toContainText(/Unread/i);
    await item.getByTestId("notification-mark-read").click();
    await expect(item.getByTestId("notification-mark-read")).toHaveCount(0);
  });

  test("client cannot mark another user's notification read", async ({ page }) => {
    await loginAsClient(page);
    const response = await page.request.post(`/api/notifications/${PHASE11.NOTIFICATION.OWNER_B}/read/`, { data: {} });
    expect([403, 404]).toContain(response.status());
  });
});
