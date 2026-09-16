/**
 * Pool-headroom guard — lets heavy scripts / agents self-throttle before a render
 * or seed burst so they don't saturate the Postgres connection pool (the recurring
 * "app goes non-responsive" incidents; see DB_CONNECTION_SATURATION_PLAN.md).
 *
 * Reads the newest db_health_log snapshot (migration 372, written every minute by
 * pg_cron) — a cheap single-row read.
 *
 * ⚠️ THE SNAPSHOT IS BLIND EXACTLY WHEN IT MATTERS, so a stale read does NOT simply
 * mean "assume tight" any more. The snapshot is written BY pg_cron: when the database
 * is in trouble the cron stops, the snapshot goes stale, and the guard that exists to
 * stop a burst during a DB problem is the one thing guaranteed to be uninformed during
 * a DB problem — and `waitForHeadroom` then FAILS OPEN and proceeds anyway. Seen for
 * real on 2026-09-16: a ~7-minute Postgres restart (04:38-04:45 UTC) left the newest
 * snapshot 8 minutes old while the pool was in fact fine at 34/90.
 *
 * So on a stale/missing snapshot we now FORCE a fresh one — `capture_db_health()` is
 * the same SECURITY DEFINER function the cron calls (migration 372, granted to
 * service_role), reading live pg_stat_activity — and re-read. That turns "unknown"
 * into a real number in one extra round trip, AND self-heals the snapshot for every
 * other consumer. If that RPC itself fails, the database genuinely is unreachable and
 * backing off is the correct answer rather than a guess.
 *
 * Usage in a producer, before a concurrent render/seed batch:
 *   const { waitForHeadroom } = require('./lib/poolHeadroom');
 *   await waitForHeadroom({ min: 25, label: 'pure-scene QA' });
 *
 * Or as a gate: `node scripts/check-pool-headroom.js` (exit 0 = OK, 1 = tight, 2 = unknown).
 */

const { createClient } = require('@supabase/supabase-js');

function envVal(name) {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      const i = l.indexOf('=');
      if (i > 0 && l.slice(0, i).trim() === name) return l.slice(i + 1).trim();
    }
  } catch {
    /* no .env.local — fall through to process.env */
  }
  return process.env[name];
}

const SUPABASE_URL =
  envVal('SUPABASE_URL') ||
  envVal('EXPO_PUBLIC_SUPABASE_URL') ||
  'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = envVal('SUPABASE_SERVICE_ROLE_KEY');
const STALE_MIN = 2; // a snapshot older than this means the cron stalled — treat as saturated

let _sb;
function client() {
  if (!_sb) _sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  return _sb;
}

/**
 * @returns {Promise<{ok:boolean, stale:boolean, headroom:number, total:number|null,
 *   max:number|null, ageMin:number|null, reason?:string}>}
 * headroom = free connections (max - total). 0 when stale/unknown (fail-safe).
 */
/** Newest snapshot row, shaped. `null` when there is nothing readable. */
async function readSnapshot() {
  const { data, error } = await client()
    .from('db_health_log')
    .select('total_conn, max_connections, captured_at')
    .order('captured_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return { row: null, reason: error?.message || 'no snapshot row' };
  const max = data.max_connections || 90;
  const ageMin = (Date.now() - new Date(data.captured_at).getTime()) / 60000;
  return {
    row: {
      ok: true,
      stale: ageMin > STALE_MIN,
      headroom: max - data.total_conn,
      total: data.total_conn,
      max,
      ageMin,
    },
    reason: null,
  };
}

async function getHeadroom() {
  try {
    const first = await readSnapshot();
    if (first.row && !first.row.stale) return first.row;

    // Stale or missing. Do NOT guess — the snapshot's own writer is a casualty of the
    // conditions we are trying to measure. Force a live capture and re-read.
    const { error: rpcErr } = await client().rpc('capture_db_health');
    if (rpcErr) {
      // The DB is genuinely unreachable (or the grant is gone) — backing off is right.
      return {
        ok: false,
        stale: true,
        headroom: 0,
        total: null,
        max: null,
        ageMin: null,
        reason: `snapshot ${first.reason || 'stale'}; live capture failed: ${rpcErr.message}`,
      };
    }
    const fresh = await readSnapshot();
    if (!fresh.row || fresh.row.stale) {
      return {
        ok: false,
        stale: true,
        headroom: 0,
        total: null,
        max: null,
        ageMin: null,
        reason: `live capture returned nothing usable (${fresh.reason || 'still stale'})`,
      };
    }
    return { ...fresh.row, refreshed: true };
  } catch (e) {
    return {
      ok: false,
      stale: true,
      headroom: 0,
      total: null,
      max: null,
      ageMin: null,
      reason: e.message,
    };
  }
}

/**
 * Block until the pool has >= `min` free connections, or until `timeoutMs`. FAIL-OPEN:
 * after the timeout it PROCEEDS with a loud warning (never deadlocks a run), but logs
 * every back-off so the throttling is visible. Returns the final headroom reading.
 *
 * @param {{min?:number, timeoutMs?:number, pollMs?:number, label?:string}} opts
 */
async function waitForHeadroom({
  min = 25,
  timeoutMs = 180000,
  pollMs = 8000,
  label = 'burst',
} = {}) {
  const start = Date.now();
  let h = await getHeadroom();
  while ((h.stale || h.headroom < min) && Date.now() - start < timeoutMs) {
    const why = h.stale
      ? `snapshot stale/unreadable (${h.reason || (h.ageMin && h.ageMin.toFixed(1) + 'min')})`
      : `headroom ${h.headroom}/${h.max} < ${min}`;
    console.warn(`[poolHeadroom] ${label}: waiting — ${why}; backing off ${pollMs / 1000}s…`);
    await new Promise((r) => setTimeout(r, pollMs));
    h = await getHeadroom();
  }
  if (h.stale || h.headroom < min) {
    console.warn(
      `[poolHeadroom] ${label}: PROCEEDING after ${Math.round((Date.now() - start) / 1000)}s despite low headroom ` +
        `(${h.stale ? 'stale snapshot' : h.headroom + ' free'}) — keep concurrency low.`
    );
  } else {
    console.log(`[poolHeadroom] ${label}: clear — ${h.headroom}/${h.max} free.`);
  }
  return h;
}

module.exports = { getHeadroom, waitForHeadroom };
