# Release Notes

## v1.0.0-rc.1

- Added production admin dashboard, users, technicians, audit, and system pages.
- Added admin route guard and staff navigation.
- Added security headers.
- Added focused Phase 12 tests and Playwright specs.

Release-candidate closure evidence:

- Full Playwright regression: 386 tests passed, 0 skipped, 0 flaky, 0 retries.
- Frontend quality gates: lint, TypeScript, Vitest, production build, and audit passed.
- Production Next smoke: locale routes, protected routes, same-origin APIs, static asset, and security headers passed.
- Empty-body milestone submit proxy now returns backend validation without emitting a Next stack trace.

Tag: `v1.0.0-rc.1-frontend`.
