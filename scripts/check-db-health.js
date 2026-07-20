#!/usr/bin/env node
/**
 * check-db-health.js — loud alert on the ONSET of a Supabase connection pinch,
 * read from the db_health_log forensics table (migration 372).
 *
 * The recurring "Unhealthy" incidents are PostgREST connection-pool saturation,
 * NOT a code leak (idle-in-transaction + lock waits stay at 0 and it self-
 * recovers). At rest the DB sits ~24/60 connections; a burst — the 08:00 UTC
 * nightly-dreams cron, or heavy render load — spikes PostgREST from ~3 to ~21,
 * pushing total toward the 60 ceiling until the pool saturates and queries queue
 * ("Unhealthy"), then recovers when the burst ends. Root-caused 2026-07-18 with
 * the forensics added the day before.
 *
 * This pages us at the ONSET instead of after the app falls over. It fails the
 * workflow (→ GitHub failure email) on any of:
 *   - connections at/over a % of the ceiling (the pinch),
 *   - idle-in-transaction climbing (a genuine transaction leak — a DIFFERENT bug),
 *   - lock waiters (contention),
 *   - a STALE snapshot / unreadable table (the snapshot cron stopped or the DB is
 *     already unreachable — i.e. we're mid-incident right now).
 *
 * Run on a schedule by .github/workflows/db-health-monitor.yml.
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-db-health.js
 */

const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (n) => process.env[n] || envFile[n];

const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');

// Alarm when the MAX total_conn across the recent window reaches this fraction of
// max_connections. Ratio (not absolute) so it auto-adapts if the compute tier —
// and thus max_connections — is upgraded. 0.87 of 60 ≈ 52.
const CONN_PCT_ALARM = parseFloat(getKey('DB_CONN_PCT_ALARM') || '0.87');
// idle-in-transaction is 0 in healthy operation; a sustained non-trivial count is
// a real connection leak (a code path holding an open transaction).
const IDLE_TXN_ALARM = parseInt(getKey('DB_IDLE_TXN_ALARM') || '8', 10);
// If the newest snapshot is older than this, the per-minute snapshot cron isn't
// running — usually because the DB is already unreachable (mid-incident).
const STALE_MIN = parseInt(getKey('DB_STALE_MIN') || '8', 10);
// How many recent snapshots to consider (snapshots are 1/min).
const WINDOW = parseInt(getKey('DB_HEALTH_WINDOW') || '6', 10);
// Guard so a hung read (DB refusing connections) can't stall the workflow — a
// timeout is itself the alarm.
const READ_TIMEOUT_MS = parseInt(getKey('DB_HEALTH_READ_TIMEOUT_MS') || '20000', 10);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

