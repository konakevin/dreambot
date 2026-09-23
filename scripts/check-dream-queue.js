#!/usr/bin/env node
/**
 * check-dream-queue.js — loud health monitor for the async dream queue.
 *
 * Replaces the "0 nightly dreams = red CI" signal the old inline cron gave us
 * (now that the GH Actions cron only ENQUEUES and the dream-queue-worker drains
 * via pg_cron). Exits 1 — failing the workflow loudly — when the queue looks
 * unhealthy:
 *   - jobs stuck 'queued' past STUCK_MIN (worker / pg_cron not draining), or
 *   - too many recent dead_letter jobs (renders failing systemically), or
 *   - nightly couples shipping as solos: any lost to swap capacity while the gate + capacity retry are on, or a
 *     high all-cause couple→solo rate (scripts/lib/nightlySwapHealth.js).
 *
 * Run on a schedule by .github/workflows/dream-queue-monitor.yml.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-dream-queue.js
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
const STUCK_MIN = parseInt(getKey('QUEUE_STUCK_MIN') || '60', 10);
const DEAD_LETTER_ALARM = parseInt(getKey('QUEUE_DEAD_LETTER_ALARM') || '10', 10);
// First-dream cast degradation alarm — the first dream is the one-shot impression,
// so a couple dropping to solo (dual failed) or a face dropping to a scene (single
// failed) is a quality miss. Some baseline dual misses are expected (~14%), so we
// alarm past a threshold rather than on every one; tune down to 1 to page on each.
const FIRST_DREAM_DEGRADE_ALARM = parseInt(getKey('FIRST_DREAM_DEGRADE_ALARM') || '3', 10);
// The owner/dev account — its dreams are dev/test batches (model-matrix QA,
// medium tests), NOT real-user traffic. Excluded from the "renders failing
// systemically" dead-letter signal so a dev test session can't page us; the
// stuck-queue / worker-liveness alarms are unaffected. Override via env.
const OWNER_USER_ID = getKey('MONITOR_EXCLUDE_USER_ID') || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

(async () => {
  const statuses = ['queued', 'in_progress', 'completed', 'failed', 'dead_letter'];
  const counts = {};
  for (const s of statuses) {
    const { count } = await sb
      .from('dream_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', s);
    counts[s] = count || 0;
  }
  console.log('dream_queue status counts:', JSON.stringify(counts));

  let alarm = false;

  // Stuck 'queued' jobs: created_at in the PAST beyond STUCK_MIN. (Retries push
  // created_at into the future for backoff, so those are correctly NOT counted.)
  const stuckCutoff = new Date(Date.now() - STUCK_MIN * 60_000).toISOString();
  const { count: stuck } = await sb
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'queued')
    .lt('created_at', stuckCutoff);
  if (stuck && stuck > 0) {
    console.error(
      `::error::${stuck} dream_queue jobs stuck 'queued' > ${STUCK_MIN}min — worker/pg_cron may not be draining.`
    );
    alarm = true;
  }

  // Stuck 'in_progress' beyond the stale threshold (worker should self-recover
  // at 5min; if many linger, recovery isn't running).
  const { count: stuckInProgress } = await sb
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')
    .lt('started_at', new Date(Date.now() - STUCK_MIN * 60_000).toISOString());
  if (stuckInProgress && stuckInProgress > 0) {
    console.error(
      `::error::${stuckInProgress} jobs stuck 'in_progress' > ${STUCK_MIN}min — stale recovery not running.`
    );
    alarm = true;
  }

  // Recent dead-letters on REAL-USER dreams (systemic render failures). Excludes
  // the owner/dev account so dev test batches don't trip the alarm.
  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { count: dead } = await sb
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'dead_letter')
    .neq('user_id', OWNER_USER_ID)
    .gte('completed_at', dayAgo);
  console.log(`dead_letter (last 24h, excl. dev): ${dead || 0}`);
  if (dead && dead >= DEAD_LETTER_ALARM) {
    console.error(
      `::error::${dead} dead_letter jobs in the last 24h (>= ${DEAD_LETTER_ALARM}) — renders failing systemically.`
    );
    alarm = true;
  }

  // First-dream cast degradation — the first dream is the one-shot impression, so a
  // user whose couple render dropped to solo (dual failed), or whose face dropped to
  // a faceless scene (single failed), is a quality miss we want to catch. A
  // first_dream job stores its tier cascade (payload.tiers) + the tier it LANDED on
  // (payload.tier_index); it degraded when the landed tier's cast role differs from
  // the BEST (index-0) tier's role. self→self_retry is the SAME role (a successful
  // face landing on the retry), so it does NOT count. Excludes the owner/dev account.
  // Every case is logged (cause lives in ai_generation_log.fallback_reasons); the
  // alarm only trips past FIRST_DREAM_DEGRADE_ALARM so a baseline dual miss can't page.
  const { data: fdJobs } = await sb
    .from('dream_queue')
    .select('id, user_id, payload')
    .eq('source', 'first_dream')
    .eq('status', 'completed')
    .neq('user_id', OWNER_USER_ID)
    .gte('completed_at', dayAgo);
  const fdDegraded = [];
  for (const j of fdJobs || []) {
    const tiers = Array.isArray(j.payload && j.payload.tiers) ? j.payload.tiers : [];
    const idx = (j.payload && j.payload.tier_index) || 0;
    if (tiers.length === 0 || !tiers[idx] || !tiers[0]) continue;
    const bestRole = (tiers[0].body && tiers[0].body.force_cast_role) ?? null;
    const landedRole = (tiers[idx].body && tiers[idx].body.force_cast_role) ?? null;
    if (landedRole !== bestRole) {
      fdDegraded.push({ id: j.id, best: bestRole, landed: landedRole, tier: tiers[idx].name });
    }
  }
  console.log(`first_dream cast degradations (last 24h, excl. dev): ${fdDegraded.length}`);
  for (const d of fdDegraded.slice(0, 10)) {
    console.log(`  job ${d.id}: best=${d.best} → landed=${d.landed || 'scene'} (tier '${d.tier}')`);
  }
  if (fdDegraded.length >= FIRST_DREAM_DEGRADE_ALARM) {
    console.error(
      `::error::${fdDegraded.length} first-dream cast degradations in the last 24h (>= ${FIRST_DREAM_DEGRADE_ALARM}) — couples dropping to solo / faces dropping to scene on the one-shot first impression. See ai_generation_log.fallback_reasons for the cause.`
    );
    alarm = true;
  }

  // Worker liveness — catch a full stall FASTER than the 60-min stuck check: if
  // DUE jobs are queued but the worker hasn't claimed anything recently, the
  // drain has stopped (e.g. waitUntil dropped AND the GH sync backstop failing).
  const WORKER_LIVENESS_MIN = parseInt(getKey('QUEUE_WORKER_LIVENESS_MIN') || '10', 10);
  const nowIso = new Date().toISOString();
  const { count: dueQueued } = await sb
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'queued')
    .lte('created_at', nowIso); // exclude future-dated backoff retries
  if (dueQueued && dueQueued > 0) {
    const { data: lastClaim } = await sb
      .from('dream_queue')
      .select('started_at')
      .not('started_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(1);
    const lastMs = lastClaim?.[0]?.started_at ? new Date(lastClaim[0].started_at).getTime() : 0;
    const ageMin = lastMs ? Math.round((Date.now() - lastMs) / 60_000) : Infinity;
    console.log(
      `due-queued=${dueQueued}, last worker claim ${lastMs ? ageMin + 'min ago' : 'never'}`
    );
    if (Date.now() - lastMs > WORKER_LIVENESS_MIN * 60_000) {
      console.error(
        `::error::${dueQueued} jobs DUE+queued but no worker claim in >${WORKER_LIVENESS_MIN}min — queue STALLED (waitUntil down + GH sync backstop failing?).`
      );
      alarm = true;
    }
  }

  // Heavy vs light DUE-queued breakdown — Fly-saturation visibility. Heavy is
  // bounded by the Fly dual-swap service; a SUSTAINED heavy backlog (vs a normal
  // nightly burst that drains) means scale Fly + raise the heavy cap. Logged (not
  // alarmed) — a fresh nightly burst legitimately spikes heavy-queued; the
  // stuck-60min + dead_letter alarms catch a genuine heavy bottleneck.
  for (const w of ['light', 'heavy']) {
    const { count: qd } = await sb
      .from('dream_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queued')
      .eq('weight', w)
      .lte('created_at', nowIso);
    console.log(`  queued ${w} (due): ${qd || 0}`);
  }

  // NIGHTLY COUPLE SWAPS (NIGHTLY_ROBUSTNESS_PLAN.md items 4 + 5). A couple that ships as a solo used to count as a
  // "completed" job, so nothing ever alarmed on it. Now: any couple lost to swap CAPACITY while the gate + capacity
  // retry are on fails the run (armed by that config), a high all-cause couple→solo rate fails it, and a busy Fly /
  // an over-sized heavy cap warns. Real cron jobs only (QA batches carry payload.qa_silent), owner INCLUDED: his
  // own nightly is a real one. Thresholds + the on-spec-never-alarms guarantee: scripts/lib/nightlySwapHealth.js.
  const {
    isRealNightlyJob,
    summarizeNightlyJobs,
    nightlySwapAlarms,
  } = require('./lib/nightlySwapHealth');
  const { data: swapCfg, error: swapCfgErr } = await sb
    .from('engine_config')
    .select(
      'swap_gate_enabled, nightly_swap_capacity_retries, fly_dual_swap_slots, swap_gate_max_wait_ms, dream_queue_max_concurrent_heavy'
    )
    .eq('id', 1)
    .single();
  if (swapCfgErr) throw new Error(`engine_config read failed: ${swapCfgErr.message}`);
  const nightlyJobs = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('dream_queue')
      .select('id, source, dedup_key, payload')
      .eq('source', 'nightly')
      .gte('created_at', dayAgo)
      .order('id')
      .range(from, from + 999);
    if (error) throw new Error(`nightly job read failed: ${error.message}`);
    nightlyJobs.push(...data);
    if (data.length < 1000) break;
  }
  const realIds = nightlyJobs.filter(isRealNightlyJob).map((j) => j.id);
  const nightlyLogs = [];
  for (let i = 0; i < realIds.length; i += 100) {
    const { data, error } = await sb
      .from('ai_generation_log')
      .select('job_id, status, fallback_reasons')
      .in('job_id', realIds.slice(i, i + 100));
    if (error) throw new Error(`ai_generation_log read failed: ${error.message}`);
    nightlyLogs.push(...data);
  }
  const swapReport = nightlySwapAlarms(
    summarizeNightlyJobs(nightlyLogs),
    {
      swapGateEnabled: swapCfg.swap_gate_enabled,
      nightlySwapCapacityRetries: swapCfg.nightly_swap_capacity_retries,
      flyDualSwapSlots: swapCfg.fly_dual_swap_slots,
      swapGateMaxWaitMs: swapCfg.swap_gate_max_wait_ms,
      heavyCap: swapCfg.dream_queue_max_concurrent_heavy,
    },
    {
      soloMinCount: parseInt(getKey('NIGHTLY_SOLO_ALARM_MIN') || '3', 10),
      soloMaxRate: parseFloat(getKey('NIGHTLY_SOLO_ALARM_RATE') || '0.25'),
    }
  );
  for (const n of swapReport.notes) console.log(n);
  for (const w of swapReport.warnings) console.log(`::warning::${w}`);
  for (const e of swapReport.errors) {
    console.error(`::error::${e}`);
    alarm = true;
  }

  if (alarm) {
    process.exit(1);
  }
  console.log('✅ dream_queue healthy.');
})().catch((e) => {
  console.error('::error::dream-queue monitor crashed:', e.message);
  process.exit(1);
});
