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
const {
  isProActive,
  isBasicActive,
  isDreamEligible,
  shouldSend3DayTrialReminder,
  shouldSendLastNightTrialReminder,
  shouldSendTrialEndedNotice,
  shouldSend3DayPaidProReminder,
  shouldSendLastNightPaidProReminder,
} = require('./lib/nightlyEligibility');
const { fetchEngineConfig } = require('./lib/engineConfig');

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
// --force overrides the engine_config.nightly_enabled kill-switch (manual/QA).
// A plain --max-jobs run no longer bypasses the pause (audit L10).
const FORCE = args.includes('--force');
const MAX_JOBS_ARG = args.find((_, i, a) => a[i - 1] === '--max-jobs');
// Cost guardrail — cap the number of nightly jobs enqueued in one run. An explicit
// --max-jobs wins; otherwise the default comes from engine_config.nightly_max_jobs
// (resolved in main), so an admin can tune the cap without a code change.
const MAX_JOBS_OVERRIDE = MAX_JOBS_ARG != null ? parseInt(MAX_JOBS_ARG, 10) : null;

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Fetch ALL rows of a query in 1000-row pages. Supabase/PostgREST SILENTLY caps
 * a single read at 1000 rows, so any unbounded full-set fetch must paginate or
 * it drops everything past 1000 with no error — for nightly that means users
 * 1001+ get NO dream (and miss reminders). `buildQuery` MUST return a FRESH
 * query builder each call (builders are single-use / not re-runnable).
 */
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

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n🌙 Nightly Dream Enqueue');
  const cfg = await fetchEngineConfig(sb);
  // Master kill-switch — pause nightly enqueues from the dashboard without
  // touching the cron. Only --force overrides it (audit L10): a plain --max-jobs
  // run no longer bypasses an admin pause.
  if (!cfg.nightlyEnabled && !FORCE) {
    console.log(
      '⏸  Nightly disabled via engine_config.nightly_enabled — skipping enqueue (use --force to override).\n'
    );
    return;
  }
  // nightly_max_jobs is a SAFETY CEILING (an alert threshold), NOT a per-night
  // cap — every eligible user is enqueued and the queue/worker drain the backlog.
  // An explicit --max-jobs is a HARD limit, used for manual/QA runs only.
  const HARD_LIMIT = MAX_JOBS_OVERRIDE; // null on the normal cron path
  console.log(
    `   Ceiling: ${cfg.nightlyMaxJobs}${HARD_LIMIT != null ? ` | Hard limit: ${HARD_LIMIT}` : ''} | Dry run: ${DRY_RUN}\n`
  );

  const today = new Date().toISOString().slice(0, 10); // UTC day
  const now = Date.now();

  // Eligible: real users (no bots — never tunable), Pro or in-trial, gated by the
  // config predicates (onboarding / ai_enabled, both default on).
  // PAGINATED — without this, PostgREST's 1000-row cap silently drops every
  // eligible user past 1000 (they'd get NO nightly dream, no error). buildEligible
  // returns a fresh builder per page (builders are single-use).
  const buildEligible = () => {
    let q = sb
      .from('user_recipes')
      .select(
        `user_id,
       users!inner(last_active_at, pro_subscription, pro_subscription_expires_at, pro_trial_started_at, basic_subscription, basic_subscription_expires_at, is_bot, is_admin)`
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

  // Dream-eligible = Pro (paid OR trial) OR Basic (paid). Nightly dreams are the
  // shared core perk of both paid tiers.
  let pool = (users || []).filter((u) => isDreamEligible(u.users, now, cfg.proTrialDays));
  const eligibleCount = pool.length;
  const proCount = pool.filter((u) => isProActive(u.users, now, cfg.proTrialDays)).length;
  const basicCount = pool.filter(
    (u) => isBasicActive(u.users, now) && !isProActive(u.users, now, cfg.proTrialDays)
  ).length;
  // ROBUSTNESS (audit M4): never silently drop eligible subscribers. On the
  // normal cron path enqueue ALL of them — the queue + worker drain the backlog
  // (FIFO, idempotent, retry/backoff). If the eligible population outgrows the
  // configured ceiling, ALERT LOUDLY (so we scale worker throughput) instead of
  // denying a paid perk to the tail.
  if (HARD_LIMIT != null && pool.length > HARD_LIMIT) {
    // Manual/QA run explicitly limited via --max-jobs.
    console.warn(
      `⚠️  --max-jobs=${HARD_LIMIT}: limiting this run to ${HARD_LIMIT} of ${pool.length} eligible.`
    );
    pool = pool.slice(0, HARD_LIMIT);
  } else if (pool.length > cfg.nightlyMaxJobs) {
    console.error(
      `🚨 NIGHTLY CEILING EXCEEDED: ${pool.length} eligible users > nightly_max_jobs=${cfg.nightlyMaxJobs}. ` +
        `Enqueueing ALL of them (the queue drains the backlog over the day), but the eligible population has ` +
        `outgrown the ceiling — raise worker throughput (dream-queue-worker MAX_JOBS_PER_TICK) and/or ` +
        `nightly_max_jobs, and watch dream-queue-monitor for backlog.`
    );
  }
  console.log(
    `Eligible users: ${eligibleCount} (${proCount} pro/trial + ${basicCount} basic)${eligibleCount !== pool.length ? ` (limited to ${pool.length})` : ' — enqueueing all'}`
  );

  if (pool.length === 0) {
    console.log('No eligible users — nothing to enqueue.');
    return;
  }

  // One job per user. dedup_key (per-user-per-day) is the idempotency unit:
  // its unique index makes a same-day re-run a no-op. We pre-filter against
  // jobs already enqueued today (the index also backstops a race).
  const allRows = pool.map((u) => ({
    source: 'nightly',
    user_id: u.user_id,
    status: 'queued',
    payload: {},
    dedup_key: `nightly:${u.user_id}:${today}`,
  }));

  if (DRY_RUN) {
    allRows.forEach((r) => console.log(`  would enqueue ${r.user_id.slice(0, 8)}...`));
    console.log(`\n(dry run — ${allRows.length} jobs not enqueued)`);
    // Fall through to the reminder passes — they have their own DRY_RUN
    // guard and we want dry mode to print would-send reminders too.
  } else {
    // Pre-filter against today's already-enqueued jobs (idempotent re-runs).
    // Chunk the .in() — 1000+ keys in one PostgREST .in() blows the URL length
    // (and hits the read row-cap). 300/chunk stays well under both. (The unique
    // index on dedup_key + the upsert below also backstop dedup; this pre-filter
    // is the optimization that skips already-enqueued users.)
    const allKeys = allRows.map((r) => r.dedup_key);
    const existingKeys = new Set();
    for (let i = 0; i < allKeys.length; i += 300) {
      const { data: existing, error: exErr } = await sb
        .from('dream_queue')
        .select('dedup_key')
        .in('dedup_key', allKeys.slice(i, i + 300));
      if (exErr) {
        console.error('Dedup lookup failed:', exErr.message);
        process.exit(1);
      }
      for (const e of existing || []) existingKeys.add(e.dedup_key);
    }
    const newRows = allRows.filter((r) => !existingKeys.has(r.dedup_key));

    if (newRows.length === 0) {
      console.log(
        '✨ All eligible users already have a nightly job today — nothing new to enqueue.'
      );
    } else {
      // Resilient enqueue. PREFER the upsert (audit L8): a dedup_key collision (a
      // concurrent run / manual run racing the cron) is silently skipped instead
      // of failing the ENTIRE batch and enqueuing nobody after it. This needs
      // dedup_key to be a NON-PARTIAL unique index so PostgREST's onConflict can
      // infer it (migration 259). If that index isn't present yet (42P10 — the bug
      // that crashed the cron 2026-06-12, when only the PARTIAL idx_dream_queue_dedup
      // from migration 192 existed), FALL BACK to a plain insert: the pre-filter
      // above already gives per-user-per-day idempotency, so the batch is correct
      // either way and the cron can never crash on this regardless of migration state.
      let inserted, insErr;
      ({ data: inserted, error: insErr } = await sb
        .from('dream_queue')
        .upsert(newRows, { onConflict: 'dedup_key', ignoreDuplicates: true })
        .select('id'));
      if (insErr && /on conflict|no unique or exclusion|42P10/i.test(insErr.message)) {
        console.warn(
          `⚠️  upsert onConflict not supported (apply migration 259); falling back to plain insert: ${insErr.message}`
        );
        ({ data: inserted, error: insErr } = await sb
          .from('dream_queue')
          .insert(newRows)
          .select('id'));
      }
      if (insErr) {
        console.error('Enqueue failed:', insErr.message);
        process.exit(1);
      }
      const enqueued = (inserted || []).length;
      console.log(
        `✨ Enqueued ${enqueued} nightly jobs (${allRows.length - newRows.length} already queued today).`
      );
    }
  }

  // ── Trial reminders ────────────────────────────────────────────────────
  //
  // Insert two kinds of in-app notifications (which auto-push via the
  // notifications INSERT trigger from migration 196):
  //   • '3day'     — fires when trial expires in (48, 84]h
  //   • 'last_night' — fires when trial expires in (0, 36]h AND we are
  //                    enqueuing the user's dream this run (so the
  //                    "tonight is your last Pro nightly dream" claim is
  //                    accurate to system behavior — no over-promise).
  //
  // Idempotency: notifications row already exists for this user × subtype
  // × since the trial started → skip. Lets us re-fire safely if the cron
  // runs twice in a day and prevents stale-row dups across trial cycles
  // (a user who re-trials after a paid lapse gets fresh reminders).
  //
  // Paid Pro users are excluded — they aren't on the trial-expiry path.
  await sendTrialReminders(sb, pool);

  // Same windows + accuracy guarantee, against paid Pro users who have
  // CANCELLED auto-renewal (pro_subscription_will_renew=false from the
  // revenuecat-webhook on a CANCELLATION event). Auto-renewing users
  // skip — they aren't actually going to lose access at expires_at.
  await sendPaidProReminders(sb, pool);
})();

