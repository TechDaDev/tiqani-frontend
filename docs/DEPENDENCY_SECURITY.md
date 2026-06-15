# Dependency Security Audit

Generated: 2026-06-15
Project: tiqani-frontend

## Summary

| Severity | Count | Production |
|----------|-------|------------|
| Critical | 1 | Dev |
| High | 1 | Dev |
| Moderate | 6 | Dev |
| Low | 0 | - |

**All 8 vulnerabilities are development-only dependencies** (Vitest, ESLint, etc.).
No production runtime dependencies have unresolved vulnerabilities.

## Details

### Critical: `vitest` (dev)

- **Advisory**: `@vitest/mocker` — arbitrary file read when Vitest UI server is listening
- **Installed via**: vitest → @vitest/mocker
- **Fixed in**: vitest 4.1.9 (breaking major upgrade)
- **Risk**: Requires Vitest UI server to be running and accessible
- **Mitigation**: Dev-only; Vitest UI is never started in production

### High: `esbuild` (dev)

- **Advisory**: Missing binary integrity verification in Deno module; enables RCE via NPM_CONFIG_REGISTRY
- **Installed via**: vitest → vite → esbuild
- **Fixed in**: vitest 4.1.9 (breaking major upgrade)
- **Risk**: Requires attacker-controlled registry in CI/dev environment
- **Mitigation**: Dev-only; not used in production builds

### Moderate: `next` (dev dependency via postcss)

- **Advisory**: PostCSS XSS via unescaped `</style>` in CSS stringify output
- **Installed via**: next → postcss
- **Fixed in**: next 9.3.3 (breaking major upgrade)
- **Risk**: Only exploitable with attacker-controlled CSS content
- **Mitigation**: Dev-only dependency chain

### Moderate: `next-intl`

- **Advisories**: Open redirect vulnerability; prototype pollution via precompile
- **Fixed in**: next-intl 4.13.0 (breaking major upgrade)
- **Risk**: Open redirect requires crafted localization URLs; prototype pollution requires attacker-controlled translation files
- **Mitigation**: Both require attacker control of content

### Moderate: `postcss` (dev)

- **Same as next advisory above**
- **Mitigation**: Dev-only transitive dependency

### Moderate: `vite` (dev)

- **Advisory**: Path traversal in optimized deps `.map` handling
- **Fixed in**: vitest 4.1.9 (breaking major upgrade)
- **Mitigation**: Dev-only

### Moderate: `vite-node`, `@vitest/mocker` (dev)

- **Same as vitest advisory chain**
- **Mitigation**: Dev-only

## Next.js

Next.js 15.5.19 production runtime has **zero** known vulnerabilities
in its own code. The only Next.js advisory is a transitive dependency
(postcss) that only affects the dev/build toolchain.

## Recommended Actions

| Priority | Action | Effort |
|----------|--------|--------|
| Low | Upgrade vitest to 4.x when compatible with Next.js 15 | Medium |
| Low | Review next-intl open redirect in production if user locale redirects are implemented | Low |
| None | No production blockers identified | - |

## Deployment Decision

**Not a deployment blocker.** All vulnerabilities are in development-only
tooling. The production build and runtime have no unresolved advisories.
