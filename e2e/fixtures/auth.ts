/**
 * E2E test fixtures and login helpers.
 *
 * Uses deterministic E2E user credentials from environment variables.
 * Backend seeds these via:
 *   E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures
 */

import { expect, type Page, type BrowserContext } from "@playwright/test";

// ---------------------------------------------------------------------------
// Environment variable keys
// ---------------------------------------------------------------------------
const ENV = {
  CLIENT_EMAIL: "E2E_CLIENT_EMAIL",
  CLIENT_PASSWORD: "E2E_CLIENT_PASSWORD",
  TECHNICIAN_EMAIL: "E2E_TECHNICIAN_EMAIL",
  TECHNICIAN_PASSWORD: "E2E_TECHNICIAN_PASSWORD",
  APPROVED_PUBLIC_ID: "E2E_APPROVED_TECHNICIAN_PUBLIC_ID",
  RESTRICTED_PUBLIC_ID: "E2E_RESTRICTED_TECHNICIAN_PUBLIC_ID",
} as const;

// ---------------------------------------------------------------------------
// Default fixture values (match backend seed_e2e_fixtures command)
// The login form accepts username — Django auth uses the username field.
// ---------------------------------------------------------------------------
const DEFAULTS = {
  clientUsername: "e2e_client",
  technicianUsername: "e2e_technician",
  approvedUsername: "e2e_approved_tech",
  restrictedUsername: "e2e_restricted_tech",
  password: "local-test-only",
} as const;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
export interface E2EConfig {
  clientUsername: string;
  clientPassword: string;
  technicianUsername: string;
  technicianPassword: string;
  approvedUsername: string;
  approvedPublicId: string;
  restrictedPublicId: string;
}

function readEnvOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(
      `Missing required E2E environment variable: ${key}. ` +
        "Set it in .env.local or .env.e2e before running E2E tests."
    );
  }
  return val;
}

/**
 * Build E2E config from environment variables with fallback to defaults.
 */
export function getE2EConfig(): E2EConfig {
  return {
    clientUsername:
      process.env[ENV.CLIENT_EMAIL] || DEFAULTS.clientUsername,
    clientPassword: process.env[ENV.CLIENT_PASSWORD] || DEFAULTS.password,
    technicianUsername:
      process.env[ENV.TECHNICIAN_EMAIL] || DEFAULTS.technicianUsername,
    technicianPassword:
      process.env[ENV.TECHNICIAN_PASSWORD] || DEFAULTS.password,
    approvedUsername: DEFAULTS.approvedUsername,
    approvedPublicId:
      process.env[ENV.APPROVED_PUBLIC_ID] || "e2e-approved-tech",
    restrictedPublicId:
      process.env[ENV.RESTRICTED_PUBLIC_ID] || "e2e-restricted-tech",
  };
}

// ---------------------------------------------------------------------------
// Login helpers
// ---------------------------------------------------------------------------

/**
 * Log in as the E2E client fixture.
 * Navigates to login, fills credentials, submits, waits for redirect to account.
 */
export async function loginAsClient(page: Page): Promise<void> {
  const config = getE2EConfig();
  await login(page, config.clientUsername, config.clientPassword);
}

/**
 * Log in as the E2E technician fixture.
 */
export async function loginAsTechnician(page: Page): Promise<void> {
  const config = getE2EConfig();
  await login(page, config.technicianUsername, config.technicianPassword);
}

/**
 * Log in as the E2E approved technician fixture (owns most execution contracts).
 */
export async function loginAsApprovedTechnician(page: Page): Promise<void> {
  const config = getE2EConfig();
  await login(page, config.approvedUsername, config.clientPassword);
}

/**
 * Log in as the second approved technician fixture.
 */
export async function loginAsSecondTechnician(page: Page): Promise<void> {
  await login(page, "e2e_approved_tech2", "local-test-only");
}

/**
 * Core login flow: navigate to /ar/login, fill form, submit, wait for account.
 */
async function login(
  page: Page,
  username: string,
  password: string
): Promise<void> {
  await page.goto("/ar/login");
  await page.waitForLoadState("networkidle");
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');

  // Wait for navigation to account page (with extended timeout for slow envs)
  try {
    await page.waitForURL("**/account", { timeout: 20000 });
  } catch {
    // If navigation didn't happen, check for error state
    const errorAlert = page.locator('[role="alert"]');
    if (await errorAlert.isVisible({ timeout: 3000 }).catch(() => false)) {
      const errorText = await errorAlert.textContent();
      throw new Error(`Login failed: ${errorText}`);
    }
    throw new Error(
      "Login did not redirect to /account. Check credentials and backend connectivity."
    );
  }
}

/**
 * Log out the current user by navigating to /ar/logout.
 */
export async function logout(page: Page): Promise<void> {
  await page.goto("/ar/logout");
  await page.waitForURL("**/login", { timeout: 10000 });
}

/**
 * Clear cookies, localStorage, and sessionStorage for a context.
 */
export async function clearSession(context: BrowserContext): Promise<void> {
  await context.clearCookies();
  // Clear storage on all pages
  const pages = context.pages();
  for (const page of pages) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

/**
 * Assert that no auth tokens are stored in browser storage.
 */
export async function expectNoTokensInStorage(
  page: Page
): Promise<void> {
  const localStorageData = await page.evaluate(() => ({ ...localStorage }));
  const sessionStorageData = await page.evaluate(() => ({
    ...sessionStorage,
  }));
  for (const key of Object.keys({
    ...localStorageData,
    ...sessionStorageData,
  })) {
    expect(key.toLowerCase()).not.toContain("token");
    expect(key.toLowerCase()).not.toContain("access");
    expect(key.toLowerCase()).not.toContain("refresh");
    expect(key.toLowerCase()).not.toContain("jwt");
  }
}
