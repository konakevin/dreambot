#!/usr/bin/env node
/**
 * nightly-dreams.js — ENQUEUE one nightly dream job per eligible user.
 *
 * Scalable architecture (2026-05-26): this cron NO LONGER renders inline. It
 * selects eligible Pro/trial users and bulk-inserts one `dream_queue` job each
 * (source='nightly'). The `dream-queue-worker` then fans those out to the
 * nightly-dreams render Edge Function in parallel (each render its own isolate)
 * and finalizes them. Backfill, retry/backoff, dead-letter, and per-user-per-day
 * idempotency all live in the queue — a missed night just drains later, and a
 * burst of users scales by worker batch size × tick frequency.
 *
 * Pro-only: only Pro or in-14-day-trial users get a nightly dream (gating in
 * scripts/lib/nightlyEligibility.js). Bot accounts excluded.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/nightly-dreams.js [--dry-run] [--max-jobs N]
 */

const { createClient } = require('@supabase/supabase-js');
const { isProActive } = require('./lib/nightlyEligibility');

// ── Config ──────────────────────────────────────────────────────────────────

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
function getKey(name) {
  return process.env[name] || envFile[name];
}

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MAX_JOBS_ARG = args.find((_, i, a) => a[i - 1] === '--max-jobs');
// Cost guardrail — cap the number of nightly jobs enqueued in one run. Generous
// default (prelaunch); raise as the Pro base grows. Each job ≈ one render.
const MAX_JOBS = MAX_JOBS_ARG != null ? parseInt(MAX_JOBS_ARG, 10) : 5000;

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n🌙 Nightly Dream Enqueue');
  console.log(`   Max jobs: ${MAX_JOBS} | Dry run: ${DRY_RUN}\n`);

  const today = new Date().toISOString().slice(0, 10); // UTC day
  const now = Date.now();

  // Eligible: onboarded + ai_enabled, real users (no bots), Pro or in-trial.
  const { data: users, error } = await sb
    .from('user_recipes')
    .select(
      `user_id, dream_wish, wish_modifiers, wish_recipient_ids,
       users!inner(last_active_at, pro_subscription, pro_subscription_expires_at, pro_trial_started_at, is_bot)`
    )
    .eq('onboarding_completed', true)
    .eq('ai_enabled', true)
    .eq('users.is_bot', false);

  if (error) {
    console.error('DB error:', error.message);
    process.exit(1);
  }

  let pool = (users || []).filter((u) => isProActive(u.users, now));
  const proCount = pool.length;
  if (pool.length > MAX_JOBS) {
    console.warn(`⚠️  ${pool.length} eligible exceeds MAX_JOBS=${MAX_JOBS} — capping this run.`);
    pool = pool.slice(0, MAX_JOBS);
  }
  console.log(
    `Eligible Pro/trial users: ${proCount}${proCount !== pool.length ? ` (capped to ${pool.length})` : ''}`
  );

  if (pool.length === 0) {
    console.log('No eligible users — nothing to enqueue.');
    return;
  }

  // One job per user. dedup_key (per-user-per-day) is the idempotency unit:
  // its unique index makes a same-day re-run a no-op. We pre-filter against
  // jobs already enqueued today (the index also backstops a race). The wish is
  // snapshotted into the payload and cleared from user_recipes below, so a
  // render retry can't re-spend or double-clear it.
  const allRows = pool.map((u) => ({
    source: 'nightly',
    user_id: u.user_id,
    status: 'queued',
    payload: {
      dream_wish: u.dream_wish || null,
      wish_recipient_ids: Array.isArray(u.wish_recipient_ids) ? u.wish_recipient_ids : [],
    },
    dedup_key: `nightly:${u.user_id}:${today}`,
  }));

  if (DRY_RUN) {
    allRows.forEach((r) =>
      console.log(
        `  would enqueue ${r.user_id.slice(0, 8)}...${r.payload.dream_wish ? ' (wish)' : ''}`
      )
    );
    console.log(`\n(dry run — ${allRows.length} jobs not enqueued)`);
    return;
  }

  // Pre-filter against today's already-enqueued jobs (idempotent re-runs).
  const allKeys = allRows.map((r) => r.dedup_key);
  const { data: existing, error: exErr } = await sb
    .from('dream_queue')
    .select('dedup_key')
    .in('dedup_key', allKeys);
  if (exErr) {
    console.error('Dedup lookup failed:', exErr.message);
    process.exit(1);
  }
  const existingKeys = new Set((existing || []).map((e) => e.dedup_key));
  const newRows = allRows.filter((r) => !existingKeys.has(r.dedup_key));

  if (newRows.length === 0) {
    console.log('✨ All eligible users already have a nightly job today — nothing new to enqueue.');
    return;
  }

  const { data: inserted, error: insErr } = await sb
    .from('dream_queue')
    .insert(newRows)
    .select('id');
  if (insErr) {
    console.error('Enqueue failed:', insErr.message);
    process.exit(1);
  }
  const enqueued = (inserted || []).length;
  console.log(
    `✨ Enqueued ${enqueued} nightly jobs (${allRows.length - newRows.length} already queued today).`
  );

  // Clear wishes for users we just enqueued (snapshotted in their payload).
  const wishUserIds = newRows.filter((r) => r.payload.dream_wish).map((r) => r.user_id);
  if (wishUserIds.length > 0) {
    const { error: clearErr } = await sb
      .from('user_recipes')
      .update({ dream_wish: null, wish_recipient_ids: null, wish_modifiers: null })
      .in('user_id', wishUserIds);
    if (clearErr) console.warn(`⚠️  wish clear failed: ${clearErr.message}`);
  }
})();
