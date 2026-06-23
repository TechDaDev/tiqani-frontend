import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "html",
  globalSetup: "./e2e/globalSetup.ts",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "NEXT_DIST_DIR=.next-e2e npx next dev --port 3002",
    url: "http://127.0.0.1:3002/en/login",
    // CI: Playwright owns the server → reuseExistingServer: false
    // Local: reuse existing when not running in CI (safe with .next-e2e isolation)
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: ".",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        locale: "en-US",
      },
    },
  ],
});
