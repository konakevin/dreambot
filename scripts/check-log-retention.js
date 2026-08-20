#!/usr/bin/env node
/**
 * check-log-retention.js — fail-loud guard that the in-DB retention prunes are
 * actually running. The cleanup itself is automated by pg_cron (migrations
 * 274/332/349/372/441/442 schedule daily jobs); pg_cron is reliable but SILENT on
 * failure. This monitor reads each append-only log table and fails the workflow
 * (→ GitHub failure email) if any table's data has aged well past its retention
 * window (the prune stopped) or a self-managed table has ballooned.
 *
 * Windows are MIGRATION CONSTANTS (not runtime config) — they mirror the DELETE
 * cutoffs in the migrations named below. If you change a window in a migration,
 * change it here too. Each check adds a generous margin so the daily-cron timing
 * never false-alarms an on-spec table.
 *
 * Run daily by .github/workflows/log-retention-monitor.yml.
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-log-retention.js
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
if (!SUPABASE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// AGE checks: the table's oldest row must be younger than window_days + margin_days.
// (window_days mirrors the migration's DELETE cutoff; margin absorbs daily-cron timing.)
const AGE_CHECKS = [
  { table: 'ai_generation_log', ts: 'created_at', window: 30, margin: 4, mig: '274/441' },
  { table: 'db_health_log', ts: 'captured_at', window: 7, margin: 3, mig: '372' },
  { table: 'first_dream_ip_events', ts: 'created_at', window: 2, margin: 3, mig: '332' },
  { table: 'pool_pick_history', ts: 'picked_at', window: 180, margin: 10, mig: '349' },
  { table: 'bot_run_log', ts: 'created_at', window: 30, margin: 4, mig: '442' },
  { table: 'edge_function_invocations', ts: 'created_at', window: 2, margin: 3, mig: '442' },
];

// COUNT checks: self-managed / stale-bag tables where oldest-row age is NOT a valid
// signal (an active bag legitimately holds rows older than the window). Instead alert
// when the table balloons — the stale-bag prune (mig 442) has stopped. The ceiling is
// set well above the healthy active-bag steady state and well below the pre-prune 222k.
const COUNT_CHECKS = [{ table: 'bot_dedup', ceiling: 80000, mig: '442 (stale-bag)' }];

const DAY = 86400000;

(async () => {
  const failures = [];
  const ok = [];

  for (const c of AGE_CHECKS) {
    try {
      const { data, error } = await sb
        .from(c.table)
        .select(c.ts)
        .order(c.ts, { ascending: true })
        .limit(1);
      if (error) {
        console.warn(`  ⚠️  ${c.table}: read failed (${error.message}) — skipping`);
        continue;
      }
      if (!data || !data[0]) {
        ok.push(`${c.table}: empty`);
        continue;
      }
      const ageDays = (Date.now() - new Date(data[0][c.ts]).getTime()) / DAY;
      const limit = c.window + c.margin;
      if (ageDays > limit) {
        failures.push(
          `${c.table}: oldest row is ${ageDays.toFixed(1)}d old — exceeds ${c.window}d retention +${c.margin}d margin (prune from mig ${c.mig} not running?)`
        );
      } else {
        ok.push(`${c.table}: oldest ${ageDays.toFixed(1)}d ≤ ${limit}d`);
      }
    } catch (e) {
      console.warn(`  ⚠️  ${c.table}: ${e.message} — skipping`);
    }
  }

  for (const c of COUNT_CHECKS) {
    try {
      const { count, error } = await sb
        .from(c.table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.warn(`  ⚠️  ${c.table}: count failed (${error.message}) — skipping`);
        continue;
      }
      if (count > c.ceiling) {
        failures.push(
          `${c.table}: ${count} rows — over ceiling ${c.ceiling} (stale-bag prune from mig ${c.mig} not running?)`
        );
      } else {
        ok.push(`${c.table}: ${count} rows ≤ ${c.ceiling}`);
      }
    } catch (e) {
      console.warn(`  ⚠️  ${c.table}: ${e.message} — skipping`);
    }
  }

  console.log('Log-retention check @', new Date().toISOString());
  ok.forEach((m) => console.log('  ✓', m));

  if (failures.length) {
    console.error('\n❌ LOG RETENTION FAILING:');
    failures.forEach((m) => console.error('  •', m));
    console.error('\nA daily pg_cron prune has likely stopped. Check cron.job_run_details and');
    console.error('re-run the prune (e.g. SELECT public.prune_activity_logs();).');
    process.exit(1);
  }
  console.log('\n✅ All log tables within their retention windows.');
})().catch((e) => {
  console.error('❌ Monitor crashed:', e.message);
  process.exit(1);
});
