#!/usr/bin/env bash
#
# check-schema-drift.sh — guard against the 047-style partial-apply trap.
#
# Migrations are applied BY HAND in the Supabase dashboard. When a file is only
# partially applied (or a dashboard change isn't back-ported to a migration), the
# live schema silently diverges from the repo — that's how `reports.details` ended
# up referenced by a migration but missing on live, breaking content reporting for
# 3 months before anyone noticed.
#
# This regenerates the TypeScript types from the LIVE database and diffs them against
# the committed types/database.ts (both normalized through the repo's prettier config
# so formatting never shows as drift). A difference means repo and live disagree:
# either a migration wasn't applied, or types weren't regenerated after a change.
#
# Requires SUPABASE_ACCESS_TOKEN (a personal access token) in the environment.
# Project ref defaults to the DreamBot project; override with SUPABASE_PROJECT_REF.
#
# Usage:  SUPABASE_ACCESS_TOKEN=sbp_... ./scripts/check-schema-drift.sh
set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-jimftynwrinwenonjrlj}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_TYPES="$ROOT/types/database.ts"

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "✖ SUPABASE_ACCESS_TOKEN is not set — needed for 'supabase gen types --project-id'." >&2
  exit 2
fi

# Format both candidates inside the repo tree so prettier resolves ./.prettierrc.
LIVE_TMP="$ROOT/types/.live-types.check.ts"
REPO_TMP="$ROOT/types/.repo-types.check.ts"
cleanup() { rm -f "$LIVE_TMP" "$REPO_TMP"; }
trap cleanup EXIT

echo "→ Generating types from the live DB ($PROJECT_REF)…"
supabase gen types typescript --project-id "$PROJECT_REF" --schema public > "$LIVE_TMP"
cp "$REPO_TYPES" "$REPO_TMP"

echo "→ Normalizing both through prettier…"
npx prettier --log-level warn --write "$LIVE_TMP" "$REPO_TMP"

if diff -u "$REPO_TMP" "$LIVE_TMP" \
  --label "types/database.ts (repo)" --label "live DB (generated)"; then
  echo "✅ No schema drift — types/database.ts matches the live database."
else
  cat >&2 <<EOF

❌ SCHEMA DRIFT DETECTED — types/database.ts does not match the live database.

A migration was likely applied to live without regenerating types, OR a migration
file in the repo was never (fully) applied to live — the 047-style partial-apply trap.

Resolve it:
  1. Apply any pending migrations in the Supabase SQL editor.
  2. Regenerate the canonical baseline:
       supabase gen types typescript --project-id $PROJECT_REF --schema public > types/database.ts
  3. Re-run this check; commit the regenerated types.
EOF
  exit 1
fi
