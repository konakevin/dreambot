#!/usr/bin/env node
/**
 * Does the LIVE engine_config still keep community scenarios under the ceiling?
 *
 * WHY THIS EXISTS. The nightly scene split lives in a database row, so it can be
 * changed from the dashboard SQL editor with no commit, no review and no stamp — which
 * is exactly how the community-scenario share reached 50% without anyone deciding it
 * (see migration 519 for the full story). The CI test guards every copy of the split in
 * the REPO; it cannot see this table. This is the half that watches the table.
 *
 * Reads the ceiling from scripts/lib/scenarioShare.js so the alarm can never disagree
 * with the rest of the system about what "too high" means (the botCadence.js rule: an
 * alarm threshold derives from the config, it is never a second hardcoded copy).
 *
 * IT SUMS EVERY `*_scene_*_pct` COLUMN IT FINDS, not a hardcoded goofy/elegant/active.
 * The drift this guards against is a FOURTH pool added at a plausible-looking
 * percentage while every individual number still looks small, so counting only the
 * three pools we know about today would miss the next occurrence entirely.
 *
 *   node scripts/check-scenario-share.js          # exit 1 if any surface breaches
 *   node scripts/check-scenario-share.js --quiet  # only print on breach
 *
 * Wired into .github/workflows/nightly-dreams.yml as its own step AFTER the enqueue, so
 * a breach emails loudly but can never block anyone's dreams.
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const {
  SCENARIO_SHARE_CEILING_PCT,
  RAMP_PLACES,
  locationShareFromTotal,
} = require('./lib/scenarioShare');

const quiet = process.argv.includes('--quiet');

/** Env from the process (CI) or .env.local (a laptop run). */
function env(key) {
  if (process.env[key]) return process.env[key];
  try {
    const line = fs
      .readFileSync('.env.local', 'utf8')
      .split('\n')
      .find((l) => l.startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : undefined;
  } catch {
    return undefined;
  }
}

/** Group the config's scene-percentage columns by surface: dual_scene_goofy_pct →
 *  { dual: { goofy: n } }. Pattern-driven so a new pool column is picked up with no
 *  edit here. */
function splitsBySurface(row) {
  const out = {};
  for (const [col, value] of Object.entries(row)) {
    const m = col.match(/^(dual|single)_scene_(.+)_pct$/);
    if (!m) continue;
    const [, surface, pool] = m;
    (out[surface] = out[surface] || {})[pool] = Number(value) || 0;
  }
  return out;
}

(async () => {
  // Project URL is hardcoded the same way scripts/nightly-dreams.js does it, so this
  // runs in CI on the service-role secret alone with no extra repo secret to forget.
  const url = env('EXPO_PUBLIC_SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) {
    console.error('check-scenario-share: SUPABASE_SERVICE_ROLE_KEY missing');
    process.exit(1);
  }
  const sb = createClient(url, key);

  const { data, error } = await sb.from('engine_config').select('*').limit(1);
  if (error || !data || !data[0]) {
    // FAIL LOUD rather than fail open: a config guard that silently passes when it
    // cannot read the config is worse than no guard, because it reads as "checked".
    console.error('check-scenario-share: could not read engine_config —', error?.message);
    process.exit(1);
  }

  const surfaces = splitsBySurface(data[0]);
  const breaches = [];
  const lines = [];

  for (const [surface, pools] of Object.entries(surfaces)) {
    const total = Object.values(pools).reduce((a, b) => a + b, 0);
    const detail = Object.entries(pools)
      .map(([p, v]) => `${p} ${v}`)
      .join(' + ');
    const location = locationShareFromTotal(total);
    lines.push(
      `  ${surface.padEnd(6)} ${detail} = ${total}% community · ${location}% their own places`
    );
    if (total > SCENARIO_SHARE_CEILING_PCT) breaches.push({ surface, total, detail });
  }

  if (breaches.length === 0) {
    if (!quiet) {
      console.log(`scenario share OK (ceiling ${SCENARIO_SHARE_CEILING_PCT}%):`);
      lines.forEach((l) => console.log(l));
      console.log(
        `  (dreamers with fewer than ${RAMP_PLACES} saved places get more scenarios by design — adaptiveScenePcts)`
      );
    }
    process.exit(0);
  }

  console.error(
    `\n❌ COMMUNITY SCENARIO SHARE OVER THE ${SCENARIO_SHARE_CEILING_PCT}% CEILING\n`
  );
  for (const b of breaches) {
    console.error(`  ${b.surface}: ${b.detail} = ${b.total}%`);
  }
  console.error(
    `\nThese pools REPLACE the dreamer's own saved place, so this is the share of nightly
dreams that are not about where they asked to go. It drifted to 50% once already by a
new pool being switched on without taking the same amount back out of the others.

Fix it in the DATABASE (this is a live-row breach, not a code one):
  UPDATE public.engine_config SET dual_scene_goofy_pct = 6, ... ;

If the ceiling itself should move, that is a product decision: change
SCENARIO_SHARE_CEILING_PCT in scripts/lib/scenarioShare.js, the CHECK constraint in a
new migration, and every copy the CI test lists — together, on purpose.\n`
  );
  process.exit(1);
})().catch((e) => {
  console.error('check-scenario-share: crashed —', e.message);
  process.exit(1);
});
