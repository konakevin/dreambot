/**
 * Nightly-dream eligibility — pure, testable logic extracted from
 * scripts/nightly-dreams.js (the GitHub Actions cron entry). Mirrors
 * lib/proStatus.ts (client) and the is_pro_active() Postgres function.
 *
 * Nightly dreams are a PRO feature: only Pro users (active paid OR within the
 * 14-day trial) get an auto-dream each night. When a subscription expires or
 * the trial lapses, the user falls back to FREE and stops receiving them.
 *
 * `now` (ms) is injectable for deterministic tests.
 */

// Default trial length. The AUTHORITATIVE window is engine_config.pro_trial_days;
// the cron reads it and passes `trialDays` to these fns so the enqueue gate matches
// the is_pro_active() SQL. Defaults to 14 for callers/tests that don't pass it.
const TRIAL_DURATION_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Active PAID subscription right now? (false for trial-only users.) */
function isPaidProActive(u, now = Date.now()) {
  if (!u || u.pro_subscription !== true) return false;
  if (!u.pro_subscription_expires_at) return true; // no expiry = active
  return new Date(u.pro_subscription_expires_at).getTime() > now;
}

/** Within an active trial right now? */
function isTrialActive(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  if (!u || !u.pro_trial_started_at) return false;
  return new Date(u.pro_trial_started_at).getTime() + trialDays * DAY_MS > now;
}

/** Effective Pro entitlement: active paid OR active trial. */
function isProActive(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  return isPaidProActive(u, now) || isTrialActive(u, now, trialDays);
}

/** Active PAID Basic subscription right now? Basic has NO trial of its own (the
 *  free trial is the Pro-trial window) — paid + unexpired only. */
function isBasicActive(u, now = Date.now()) {
  if (!u || u.basic_subscription !== true) return false;
  if (!u.basic_subscription_expires_at) return true; // no expiry = active
  return new Date(u.basic_subscription_expires_at).getTime() > now;
}

/** Eligible for a NIGHTLY DREAM: Pro (paid OR trial) OR Basic (paid). Mirrors
 *  the is_dream_eligible() Postgres fn + lib/proStatus.ts isDreamEligible. This
 *  is the enqueue gate. */
function isDreamEligible(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  // Admins (incl. the super-admin, who is also is_admin) ALWAYS get nightly
  // dreams, regardless of subscription state — they test in RevenueCat sandbox
  // where the webhook keeps resetting paid entitlement. Mirrors the is_admin
  // bypass in is_dream_eligible() (migration 262) + proStatus.isDreamEligible.
  if (u && u.is_admin === true) return true;
  return isProActive(u, now, trialDays) || isBasicActive(u, now);
}

/**
 * From today's ai_generation_log rows, the set of user_ids that already got a
 * COMPLETED nightly dream today (rolled_axes.engine starts with 'nightly-').
 * Pass rows already filtered to status='completed' — failed attempts
 * (engine 'nightly-failed', status 'failed') must NOT appear here so the user
 * stays retryable on a re-run. Crucially this does NOT count manual Create-path
 * dreams (their engine is not 'nightly-*'), which is the bug this replaced.
 */
function nightlyDreamedUserIds(completedLogRows) {
  const ids = new Set();
  for (const r of completedLogRows || []) {
    const engine = r.rolled_axes && r.rolled_axes.engine;
    if (typeof engine === 'string' && engine.startsWith('nightly-')) ids.add(r.user_id);
  }
  return ids;
}

/**
 * Hours remaining until the trial expires. Negative when expired.
 * Returns null when the user never started a trial.
 */
function hoursUntilTrialEnds(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  if (!u || !u.pro_trial_started_at) return null;
  const endsMs = new Date(u.pro_trial_started_at).getTime() + trialDays * DAY_MS;
  return (endsMs - now) / (60 * 60 * 1000);
}

/**
 * Hours remaining until the PAID Pro subscription's current period ends.
 * Negative when expired. Null when the user has no paid expiry recorded
 * (a paid-PRO row without expiry would mean indefinite access; we skip
 * the reminder for those since there's nothing to remind about).
 */
function hoursUntilProSubscriptionEnds(u, now = Date.now()) {
  if (!u || u.pro_subscription !== true) return null;
  if (!u.pro_subscription_expires_at) return null;
  const endsMs = new Date(u.pro_subscription_expires_at).getTime();
  return (endsMs - now) / (60 * 60 * 1000);
}

