# E2E Test Fixtures

## Overview

Deterministic, disposable, local-only test users for Playwright E2E testing.
Seeded via a Django management command on the backend.

## Seed Command

```bash
# From the backend project root:
cd /home/zeus3000/PycharmProjects/tiqani_V3
source .venv/bin/activate
E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures
```

### Options

- `--reset`: Remove existing fixtures before seeding.
- `--force`: Override production safety guard.

### Production safety

The command refuses to run when `DEBUG=False` (production). Override with `--force`.

## Fixture Users

| Role | Username | Email | State |
|------|----------|-------|-------|
| Client | `e2e_client` | `e2e-client@tiqani.local` | active, verified, client role |
| Technician | `e2e_technician` | `e2e-technician@tiqani.local` | active, approved, public |
| Approved Technician | `e2e_approved_tech` | `e2e-approved-tech@tiqani.local` | active, approved, complete, public |
| Restricted Technician | `e2e_restricted_tech` | `e2e-restricted-tech@tiqani.local` | active, unapproved, NOT public |
| Second Approved Tech | `e2e_approved_tech2` | `e2e-approved-tech2@tiqani.local` | active, approved, complete, public |

All users share the same password sourced from the `E2E_FIXTURE_PASSWORD` environment variable.

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `E2E_FIXTURE_PASSWORD` | (required) | Password for all fixture users |
| `E2E_CLIENT_EMAIL` | `e2e-client@tiqani.local` | Override client login |
| `E2E_CLIENT_PASSWORD` | `local-test-only` | Override client password |
| `E2E_TECHNICIAN_EMAIL` | `e2e-technician@tiqani.local` | Override technician login |
| `E2E_TECHNICIAN_PASSWORD` | `local-test-only` | Override technician password |

## Playwright Setup

The Playwright `globalSetup` (`e2e/globalSetup.ts`) verifies backend reachability and
fixture availability before any tests run.

## Fixture Helper

`e2e/fixtures/auth.ts` provides:

- `loginAsClient(page)` — Login using client fixture
- `loginAsTechnician(page)` — Login using technician fixture
- `logout(page)` — Navigate to logout page
- `clearSession(context)` — Clear cookies and storage
- `expectNoTokensInStorage(page)` — Assert no stored auth tokens

## Idempotency

The seed command is idempotent. Running it multiple times does not create
duplicate data.

## Reset

```bash
E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures --reset
```

## Credential Safety

- No credentials are hardcoded in committed test source files.
- `.env.local` contains local defaults and is gitignored.
- Backend `.env` is gitignored.
- Passwords are never printed by the seed command.
