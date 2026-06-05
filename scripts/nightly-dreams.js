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
  shouldSend3DayTrialReminder,
  shouldSendLastNightTrialReminder,
  shouldSend3DayPaidProReminder,
  shouldSendLastNightPaidProReminder,
} = require('./lib/nightlyEligibility');

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
    // Fall through to the reminder passes — they have their own DRY_RUN
    // guard and we want dry mode to print would-send reminders too.
  } else {
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
      console.log(
        '✨ All eligible users already have a nightly job today — nothing new to enqueue.'
      );
    } else {
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

  // Pool of users to check: every onboarded non-bot trial user (we want to
  // ping even users who aren't currently eligible for nightlies — that's
  // the whole point of the reminder). Paid Pro excluded.
  const { data: trialUsers, error: tErr } = await sb
    .from('user_recipes')
    .select(
      `user_id,
       users!inner(pro_subscription, pro_subscription_expires_at, pro_trial_started_at, is_bot)`
    )
    .eq('onboarding_completed', true)
    .eq('users.is_bot', false)
    .eq('users.pro_subscription', false)
    .not('users.pro_trial_started_at', 'is', null);
  if (tErr) {
    console.warn(`⚠️  trial-reminder user lookup failed: ${tErr.message}`);
    return;
  }

  // Same-cron-run users we ARE enqueuing a dream for — needed to gate the
  // "last night" reminder so we never promise a dream we don't deliver.
  const enqueuedIds = new Set((enqueuedPool || []).map((u) => u.user_id));

  // Window-match each trial user against the two reminder gates.
  const need3Day = [];
  const needLast = [];
  for (const row of trialUsers || []) {
    const u = row.users;
    if (shouldSend3DayTrialReminder(u, now)) need3Day.push(row.user_id);
    if (shouldSendLastNightTrialReminder(u, now) && enqueuedIds.has(row.user_id)) {
      needLast.push(row.user_id);
    }
  }
  if (need3Day.length === 0 && needLast.length === 0) {
    console.log('Trial reminders: nobody in either window.');
    return;
  }

  // Idempotency: pull every existing trial_reminder notification for our
  // candidate set, since the earliest trial-start in scope. Skip insertion
  // when the row already exists for (recipient × subtype).
  const candidateIds = [...new Set([...need3Day, ...needLast])];
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
        // Subject-only inbox row — kept short for the single-line "no
        // ellipsis" inbox layout (migration 223 / 2026-06-04). Push body
        // uses the same string; iOS truncates long titles anyway.
        body: 'Trial ends in 3 days. Tap to subscribe.',
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
        body: 'Trial ends tomorrow. Tap to subscribe.',
        is_read: false,
      });
    }
  }
  if (rows.length === 0) {
    console.log(
      `Trial reminders: ${need3Day.length} matched 3day + ${needLast.length} matched last_night, all already sent.`
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
      `${rows.filter((r) => r.subtype === 'last_night').length}× last_night`
  );
}

async function sendPaidProReminders(sb, enqueuedPool) {
  const now = Date.now();

  // Candidates: onboarded paid Pro users who have cancelled auto-renewal
  // (will_renew=false → they ARE going to lose access at expires_at). Bots
  // and trial users excluded.
  const { data: paidUsers, error: pErr } = await sb
    .from('user_recipes')
    .select(
      `user_id,
       users!inner(pro_subscription, pro_subscription_expires_at, pro_subscription_will_renew, pro_trial_started_at, is_bot)`
    )
    .eq('onboarding_completed', true)
    .eq('users.is_bot', false)
    .eq('users.pro_subscription', true)
    .eq('users.pro_subscription_will_renew', false)
    .not('users.pro_subscription_expires_at', 'is', null);
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
        body: 'Pro ends in 3 days. Tap to renew.',
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
        body: 'Pro ends tomorrow. Tap to renew.',
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
