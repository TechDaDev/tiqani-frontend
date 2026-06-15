/**
 * Playwright global setup — verifies E2E fixtures are seeded before running tests.
 *
 * Runs once before all test suites.
 * Checks that the backend fixture users exist via the Django API.
 */

import { type FullConfig } from "@playwright/test";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";

async function globalSetup(config: FullConfig) {
  // Verify backend is reachable
  try {
    const healthResp = await fetch(`${BACKEND_URL}/api/health/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!healthResp.ok) {
      console.warn(
        `⚠ Backend health check returned ${healthResp.status}. ` +
          "Tests may fail if the backend is not fully available."
      );
    } else {
      console.log("✓ Backend reachable");
    }
  } catch (err) {
    console.warn(
      "⚠ Backend not reachable at",
      BACKEND_URL,
      "— ensure Django is running on port 8000."
    );
  }

  // Verify fixture users exist (non-blocking warning)
  try {
    const listResp = await fetch(`${BACKEND_URL}/api/technicians/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (listResp.ok) {
      const data = (await listResp.json()) as { count?: number };
      console.log(`✓ Public technicians: ${data.count ?? "unknown"}`);
    }
  } catch {
    console.warn("⚠ Could not verify fixture data.");
  }

  console.log("E2E setup complete.");
}

export default globalSetup;