async function sendTrialReminders(sb, enqueuedPool) {
  const now = Date.now();
  // fetchEngineConfig is process-cached, so this is the same row main() read.
  const cfg = await fetchEngineConfig(sb);

  // Pool of users to check: every onboarded non-bot trial user (we want to
  // ping even users who aren't currently eligible for nightlies — that's
  // the whole point of the reminder). Paid Pro excluded.
  const { data: trialUsers, error: tErr } = await fetchAllPages(() =>
    sb
      .from('user_recipes')
      .select(
        `user_id,
       users!inner(pro_subscription, pro_subscription_expires_at, pro_trial_started_at, is_bot)`
      )
      .eq('onboarding_completed', true)
      .eq('users.is_bot', false)
      .eq('users.pro_subscription', false)
      .not('users.pro_trial_started_at', 'is', null)
  );
  if (tErr) {
    console.warn(`⚠️  trial-reminder user lookup failed: ${tErr.message}`);
    return;
  }

  // Same-cron-run users we ARE enqueuing a dream for — needed to gate the
  // "last night" reminder so we never promise a dream we don't deliver.
  const enqueuedIds = new Set((enqueuedPool || []).map((u) => u.user_id));

  // Window-match each trial user against the three reminder gates.
  const need3Day = [];
  const needLast = [];
  const needEnded = [];
  for (const row of trialUsers || []) {
    const u = row.users;
    if (shouldSend3DayTrialReminder(u, now, cfg.proTrialDays)) need3Day.push(row.user_id);
    if (
      shouldSendLastNightTrialReminder(u, now, cfg.proTrialDays) &&
      enqueuedIds.has(row.user_id)
    ) {
      needLast.push(row.user_id);
    }
    // Post-expiry notice (2026-07-05): trial expired within the last 36h.
    // No enqueue gate — the whole point is that dreams have STOPPED.
    if (shouldSendTrialEndedNotice(u, now, cfg.proTrialDays)) needEnded.push(row.user_id);
  }
  if (need3Day.length === 0 && needLast.length === 0 && needEnded.length === 0) {
    console.log('Trial reminders: nobody in any window.');
    return;
  }

  // Idempotency: pull every existing trial_reminder notification for our
  // candidate set, since the earliest trial-start in scope. Skip insertion
  // when the row already exists for (recipient × subtype).
  const candidateIds = [...new Set([...need3Day, ...needLast, ...needEnded])];
  const { data: alreadySent, error: dupErr } = await sb
    .from('notifications')
    .select('recipient_id, subtype')
    .in('recipient_id', candidateIds)
    .eq('type', 'trial_reminder');
  if (dupErr) {
    console.warn(`⚠️  trial-reminder dedup lookup failed: ${dupErr.message}`);
    return;
  }
  // Note: this dedup is per-trial-cycle in practice because pro_trial_
  // started_at moves forward when a user re-trials, and these reminder
  // semantics are time-windowed off that field. A user who retrialed after
  // a paid lapse with a NEW trial start would already be past the 3-day
  // window for any old reminder (the trial-start moved 14+ days forward).
  // If retrial recycling becomes a thing, key on (recipient, subtype,
  // pro_trial_started_at) instead.
  const sentSet = new Set((alreadySent || []).map((r) => `${r.recipient_id}:${r.subtype}`));

  const rows = [];
  for (const id of need3Day) {
    if (!sentSet.has(`${id}:3day`)) {
      rows.push({
        recipient_id: id,
        actor_id: null,
        type: 'trial_reminder',
        subtype: '3day',
        // Subject-only inbox row — kept ≤39 chars for the single-line "no
        // ellipsis" inbox layout (migration 223 / 2026-06-04). Push body
        // uses the same string; iOS truncates long titles anyway. Warmed
        // 2026-07-05 (was "Trial ends in 3 days — tap to subscribe") —
        // tap already routes to /subscribe, the string can afford charm.
        body: '3 dream nights left in your trial ✨',
        is_read: false,
      });
    }
  }
  for (const id of needLast) {
    if (!sentSet.has(`${id}:last_night`)) {
      rows.push({
        recipient_id: id,
        actor_id: null,
        type: 'trial_reminder',
        subtype: 'last_night',
        body: 'Tonight’s your last trial dream ✨',
        is_read: false,
      });
    }
  }
  for (const id of needEnded) {
    if (!sentSet.has(`${id}:ended`)) {
      rows.push({
        recipient_id: id,
        actor_id: null,
        type: 'trial_reminder',
        subtype: 'ended',
        // The post-expiry notice — routes to /subscribe like the others
        // (lib/notificationRouting.ts keys on type, so no client change).
        body: 'Trial ended — keep your dreams going',
        is_read: false,
      });
    }
  }
  if (rows.length === 0) {
    console.log(
      `Trial reminders: ${need3Day.length} matched 3day + ${needLast.length} matched last_night ` +
        `+ ${needEnded.length} matched ended, all already sent.`
    );
    return;
  }

  if (DRY_RUN) {
    rows.forEach((r) =>
      console.log(`  would notify ${r.recipient_id.slice(0, 8)}... ${r.subtype}`)
    );
    console.log(`\n(dry run — ${rows.length} trial reminders not inserted)`);
    return;
  }

  const { error: insErr } = await sb.from('notifications').insert(rows);
  if (insErr) {
    console.warn(`⚠️  trial-reminder insert failed: ${insErr.message}`);
    return;
  }
  console.log(
    `📬 Trial reminders sent: ${rows.filter((r) => r.subtype === '3day').length}× 3day, ` +
      `${rows.filter((r) => r.subtype === 'last_night').length}× last_night, ` +
      `${rows.filter((r) => r.subtype === 'ended').length}× ended`
  );
}