/**
 * 3-day trial reminder window. Returns true when trial expires in (48, 84]
 * hours — i.e., between 2.0 and 3.5 days from now. The window is wider than
 * 24h on each side to absorb GitHub Actions scheduled-cron drift (we have
 * seen 4+h late fires); idempotency via the notifications-table dedup keeps
 * a same-trial-cycle re-fire from causing a duplicate. Paid Pro users skip
 * (handled at the caller).
 */
function shouldSend3DayTrialReminder(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  const h = hoursUntilTrialEnds(u, now, trialDays);
  if (h === null) return false;
  return h > 48 && h <= 84;
}

/**
 * 3-day paid Pro expiry reminder. Same window logic as the trial version
 * but reads `pro_subscription_expires_at`. The caller MUST additionally
 * check `pro_subscription_will_renew === false` — auto-renewing users
 * aren't actually going to lose access at expires_at, so reminding them
 * is a false alarm.
 */
function shouldSend3DayPaidProReminder(u, now = Date.now()) {
  const h = hoursUntilProSubscriptionEnds(u, now);
  if (h === null) return false;
  return h > 48 && h <= 84;
}

/**
 * Last-night trial reminder window. Returns true when trial expires in
 * (0, 36] hours — i.e., between right-now and ~1.5 days out, AND still in
 * the future. The caller MUST additionally confirm the user is being
 * enqueued for a dream THIS run (isProActive=true at cron time) so the
 * "Tonight is your last Pro nightly dream" promise is accurate.
 *
 * Why 36h: cron drifts up to ~5h late; if expiry is 24h from a 13:00 cron,
 * tomorrow's cron at 09:00 would be 4h after expiry — the last-night
 * window must extend past 24h to guarantee we catch the user on a cron
 * that DOES deliver their final dream. The opposite bound (anything <0)
 * just means the trial already expired so we skip — too late to call it
 * "tonight's the last."
 */
function shouldSendLastNightTrialReminder(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  const h = hoursUntilTrialEnds(u, now, trialDays);
  if (h === null) return false;
  return h > 0 && h <= 36;
}

/**
 * Last-night paid Pro expiry reminder. Mirrors the trial version but reads
 * `pro_subscription_expires_at`. Caller MUST additionally check
 * `pro_subscription_will_renew === false` AND that we're enqueuing the
 * user's dream this same cron run (so "tonight is your last Pro nightly
 * dream" is accurate to system behavior).
 */
function shouldSendLastNightPaidProReminder(u, now = Date.now()) {
  const h = hoursUntilProSubscriptionEnds(u, now);
  if (h === null) return false;
  return h > 0 && h <= 36;
}

/**
 * Trial-ENDED notice window (2026-07-05). Returns true when the trial
 * expired within the last 36 hours — i.e. h in [-36, 0]. The post-expiry
 * companion to the two pre-expiry reminders: without it, nightly dreams
 * just silently stop and the user's inbox never says why.
 *
 * Why 36h: the cron runs daily and can drift several hours late; a 24h
 * window could miss a user whose expiry lands just after one run when the
 * next run fires late. 36h guarantees at least one daily cron falls inside
 * the window; the notifications-table (recipient × subtype) dedup makes a
 * second in-window run a no-op. Anything older than 36h means we already
 * had our chance — don't nag stale lapsed trials.
 */
function shouldSendTrialEndedNotice(u, now = Date.now(), trialDays = TRIAL_DURATION_DAYS) {
  const h = hoursUntilTrialEnds(u, now, trialDays);
  if (h === null) return false;
  return h <= 0 && h >= -36;
}

module.exports = {
  isProActive,
  isPaidProActive,
  isTrialActive,
  isBasicActive,
  isDreamEligible,
  nightlyDreamedUserIds,
  hoursUntilTrialEnds,
  hoursUntilProSubscriptionEnds,
  shouldSend3DayTrialReminder,
  shouldSendLastNightTrialReminder,
  shouldSendTrialEndedNotice,
  shouldSend3DayPaidProReminder,
  shouldSendLastNightPaidProReminder,
  TRIAL_DURATION_DAYS,
};
