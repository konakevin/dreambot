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
 */
const { resolveSupabaseAccessToken } = require('./lib/supabaseAccessToken');
const { SQL, evaluate, formatTable } = require('./lib/edge546');

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
      '/analytics/endpoints/logs.all',
      { sql: SQL, iso_timestamp_start: start.toISOString(), iso_timestamp_end: end.toISOString() },
      token
    ),
  ]);
  const rows = Array.isArray(logs && logs.result) ? logs.result : [];
  const { table, alarms } = evaluate(rows, functions);
  console.log(
    `Edge Function 546 rate, last ${HOURS} h (${start.toISOString()} → ${end.toISOString()})\n`
  );
  console.log(table.length ? formatTable(table) : '(no edge requests in the window)');
  if (alarms.length) {
    console.error(
      `\n✗ 546 SLO breached:\n  ${alarms.join('\n  ')}\n\nThe isolate is doing pixel work again — NO_PIXELS_IN_ISOLATE_PLAN.md.`
    );
    process.exit(1);
  }
  console.log('\n✓ every function under the 3% 546 SLO');
}

main().catch((e) => {
  console.error(`check-edge-546 failed: ${e.message}`);
  process.exit(2);
});