async function sendPaidProReminders(sb, enqueuedPool) {
  const now = Date.now();

  // Candidates: onboarded paid Pro users who have cancelled auto-renewal
  // (will_renew=false → they ARE going to lose access at expires_at). Bots
  // and trial users excluded.
  const { data: paidUsers, error: pErr } = await fetchAllPages(() =>
    sb
      .from('user_recipes')
      .select(
        `user_id,
       users!inner(pro_subscription, pro_subscription_expires_at, pro_subscription_will_renew, pro_trial_started_at, is_bot)`
      )
      .eq('onboarding_completed', true)
      .eq('users.is_bot', false)
      .eq('users.pro_subscription', true)
      .eq('users.pro_subscription_will_renew', false)
      .not('users.pro_subscription_expires_at', 'is', null)
  );
  if (pErr) {
    console.warn(`⚠️  paid-pro-reminder user lookup failed: ${pErr.message}`);
    return;
  }

  const enqueuedIds = new Set((enqueuedPool || []).map((u) => u.user_id));
  const need3Day = [];
  const needLast = [];
  for (const row of paidUsers || []) {
    const u = row.users;
    if (shouldSend3DayPaidProReminder(u, now)) need3Day.push(row.user_id);
    if (shouldSendLastNightPaidProReminder(u, now) && enqueuedIds.has(row.user_id)) {
      needLast.push(row.user_id);
    }
  }
  if (need3Day.length === 0 && needLast.length === 0) {
    console.log('Paid Pro reminders: nobody in either window.');
    return;
  }

  // Idempotency: dedup on (recipient × subtype). Subtypes are namespaced
  // ('paid_3day', 'paid_last_night') so they don't collide with trial
  // reminders if the same user trialed-then-paid-then-cancelled.
  const candidateIds = [...new Set([...need3Day, ...needLast])];
  const { data: alreadySent, error: dupErr } = await sb
    .from('notifications')
    .select('recipient_id, subtype')
    .in('recipient_id', candidateIds)
    .eq('type', 'pro_reminder');
  if (dupErr) {
    console.warn(`⚠️  paid-pro-reminder dedup lookup failed: ${dupErr.message}`);
    return;
  }
  const sentSet = new Set((alreadySent || []).map((r) => `${r.recipient_id}:${r.subtype}`));

  const rows = [];
  for (const id of need3Day) {
    if (!sentSet.has(`${id}:paid_3day`)) {
      rows.push({
        recipient_id: id,
        actor_id: null,
        type: 'pro_reminder',
        subtype: 'paid_3day',
        body: 'Pro ends in 3 days — tap to renew',
        is_read: false,
      });
    }
  }
  for (const id of needLast) {
    if (!sentSet.has(`${id}:paid_last_night`)) {
      rows.push({
        recipient_id: id,
        actor_id: null,
        type: 'pro_reminder',
        subtype: 'paid_last_night',
        body: 'Pro ends tomorrow — tap to renew',
        is_read: false,
      });
    }
  }
  if (rows.length === 0) {
    console.log(
      `Paid Pro reminders: ${need3Day.length} matched 3day + ${needLast.length} matched last_night, all already sent.`
    );
    return;
  }

  if (DRY_RUN) {
    rows.forEach((r) =>
      console.log(`  would notify ${r.recipient_id.slice(0, 8)}... ${r.subtype}`)
    );
    console.log(`\n(dry run — ${rows.length} paid Pro reminders not inserted)`);
    return;
  }

  const { error: insErr } = await sb.from('notifications').insert(rows);
  if (insErr) {
    console.warn(`⚠️  paid-pro-reminder insert failed: ${insErr.message}`);
    return;
  }
  console.log(
    `📬 Paid Pro reminders sent: ${rows.filter((r) => r.subtype === 'paid_3day').length}× 3day, ` +
      `${rows.filter((r) => r.subtype === 'paid_last_night').length}× last_night`
  );
}