(async () => {
  let rows;
  try {
    const { data, error } = await withTimeout(
      sb
        .from('db_health_log')
        // select('*') so the new mig-381 idle-age columns are picked up whether or
        // not that migration is applied yet (naming a not-yet-existing column would
        // error the whole read and false-alarm the monitor).
        .select('*')
        .order('captured_at', { ascending: false })
        .limit(WINDOW),
      READ_TIMEOUT_MS,
      'db_health_log read'
    );
    if (error) throw new Error(error.message);
    rows = data;
  } catch (e) {
    // A read that errors or hangs is the incident itself — the DB is refusing
    // connections right now. Alarm.
    console.error(
      `::error::db-health read FAILED (${e.message}) — the DB may be refusing connections RIGHT NOW.`
    );
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.error(
      '::error::db_health_log is EMPTY — migration 372 not applied, or the snapshot cron never ran.'
    );
    process.exit(1);
  }

  const newest = rows[0];
  const ageMin = (Date.now() - new Date(newest.captured_at).getTime()) / 60000;
  const maxConn = newest.max_connections || 60;

  let alarm = false;

  // Stale snapshot → the per-minute capture cron isn't running (DB likely down).
  if (ageMin > STALE_MIN) {
    console.error(
      `::error::db_health_log STALE — newest snapshot is ${ageMin.toFixed(1)}min old (> ${STALE_MIN}min). The snapshot cron stopped — the DB may be unreachable.`
    );
    alarm = true;
  }

  // Connection pinch — the recurring saturation signature.
  const peak = rows.reduce((a, b) => (b.total_conn > a.total_conn ? b : a));
  const peakPct = peak.total_conn / (peak.max_connections || 60);
  if (peakPct >= CONN_PCT_ALARM) {
    console.error(
      `::error::DB connections at ${peak.total_conn}/${peak.max_connections} (${(peakPct * 100).toFixed(0)}% of ceiling) @ ${peak.captured_at} — PostgREST pool nearing saturation (the "Unhealthy" onset).`
    );
    console.error(`  by_application: ${JSON.stringify(peak.by_application)}`);
    if (peak.longest_active_secs > 30 && peak.longest_active_query) {
      console.error(
        `  longest active (${Math.round(peak.longest_active_secs)}s): ${String(peak.longest_active_query).slice(0, 200)}`
      );
    }
    alarm = true;
  }

  // Idle-in-transaction leak — a DIFFERENT problem (a code path holding a txn).
  const peakIdleTxn = rows.reduce((a, b) => (b.idle_in_txn_conn > a.idle_in_txn_conn ? b : a));
  if (peakIdleTxn.idle_in_txn_conn > IDLE_TXN_ALARM) {
    console.error(
      `::error::${peakIdleTxn.idle_in_txn_conn} idle-in-transaction connections @ ${peakIdleTxn.captured_at} (> ${IDLE_TXN_ALARM}) — a code path is holding an open transaction (connection leak).`
    );
    alarm = true;
  }

  // Lock contention.
  const peakLocks = rows.reduce((a, b) => (b.lock_waiters > a.lock_waiters ? b : a));
  if (peakLocks.lock_waiters > 0) {
    console.error(
      `::error::${peakLocks.lock_waiters} backends waiting on a lock @ ${peakLocks.captured_at} — lock contention.`
    );
    alarm = true;
  }

  // Idle-connection CREEP — the leak signal (mig 381 columns). With
  // idle_session_timeout=10min in place, no plain-idle connection should outlive
  // ~11min; one much older means idle connections are accumulating faster than
  // they're reaped (a genuine connection leak) or the reaper isn't applied. This
  // pages us on the leak ONSET, hours before it eats the headroom and wedges the
  // DB. Guarded with `?? 0` so it's a no-op until 381 populates the column.
  const IDLE_AGE_ALARM = parseInt(getKey('DB_IDLE_AGE_ALARM_SEC') || '1500', 10); // 25 min
  const peakIdleAge = rows.reduce((a, b) =>
    (b.oldest_idle_secs ?? 0) > (a.oldest_idle_secs ?? 0) ? b : a
  );
  if ((peakIdleAge.oldest_idle_secs ?? 0) > IDLE_AGE_ALARM) {
    console.error(
      `::error::oldest IDLE connection is ${Math.round(peakIdleAge.oldest_idle_secs / 60)}min old @ ${peakIdleAge.captured_at} ` +
        `(> ${Math.round(IDLE_AGE_ALARM / 60)}min) — idle connections accumulating (leak, or the idle_session_timeout reaper isn't applied). ` +
        `idle_age_by_application: ${JSON.stringify(peakIdleAge.idle_age_by_application)}`
    );
    console.error('  → run `node scripts/db-connections.js` to see the offending connections.');
    alarm = true;
  }

  console.log(
    `db-health: newest ${newest.total_conn}/${maxConn} conn (${((newest.total_conn / maxConn) * 100).toFixed(0)}%), ` +
      `active=${newest.active_conn} idle=${newest.idle_conn} idle_txn=${newest.idle_in_txn_conn} locks=${newest.lock_waiters}, ` +
      `window-peak ${peak.total_conn}/${maxConn}, snapshot age ${ageMin.toFixed(1)}min`
  );

  if (alarm) process.exit(1);
  console.log('✅ db_health healthy.');
})().catch((e) => {
  console.error('::error::db-health monitor crashed:', e.message);
  process.exit(1);
});
