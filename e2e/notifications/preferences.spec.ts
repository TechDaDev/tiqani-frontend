import { expect, test } from "@playwright/test";
import { loginAsClient } from "../fixtures/auth";
import { openNotificationSettings } from "../helpers/notifications";

test.describe("Phase 11 notification preferences", () => {
  test("client toggles review preference", async ({ page }) => {
    await loginAsClient(page);
    await openNotificationSettings(page);

    const checkbox = page.getByTestId("notification-pref-reviews");
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test("Arabic settings route renders protected preference UI", async ({ page }) => {
    await loginAsClient(page);
    await openNotificationSettings(page, "ar");
    await expect(page).toHaveURL(/\/ar\/settings\/notifications/);
    await expect(page.getByTestId("notification-preferences")).toBeVisible();
  });
});
