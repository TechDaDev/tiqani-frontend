/**
 * Messaging E2E helpers for Playwright tests.
 *
 * Uses deterministic backend fixtures seeded via:
 *   E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures
 */

import { expect, type Page } from "@playwright/test";
import { loginAsClient, loginAsTechnician } from "./auth";

/**
 * Open the conversation list page for the currently logged-in user.
 */
export async function openConversationList(page: Page): Promise<void> {
  await page.goto("/ar/messages");
  await page.waitForURL("**/messages");
}

/**
 * Open a specific conversation by its ID.
 */
export async function openConversation(page: Page, conversationId: string): Promise<void> {
  await page.goto(`/ar/messages/${conversationId}`);
  await page.waitForURL(`**/messages/${conversationId}`);
}

/**
 * Send a message in the currently open conversation.
 */
export async function sendMessage(page: Page, text: string): Promise<void> {
  const textarea = page.getByRole("textbox", { name: /type your message/i });
  await textarea.fill(text);
  await page.getByRole("button", { name: /send/i }).click();
}

/**
 * Mark a conversation as read by opening it and waiting for the action.
 */
export async function markConversationRead(page: Page, conversationId: string): Promise<void> {
  await openConversation(page, conversationId);
  // Wait for the mark-read POST to complete
  await page.waitForTimeout(1000);
}

/**
 * Get the displayed unread count from the navigation badge.
 */
export async function getUnreadCount(page: Page): Promise<number> {
  const badge = page.locator("nav a[href*='/ar/messages']").locator("span.rounded-full");
  if (await badge.isVisible()) {
    const text = await badge.textContent();
    if (text === "99+") return 100;
    return parseInt(text || "0", 10);
  }
  return 0;
}

/**
 * Log in as Client A and open the conversations page.
 */
export async function loginAndOpenConversations(page: Page): Promise<void> {
  await loginAsClient(page);
  await openConversationList(page);
}

/**
 * Log in as Technician and open the conversations page.
 */
export async function loginAsTechAndOpenConversations(page: Page): Promise<void> {
  await loginAsTechnician(page);
  await openConversationList(page);
}
