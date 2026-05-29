#!/usr/bin/env sh
# Type-checks the Supabase Edge Functions with Deno — the SAME check CI runs
# (`deno check supabase/functions/*/index.ts`). Wired into `npm run check` (the
# husky pre-commit gate) so edge-function type errors are caught at commit time
# instead of reddening the build after push.
#
# Gracefully SKIPS (exit 0) if Deno isn't installed so contributors without it
# can still commit — CI always installs Deno and remains the hard gate. Resolves
# deno from PATH first, then the default ~/.deno/bin install (husky runs in a
# non-interactive shell that may not have ~/.deno/bin on PATH).

DENO_BIN="$(command -v deno 2>/dev/null || true)"
if [ -z "$DENO_BIN" ] && [ -x "$HOME/.deno/bin/deno" ]; then
  DENO_BIN="$HOME/.deno/bin/deno"
fi

if [ -z "$DENO_BIN" ]; then
  echo "⚠ deno not found — skipping Edge Function type check (CI will still run it)"
  exit 0
fi

echo "→ Deno type check (Edge Functions)..."
"$DENO_BIN" check supabase/functions/*/index.ts
