import { expect, type Page } from "@playwright/test";

export async function openNotifications(page: Page, locale = "en") {
  await page.goto(`/${locale}/notifications`);
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("notification-page")).toBeVisible({ timeout: 10_000 });
}

export async function openNotificationSettings(page: Page, locale = "en") {
  await page.goto(`/${locale}/settings/notifications`);
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("notification-settings-page")).toBeVisible({ timeout: 10_000 });
}

export async function notificationItem(page: Page, id: string) {
  const item = page.getByTestId(`notification-item-${id}`);
  await expect(item).toBeVisible({ timeout: 10_000 });
  return item;
}
