#!/usr/bin/env node
/**
 * check-pool-headroom.js — CLI gate on Postgres connection headroom.
 * Reads the newest db_health_log snapshot via scripts/lib/poolHeadroom.js.
 *
 * Exit codes (so an agent/CI step can gate on it):
 *   0 = OK   (>= POOL_MIN_HEADROOM free)
 *   1 = TIGHT (below the threshold — hold heavy work)
 *   2 = UNKNOWN/STALE (can't tell — assume tight)
 *
 * Usage: node scripts/check-pool-headroom.js   [POOL_MIN_HEADROOM=25]
 */
const { getHeadroom } = require('./lib/poolHeadroom');

const MIN = parseInt(process.env.POOL_MIN_HEADROOM || '25', 10);

(async () => {
  const h = await getHeadroom();
  if (!h.ok) {
    console.error(`pool headroom: UNKNOWN (${h.reason}) — assume tight, hold heavy work`);
    process.exit(2);
  }
  const base = `pool: ${h.total}/${h.max} used, ${h.headroom} free (snapshot ${h.ageMin.toFixed(1)}min old)`;
  if (h.stale) {
    console.error(`${base} — STALE snapshot; assume tight`);
    process.exit(2);
  }
  if (h.headroom < MIN) {
    console.error(`${base} — TIGHT (< ${MIN} free); hold heavy renders/seeds`);
    process.exit(1);
  }
  console.log(`${base} — OK`);
  process.exit(0);
})();
