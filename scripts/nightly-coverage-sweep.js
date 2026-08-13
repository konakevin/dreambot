/**
 * nightly-coverage-sweep.js — the GUARANTEE backstop (NIGHTLY_DREAM_GUARANTEE_PLAN.md L5).
 *
 * Runs HOURLY, a few hours after each user's nightly window. For every eligible
 * Pro/trial/Basic user whose nightly window has ALREADY passed today (it's >= their
 * local SWEEP_HOUR), it checks whether they actually have a COMPLETED nightly dream
 * for their local day — and if not, RE-ENQUEUES them. This catches every failure
 * mode at once: an NSFW/render dead-letter, a stuck job, a worker outage, or a
 * missed enqueue. The invariant: by mid-morning local, 100% of eligible users have
 * a completed nightly, or this sweep has re-queued the gap (and alerts if systemic).
 *
 * Idempotent: per-local-day dedup means a gap already in flight is left alone, a
 * missing one is inserted, a dead/failed one is reset to queued. Safe to run every
 * hour. Mirrors scripts/nightly-dreams.js setup (same eligibility + timezone + cfg).
 */

const { createClient } = require('@supabase/supabase-js');
const { isDreamEligible } = require('./lib/nightlyEligibility');
const { nightlyDelivery } = require('./lib/nightlyTimezone');
const { fetchEngineConfig } = require('./lib/engineConfig');
const { classifyCoverageStatus, isSystemicGap } = require('./lib/nightlyCoverage');

// A user is "coverage-due" once it's >= this local hour (their nightly fires at 4am
// local, renders in seconds-minutes, so by 8am a healthy user is long done). The gap
// between 4am and 8am is the render+retry grace window before we consider it a miss.
const SWEEP_LOCAL_HOUR = 8;
// Alert (non-zero exit → GitHub failure email) if MORE than this fraction of due
// users were gaps — a one-off self-healed re-queue is normal; a spike is an outage.
const ALERT_GAP_RATE = 0.03;

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

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchAllPages(buildQuery, pageSize = 1000) {
  const all = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1);
    if (error) return { data: null, error };
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  return { data: all, error: null };
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

(async () => {
  console.log('\n🛟 Nightly Coverage Sweep');
  const cfg = await fetchEngineConfig(sb);
  if (!cfg.nightlyEnabled && !FORCE) {
    console.log('⏸  Nightly disabled (engine_config.nightly_enabled) — sweep skipped.\n');
    return;
  }
  const now = Date.now();
  const nowDate = new Date(now);

  // Same eligibility set as the enqueue cron (paginated; no bots; onboarding/ai gates).
  const buildEligible = () => {
    let q = sb
      .from('user_recipes')
      .select(
        `user_id,
         users!inner(last_active_at, pro_subscription, pro_subscription_expires_at, pro_trial_started_at, basic_subscription, basic_subscription_expires_at, is_bot, is_admin, timezone)`
      )
      .eq('users.is_bot', false);
    if (cfg.nightlyRequireOnboarding) q = q.eq('onboarding_completed', true);
    if (cfg.nightlyRequireAiEnabled) q = q.eq('ai_enabled', true);
    return q;
  };
  const { data: users, error } = await fetchAllPages(buildEligible);
  if (error) {
    console.error('DB error:', error.message);
    process.exit(1);
  }

  // Coverage-due = dream-eligible AND it's already >= SWEEP_LOCAL_HOUR local (their
  // nightly window has passed, so they SHOULD have a completed dream by now).
  const due = (users || [])
    .filter((u) => isDreamEligible(u.users, now, cfg.proTrialDays))
    .map((u) => ({
      user_id: u.user_id,
      delivery: nightlyDelivery(u.users.timezone, nowDate, { targetLocalHour: SWEEP_LOCAL_HOUR }),
    }))
    .filter((x) => x.delivery.shouldEnqueue)
    .map((x) => ({ user_id: x.user_id, dayKey: x.delivery.dayKey, dedup: `nightly:${x.user_id}:${x.delivery.dayKey}` }));

  if (due.length === 0) {
    console.log('No coverage-due users this hour.\n');
    return;
  }

  // Look up each due user's nightly job for their local day (chunk the .in()).
  const byDedup = new Map();
  for (const keys of chunk(due.map((d) => d.dedup), 300)) {
    const { data } = await sb
      .from('dream_queue')
      .select('dedup_key,status')
      .in('dedup_key', keys);
    for (const r of data || []) byDedup.set(r.dedup_key, r.status);
  }

  const covered = [];
  const inflight = [];
  const missing = []; // no job at all → insert
  const failed = []; // dead_letter / failed → reset
  const bucket = { covered, in_flight: inflight, missing, failed };
  for (const d of due) bucket[classifyCoverageStatus(byDedup.get(d.dedup))].push(d);

  const gaps = missing.length + failed.length;
  const gapRate = gaps / due.length;
  console.log(
    `due ${due.length} | completed ${covered.length} | in-flight ${inflight.length} | ` +
      `GAPS ${gaps} (missing ${missing.length}, dead/failed ${failed.length}) | gap-rate ${(gapRate * 100).toFixed(1)}%`
  );

  if (DRY_RUN) {
    [...missing, ...failed].forEach((d) => console.log(`  would re-enqueue ${d.user_id.slice(0, 8)} (${d.dedup})`));
    console.log(`\n(dry run — ${gaps} gaps not re-enqueued)`);
  } else if (gaps > 0) {
    // Missing → insert a fresh nightly job (unique dedup index backstops races).
    if (missing.length) {
      for (const rows of chunk(
        missing.map((d) => ({ source: 'nightly', user_id: d.user_id, status: 'queued', payload: {}, dedup_key: d.dedup })),
        300
      )) {
        const { error: insErr } = await sb.from('dream_queue').upsert(rows, { onConflict: 'dedup_key', ignoreDuplicates: true });
        if (insErr) console.error('  insert gap batch failed:', insErr.message);
      }
    }
    // Dead/failed → reset to queued for a fresh roll (L3 gives it the full retry budget).
    for (const d of failed) {
      const { error: rqErr } = await sb
        .from('dream_queue')
        .update({ status: 'queued', attempt_count: 0, last_error: null, started_at: null, worker_id: null, completed_at: null, created_at: new Date().toISOString() })
        .eq('dedup_key', d.dedup);
      if (rqErr) console.error(`  reset ${d.dedup} failed:`, rqErr.message);
    }
    console.log(`♻️  re-enqueued ${gaps} gap(s) — the worker will render them this cycle.`);
  } else {
    console.log('✅ 100% coverage for due users — nothing to re-enqueue.');
  }

  // Alert loud on a SYSTEMIC gap (outage), not on routine self-healed one-offs.
  if (isSystemicGap(gaps, due.length, ALERT_GAP_RATE)) {
    console.error(
      `🚨 NIGHTLY COVERAGE ALERT: ${(gapRate * 100).toFixed(1)}% of ${due.length} due users had no dream ` +
        `(> ${(ALERT_GAP_RATE * 100).toFixed(0)}% threshold). Re-enqueued, but investigate — likely a render/worker/provider issue.`
    );
    process.exit(1);
  }
  console.log('');
})();
