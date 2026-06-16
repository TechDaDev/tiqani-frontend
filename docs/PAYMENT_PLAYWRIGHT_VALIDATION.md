# Payment Playwright Validation — Phase 7.2

## Spec Files

| File | Tests | Status |
|---|---|---|
| `e2e/payments/client-funding.spec.ts` | Success flow | Created |
| `e2e/payments/payment-success.spec.ts` | Sandbox success | Created |
| `e2e/payments/payment-failure.spec.ts` | Sandbox failure | Created |
| `e2e/payments/security.spec.ts` | IDOR + auth | Created |

## Fixtures

- `e2e/fixtures/payments.ts` — Deterministic UUIDs for contracts, intents
- `e2e/helpers/payments.ts` — Page interaction helpers

## Coverage

- Client initiates funding for own eligible contract
- Sandbox success → funded + escrow held
- Sandbox failure → not funded + no escrow
- Technician cannot initiate funding
- Cross-client funding blocked
- Anonymous access redirected

## Prerequisites

```bash
E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures --reset
```
