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

const TRIAL_DURATION_DAYS = 14;
const TRIAL_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

/** Active PAID subscription right now? (false for trial-only users.) */
function isPaidProActive(u, now = Date.now()) {
  if (!u || u.pro_subscription !== true) return false;
  if (!u.pro_subscription_expires_at) return true; // no expiry = active
  return new Date(u.pro_subscription_expires_at).getTime() > now;
}

/** Within an active 14-day trial right now? */
function isTrialActive(u, now = Date.now()) {
  if (!u || !u.pro_trial_started_at) return false;
  return new Date(u.pro_trial_started_at).getTime() + TRIAL_MS > now;
}

/** Effective Pro entitlement: active paid OR active trial. */
function isProActive(u, now = Date.now()) {
  return isPaidProActive(u, now) || isTrialActive(u, now);
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

module.exports = {
  isProActive,
  isPaidProActive,
  isTrialActive,
  nightlyDreamedUserIds,
  TRIAL_DURATION_DAYS,
};
