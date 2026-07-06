#!/usr/bin/env bash
#
# release.sh — cut a new DreamBot marketing version: bump, commit, tag, push.
#
# This automates the MECHANICAL + error-prone half of a release (version bump in
# lockstep across app.config.js + package.json, the annotated git tag on the exact
# release commit, and the push). It deliberately STOPS before the EAS build and the
# App Store Connect steps — those are slow / interactive / human-judgement and are
# documented in RELEASE.md. It prints the exact next commands when it's done.
#
# Usage:
#   ./scripts/release.sh 1.0.2                 # bump to 1.0.2, commit, tag v1.0.2, push
#   ./scripts/release.sh 1.0.2 --dry-run       # show what it WOULD do, change nothing
#
# For a NEW BUILD of the SAME version (a resubmission — no marketing bump), you do
# NOT run this. Just rebuild: `eas build -p ios --profile production --auto-submit`
# (EAS auto-increments the build number). Tag the resubmission by hand if you want
# per-build precision: `git tag -a v<version>-build<N> <commit> -m "..."`.
#
# Guardrails (all must pass, or it aborts before touching anything):
#   - on `main`
#   - working tree clean
#   - local main == origin/main (nothing unpushed, nothing to pull)
#   - the version argument is a clean X.Y.Z and NEWER than the current one
#   - `npm run check` passes (prettier/lint/tsc/deno/jest — the same gate CI runs)
#   - the tag v<version> does not already exist
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root

NEW_VERSION="${1:-}"
DRY_RUN=false
[[ "${2:-}" == "--dry-run" ]] && DRY_RUN=true

die() { echo "❌ $*" >&2; exit 1; }
step() { echo "→ $*"; }

[[ -n "$NEW_VERSION" ]] || die "usage: ./scripts/release.sh <X.Y.Z> [--dry-run]"
[[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "version must be X.Y.Z (got '$NEW_VERSION')"

TAG="v$NEW_VERSION"

# ── Guardrails ───────────────────────────────────────────────────────────────
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] || die "not on main (on '$BRANCH')"
[[ -z "$(git status --porcelain)" ]] || die "working tree not clean — commit or stash first"

git fetch --quiet origin main
[[ "$(git rev-parse main)" == "$(git rev-parse origin/main)" ]] \
  || die "local main != origin/main — push/pull so the release commit is on top of origin"

git rev-parse "$TAG" >/dev/null 2>&1 && die "tag $TAG already exists"

CURRENT_VERSION="$(node -e "console.log(require('./app.config.js').default?.expo?.version ?? require('./app.config.js').expo?.version)" 2>/dev/null || true)"
[[ -n "$CURRENT_VERSION" ]] || die "could not read current version from app.config.js"
step "current version: $CURRENT_VERSION → new version: $NEW_VERSION"

# Newer check (sort -V: if the max of the two isn't NEW and they differ, NEW is older).
if [[ "$CURRENT_VERSION" == "$NEW_VERSION" ]]; then
  die "new version equals current ($CURRENT_VERSION) — nothing to bump"
fi
HIGHEST="$(printf '%s\n%s\n' "$CURRENT_VERSION" "$NEW_VERSION" | sort -V | tail -1)"
[[ "$HIGHEST" == "$NEW_VERSION" ]] || die "new version $NEW_VERSION is OLDER than current $CURRENT_VERSION"

if $DRY_RUN; then
  echo
  echo "DRY RUN — would do:"
  echo "  1. app.config.js  version '$CURRENT_VERSION' → '$NEW_VERSION'"
  echo "  2. package.json   version '$CURRENT_VERSION' → '$NEW_VERSION'"
  echo "  3. npm run check"
  echo "  4. git commit -m 'Release $TAG'"
  echo "  5. git tag -a $TAG"
  echo "  6. git push origin main && git push origin $TAG"
  exit 0
fi

# ── 1-2. Bump version. app.config.js is CANONICAL (the binary reads
# Constants.expoConfig.version from it). package.json version is an npm field the
# app never reads — we keep it aligned for tidiness, but a divergence there must
# NOT block a release, so its bump is best-effort.
step "bumping app.config.js (canonical) to $NEW_VERSION"
node - "$CURRENT_VERSION" "$NEW_VERSION" <<'NODE'
const fs = require('fs');
const [cur, next] = process.argv.slice(2);
const esc = cur.replace(/\./g, '\\.');

// app.config.js — REQUIRED.
{
  const re = new RegExp("(version:\\s*['\"])" + esc + "(['\"])");
  const src = fs.readFileSync('app.config.js', 'utf8');
  if (!re.test(src)) throw new Error(`could not find version ${cur} in app.config.js`);
  fs.writeFileSync('app.config.js', src.replace(re, `$1${next}$2`));
  console.log('  ✓ app.config.js updated');
}

// package.json — BEST-EFFORT (align if its current value matches; else warn).
{
  const re = new RegExp('("version":\\s*")' + esc + '(")');
  const src = fs.readFileSync('package.json', 'utf8');
  if (re.test(src)) {
    fs.writeFileSync('package.json', src.replace(re, `$1${next}$2`));
    console.log('  ✓ package.json aligned');
  } else {
    console.log(`  ⚠ package.json version != ${cur} (unused by the app) — left as-is`);
  }
}
NODE

# ── 3. Full CI gate (same as the pre-commit hook + CI) ───────────────────────
step "running npm run check (prettier / lint / tsc / deno / jest)…"
npm run check

# ── 4. Release commit (explicit paths — shared working tree rule) ────────────
step "committing"
git add app.config.js
git add package.json 2>/dev/null || true   # only staged if the best-effort bump changed it
git commit -m "Release $TAG

Marketing version $CURRENT_VERSION → $NEW_VERSION."

# ── 5. Annotated tag on the release commit ───────────────────────────────────
step "tagging $TAG"
git tag -a "$TAG" -m "DreamBot $NEW_VERSION

Marketing version $NEW_VERSION. Build number assigned by EAS at build time.
Tagged from $(git rev-parse --short HEAD) by scripts/release.sh."

# ── 6. Push commit + tag ─────────────────────────────────────────────────────
step "pushing main + $TAG"
git push origin main
git push origin "$TAG"

cat <<EOF

✅ Release commit + tag $TAG pushed. NEXT (see RELEASE.md for detail):

  1. Apply any new DB migrations (Supabase dashboard SQL editor).
  2. Deploy any changed edge functions (supabase functions deploy <name> --no-verify-jwt).
  3. Build + submit:   eas build -p ios --profile production --auto-submit
  4. In App Store Connect: attach the processed build, screenshots, review notes, Submit.
  5. AFTER it's live, bump the update gate in engine_config:
        latest_app_version = '$NEW_VERSION'   (nudges older users to update)
        min_app_version     = only raise to force-update off a broken build.
  6. Add a row to RELEASES.md (tag, build number from \`eas build:list\`, ASC status).
EOF
