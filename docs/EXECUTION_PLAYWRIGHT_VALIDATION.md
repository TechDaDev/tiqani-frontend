# Execution Playwright Validation

## Purpose

This document validates that the Playwright E2E test infrastructure for the execution suite is stable and repeatable.

## Infrastructure

| Parameter | Value |
|-----------|-------|
| Frontend port | 3002 |
| Backend port | 8000 |
| Isolated cache dir | `.next-e2e` (via `NEXT_DIST_DIR` env) |
| Server lifecycle | Playwright `webServer` (`reuseExistingServer: false`) |
| Workers | 1 (CI mode) |
| Timeout | 60s |
| Retries | 0 (local), 2 (CI) |
| Global setup | Reseeds fixtures, verifies backend |

## Clean Suite Runner

```bash
E2E_FIXTURE_PASSWORD='local-test-only' npm run test:e2e:clean
```

## Validation Results

| Run | Result | Date |
|-----|--------|------|
| Serial execution | 117/117 passed | Phase 8 |
| Parallel execution | 117/117 passed | Phase 8 |
| Independent suites | 110/110 passed | Phase 8 |
| Full Run 1 | 227/227 passed | Phase 8 closure |
| Full Run 2 | 227/227 passed | Phase 8 closure |

## Key Constraints Verified

- Escrow remains held after completion
- Technician wallet unchanged after completion
- No payout or release controls appear in UI
- Cross-contract IDOR blocked (404/403)
