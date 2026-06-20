#!/usr/bin/env bash
# run-e2e-clean.sh — Deterministic full E2E suite runner.
#
# Usage:
#   E2E_FIXTURE_PASSWORD='local-test-only' bash scripts/run-e2e-clean.sh
#
# What it does:
#   1. Verifies required ports are available / owned by expected processes.
#   2. Kills stale frontend processes for this project only.
#   3. Removes stale E2E cache (never touches production .next).
#   4. Reseeds fixtures deterministically.
#   5. Verifies backend reachability.
#   6. Runs the full Playwright suite with isolated cache.
#   7. Cleans up owned processes on exit.
#   8. Returns the real Playwright exit code.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="${BACKEND_DIR:-/home/zeus3000/PycharmProjects/tiqani_V3}"
FRONTEND_PORT=3002
BACKEND_PORT=8000
NEXT_DIST_DIR="${NEXT_DIST_DIR:-.next-e2e}"

echo "=== run-e2e-clean.sh ==="
echo "Project:  $PROJECT_DIR"
echo "Backend:  $BACKEND_DIR"
echo "Dist dir: $NEXT_DIST_DIR"
echo ""

# ---- 1. Kill stale project processes ----
echo "--- Cleaning stale processes ---"
# Kill any Next.js dev server running from our project
pkill -f "$PROJECT_DIR.*next dev" 2>/dev/null || true
pkill -f "$PROJECT_DIR.*next-server" 2>/dev/null || true
# Kill any Playwright processes from our project
pkill -f "playwright.*$PROJECT_DIR" 2>/dev/null || true
sleep 1

# ---- 2. Verify ports ----
echo "--- Verifying ports ---"
# Backend must be listening
if ! lsof -i :$BACKEND_PORT 2>/dev/null | grep -q LISTEN; then
  echo "ERROR: Backend not running on port $BACKEND_PORT"
  echo "Start it: cd $BACKEND_DIR && source .venv/bin/activate && python manage.py runserver 127.0.0.1:$BACKEND_PORT &"
  exit 1
fi
echo "✓ Backend port $BACKEND_PORT in use"

# Frontend port should be free (Playwright webServer will start it)
if lsof -i :$FRONTEND_PORT 2>/dev/null | grep -q LISTEN; then
  echo "⚠ Frontend port $FRONTEND_PORT in use — may conflict with webServer"
fi

# ---- 3. Remove stale E2E cache ----
echo "--- Cleaning E2E cache ---"
rm -rf "$PROJECT_DIR/$NEXT_DIST_DIR"
echo "✓ Removed $NEXT_DIST_DIR"

# ---- 4. Reseed fixtures ----
echo "--- Reseeding fixtures ---"
cd "$BACKEND_DIR"
source .venv/bin/activate
E2E_FIXTURE_PASSWORD="${E2E_FIXTURE_PASSWORD?Required}" \
  python manage.py seed_e2e_fixtures --reset --force 2>&1
echo "✓ Fixtures reseeded"

# ---- 5. Verify backend ----
echo "--- Verifying backend ---"
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$BACKEND_PORT/api/health/ 2>/dev/null || echo "000")
if [ "$HEALTH" != "200" ]; then
  echo "ERROR: Backend health check returned $HEALTH"
  exit 1
fi
echo "✓ Backend healthy"

# ---- 6. Run Playwright ----
echo ""
echo "=== Running full Playwright suite ==="
cd "$PROJECT_DIR"
PLAYWRIGHT_EXIT=0

CI=1 \
PLAYWRIGHT_HTML_OPEN=never \
NEXT_DIST_DIR="$NEXT_DIST_DIR" \
  npx playwright test \
    --reporter=line \
    2>&1 || PLAYWRIGHT_EXIT=$?

echo ""
echo "=== Playwright exit code: $PLAYWRIGHT_EXIT ==="

# ---- 7. Cleanup owned processes ----
echo "--- Cleanup ---"
pkill -f "$PROJECT_DIR.*next dev" 2>/dev/null || true
pkill -f "$PROJECT_DIR.*next-server" 2>/dev/null || true

# ---- 8. Return Playwright exit code ----
exit $PLAYWRIGHT_EXIT
