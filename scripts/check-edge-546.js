#!/usr/bin/env node
/**
 * check-edge-546.js — fail loud when any Edge Function's HTTP 546 (WORKER_RESOURCE_LIMIT) rate exceeds the
 * 3% SLO over the window (default 24 h). Run by .github/workflows/edge-546-monitor.yml every 6 h; the
 * failure email is the alarm. Rationale + the fix it guards: NO_PIXELS_IN_ISOLATE_PLAN.md.
 *
 *   node scripts/check-edge-546.js [--hours=24]
 *
 * Auth: a Supabase personal access token — SUPABASE_ACCESS_TOKEN (CI secret) or the logged-in CLI's
 * keychain entry locally (scripts/lib/supabaseAccessToken.js). Reads logs only; writes nothing.
 *
 * Endpoint: `/analytics/endpoints/logs` (unified logs, ClickHouse SQL). The original
 * `/analytics/endpoints/logs.all` was removed by Supabase on 2026-09-24 (HTTP 410) and every run
 * from then to 2026-09-25 17:30 UTC failed with exit 2 before measuring — a monitor failing on its
 * own plumbing reads exactly like the alarm it exists to raise, so a 410/5xx from the API is now
 * reported as "monitor broken", distinct from "SLO breached".
 */
const { resolveSupabaseAccessToken } = require('./lib/supabaseAccessToken');
const { SQL, evaluate, formatTable, deployClampedStart } = require('./lib/edge546');

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'jimftynwrinwenonjrlj';
const API = 'https://api.supabase.com/v1/projects/' + PROJECT_REF;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const HOURS = Number(args.hours || 24);

async function api(pathname, params, token) {
  const url = new URL(API + pathname);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok)
    throw new Error(`${pathname} → HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function main() {
  const token = resolveSupabaseAccessToken();
  if (!token) {
    console.error(
      'no Supabase personal access token: set SUPABASE_ACCESS_TOKEN or run `supabase login`'
    );
    process.exit(2);
  }
  const end = new Date();
  const start = new Date(end.getTime() - HOURS * 3600 * 1000);
  const [functions, logs] = await Promise.all([
    api('/functions', {}, token),
    api(
      '/analytics/endpoints/logs',
      { sql: SQL, iso_timestamp_start: start.toISOString(), iso_timestamp_end: end.toISOString() },
      token
    ),
  ]);
  // The unified endpoint answers 200 with {error} on a bad query; treat that as plumbing, not data.
  if (logs && logs.error) throw new Error(`/analytics/endpoints/logs → ${logs.error}`);
  const rows = Array.isArray(logs && logs.result) ? logs.result : [];
  const first = evaluate(rows, functions);
  console.log(
    `Edge Function 546 rate, last ${HOURS} h (${start.toISOString()} → ${end.toISOString()})\n`
  );
  console.log(first.table.length ? formatTable(first.table) : '(no edge requests in the window)');

  // Deploy-aware: an alarm must survive on the code deployed NOW. Re-query each alarming function
  // from its own last deploy; requests before that ran different code and are not this SLO's business.
  const alarms = [];
  for (const e of first.table.filter((t) => t.alarm)) {
    const fn = functions.find((f) => f.slug === e.name);
    const since = fn ? deployClampedStart(start, fn.updated_at) : null;
    if (!since) {
      alarms.push(first.alarms.find((a) => a.startsWith(`${e.name}:`)));
      continue;
    }
    const again = await api(
      '/analytics/endpoints/logs',
      { sql: SQL, iso_timestamp_start: since.toISOString(), iso_timestamp_end: end.toISOString() },
      token
    );
    if (again && again.error) throw new Error(`/analytics/endpoints/logs → ${again.error}`);
    const re = evaluate(
      (Array.isArray(again && again.result) ? again.result : []).filter((r) => r.fid === fn.id),
      functions
    );
    const row = re.table[0];
    const verdict = !row
      ? '0 requests'
      : `${row.limit} of ${row.total} (${(row.rate * 100).toFixed(1)}%)` +
        (row.alarm ? '  ← ALARM' : row.total < 20 ? '  (too few to judge yet)' : '  ✓');
    console.log(`\n${e.name}: deployed ${since.toISOString()} — since then ${verdict}`);
    if (row && row.alarm) alarms.push(re.alarms[0]);
  }
  if (alarms.length) {
    console.error(
      `\n✗ 546 SLO breached:\n  ${alarms.join('\n  ')}\n\nThe isolate is doing pixel work again — NO_PIXELS_IN_ISOLATE_PLAN.md.`
    );
    process.exit(1);
  }
  console.log('\n✓ every function under the 3% 546 SLO');
}

main().catch((e) => {
  console.error(
    `check-edge-546 MONITOR BROKEN (not an SLO breach): ${e.message}\n` +
      "The check could not measure anything — fix the monitor's API call, then re-run it."
  );
  process.exit(2);
});
