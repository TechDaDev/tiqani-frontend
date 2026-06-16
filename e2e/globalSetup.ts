/**
 * Playwright global setup — resets E2E fixtures and verifies backend.
 *
 * Runs once before each `npx playwright test` invocation.
 * Calls the Django seed management command with --reset to guarantee
 * every test run starts from a deterministic, idempotent fixture state.
 */

import { type FullConfig } from "@playwright/test";
import { execSync } from "child_process";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
const BACKEND_DIR = process.env.BACKEND_DIR || "/home/zeus3000/PycharmProjects/tiqani_V3";

async function globalSetup(config: FullConfig) {
  // 1. Verify backend is reachable
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

  // 2. Reseed fixtures deterministically (idempotent reset)
  //    Ensures every test run starts from a clean, consistent state
  //    even when a previous run mutated fixture data.
  try {
    const password = process.env.E2E_FIXTURE_PASSWORD || "local-test-only";
    execSync(
      `cd ${BACKEND_DIR} && .venv/bin/python manage.py seed_e2e_fixtures --reset 2>&1`,
      {
        env: { ...process.env, E2E_FIXTURE_PASSWORD: password },
        timeout: 30_000,
      }
    );
    console.log("✓ Fixtures reseeded (deterministic)");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("⚠ Fixture reseed failed:", msg);
  }

  // 3. Verify fixture users exist
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
