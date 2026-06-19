#!/usr/bin/env node
/**
 * check-abuse.js — loud monitor for CROSS-ACCOUNT abuse (free-render farming).
 *
 * Per-user rate limits (in-flight cap, edge_function_invocations 10/min, social
 * 60/min) cap ONE account — they're structurally blind to farming, where 1,000
 * fresh accounts each do ONE free first-dream. Email confirmation + the
 * one-first-dream-per-account index are the front-door gate; this is the
 * tripwire BEHIND it. Without it, a farming run only shows up on the Replicate /
 * Anthropic bill, never as an alert.
 *
 * Fails the run loudly (exit 1 → GitHub failure email, same channel as the other
 * monitors) when account-creation or free-first-dream volume spikes past a
 * threshold, across TWO windows:
 *   - 1h  (BURST  — a scripted flood), and
 *   - 24h (DRIP   — a slow trickle that stays under the hourly bar all day).
 *
 * Thresholds are env-overridable and START CONSERVATIVE — TUNE them up once a
 * few days of real baseline traffic is visible (pre-launch these sit well above
 * organic signups, so a trip means something real).
 *
 * Run on a schedule by .github/workflows/abuse-monitor.yml.
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-abuse.js
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
const num = (n, d) => parseInt(getKey(n) || String(d), 10);

const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');

// TUNE after observing baseline. Each new account = one free heavy first-dream
// (~$0.10 of AI), so these bound the bill a farming run can ring up before we hear.
const NEW_USERS_1H = num('ABUSE_NEW_USERS_1H', 40);
const NEW_USERS_24H = num('ABUSE_NEW_USERS_24H', 300);
const FIRST_DREAMS_1H = num('ABUSE_FIRST_DREAMS_1H', 50);
const FIRST_DREAMS_24H = num('ABUSE_FIRST_DREAMS_24H', 350);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

const sinceIso = (mins) => new Date(Date.now() - mins * 60_000).toISOString();

/** Count real (non-bot) signups since `mins` ago. */
async function countNewUsers(mins) {
  const { count, error } = await sb
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_bot', false)
    .gte('created_at', sinceIso(mins));
  if (error) throw new Error(`users count failed: ${error.message}`);
  return count || 0;
}

/** Count free first-dream enqueues since `mins` ago (the cost vector). */
async function countFirstDreams(mins) {
  const { count, error } = await sb
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('source', 'first_dream')
    .gte('created_at', sinceIso(mins));
  if (error) throw new Error(`dream_queue count failed: ${error.message}`);
  return count || 0;
}

(async () => {
  const [u1, u24, d1, d24] = await Promise.all([
    countNewUsers(60),
    countNewUsers(60 * 24),
    countFirstDreams(60),
    countFirstDreams(60 * 24),
  ]);

  console.log(`signups   — 1h: ${u1}/${NEW_USERS_1H}   24h: ${u24}/${NEW_USERS_24H}`);
  console.log(`first_dreams — 1h: ${d1}/${FIRST_DREAMS_1H}   24h: ${d24}/${FIRST_DREAMS_24H}`);

  const alarms = [];
  if (u1 > NEW_USERS_1H)
    alarms.push(`${u1} signups in 1h (> ${NEW_USERS_1H}) — possible scripted signup flood`);
  if (u24 > NEW_USERS_24H)
    alarms.push(`${u24} signups in 24h (> ${NEW_USERS_24H}) — possible sustained signup drip`);
  if (d1 > FIRST_DREAMS_1H)
    alarms.push(
      `${d1} first-dreams in 1h (> ${FIRST_DREAMS_1H}) — possible free-render farming burst`
    );
  if (d24 > FIRST_DREAMS_24H)
    alarms.push(
      `${d24} first-dreams in 24h (> ${FIRST_DREAMS_24H}) — possible free-render farming drip`
    );

  if (alarms.length > 0) {
    for (const a of alarms) console.log(`::error::ABUSE SIGNAL: ${a}`);
    console.error(
      `\n${alarms.length} abuse signal(s) — investigate signups + first_dream sources.`
    );
    process.exit(1);
  }
  console.log('\nno abuse signals — within thresholds.');
})().catch((e) => {
  console.error('check-abuse threw:', e.message);
  process.exit(1);
});
