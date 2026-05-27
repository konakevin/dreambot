#!/usr/bin/env node
/**
 * check-push-failures.js — loud health monitor for push delivery.
 *
 * send-push records SYSTEMIC push failures (non-ok HTTP from Expo, non-stale
 * ticket errors) into public.push_send_failures. Routine stale tokens are
 * PRUNED, not logged, so any rows here mean a real problem: an Expo outage, a
 * rate-limit storm, a credentials break, or the notifications→send-push token
 * guard misfiring (everything would 401). This watches the recent count and
 * exits 1 — failing the GitHub run (loud email) — when it crosses a ceiling.
 *
 * Run on a schedule by .github/workflows/push-failure-monitor.yml.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-push-failures.js
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
const WINDOW_HOURS = parseInt(getKey('PUSH_FAIL_WINDOW_HOURS') || '24', 10);
const ABS_ALARM = parseInt(getKey('PUSH_FAIL_ABS_ALARM') || '20', 10);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

(async () => {
  const since = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString();

  const { count } = await sb
    .from('push_send_failures')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since);
  const failed = count || 0;

  console.log(`push_send_failures (last ${WINDOW_HOURS}h): ${failed}`);

  // Triage aid: tally error_kind among recent failures.
  if (failed > 0) {
    const { data: rows } = await sb
      .from('push_send_failures')
      .select('error_kind, notification_type')
      .gte('created_at', since)
      .limit(500);
    const tally = {};
    for (const r of rows || []) {
      const k = r.error_kind || 'unknown';
      tally[k] = (tally[k] || 0) + 1;
    }
    console.log('by error_kind:', JSON.stringify(tally));
  }

  if (failed >= ABS_ALARM) {
    console.error(
      `::error::${failed} systemic push-send failures in the last ${WINDOW_HOURS}h (>= ${ABS_ALARM}) — check Expo status, the DREAM_QUEUE_WORKER_TOKEN/Vault token match (a mismatch 401s every push), and recent send-push deploys.`
    );
    process.exit(1);
  }
  console.log('✅ push delivery healthy.');
})().catch((e) => {
  console.error('::error::push-failure monitor crashed:', e.message);
  process.exit(1);
});
