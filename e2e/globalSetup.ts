/**
 * Playwright global setup — resets E2E fixtures and verifies backend.
 *
 * Runs once before each `npx playwright test` invocation.
 * FAILS LOUDLY if reset fails — never silently continues with stale state.
 */

import { type FullConfig } from "@playwright/test";
import { execSync } from "child_process";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
const BACKEND_DIR = process.env.BACKEND_DIR || "/home/zeus3000/PycharmProjects/tiqani_V3";
const FIXTURE_RESET_TIMEOUT_MS = Number(process.env.E2E_FIXTURE_RESET_TIMEOUT_MS || 180_000);

async function globalSetup(config: FullConfig) {
  // 1. Verify backend is reachable — fail if unreachable
  const healthResp = await fetch(`${BACKEND_URL}/api/health/`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!healthResp.ok) {
    throw new Error(
      `Backend health check returned ${healthResp.status}. ` +
        "Cannot run E2E tests without a healthy backend on port 8000."
    );
  }
  console.log("✓ Backend reachable");

  // 2. Reseed fixtures deterministically — fail if reset fails
  console.log("Phase 10 fixture reset started");
  const password = process.env.E2E_FIXTURE_PASSWORD || "local-test-only";
  try {
    const output = execSync(
      `cd ${BACKEND_DIR} && .venv/bin/python manage.py seed_e2e_fixtures --reset 2>&1`,
      {
        env: { ...process.env, E2E_FIXTURE_PASSWORD: password },
        timeout: FIXTURE_RESET_TIMEOUT_MS,
      }
    );
    console.log("Phase 10 fixture reset completed");
    console.log(`Backend fixture command exit code: 0`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Fixture reseed FAILED:", msg);
    throw new Error(
      `Fixture reset failed — cannot run E2E tests with stale state.\n${msg}`
    );
  }

  // 3. Verify fixture users exist
  const listResp = await fetch(`${BACKEND_URL}/api/technicians/`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!listResp.ok) {
    throw new Error(`Technician list returned ${listResp.status} after reseed.`);
  }
  const data = (await listResp.json()) as { count?: number };
  console.log(`✓ Public technicians: ${data.count ?? "unknown"}`);

  console.log("E2E setup complete.");
}

export default globalSetup;
