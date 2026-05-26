/**
 * Behavioral tests for nightly-dream eligibility (scripts/lib/nightlyEligibility.js),
 * the cohort gate the nightly cron uses. Mirrors lib/proStatus.ts.
 *
 * Guarantees under test:
 *   1. Nightly dreams are Pro-only — active paid OR active 14-day trial gets a
 *      dream every night; an expired subscription / lapsed trial falls back to
 *      free and gets none.
 *   2. The idempotency guard only skips users who already got a COMPLETED
 *      NIGHTLY dream today — NOT users who merely generated manually (the bug
 *      that silently stopped nightly dreams for daily power-users).
 */

const {
  isProActive,
  isPaidProActive,
  isTrialActive,
  nightlyDreamedUserIds,
  TRIAL_DURATION_DAYS,
} = require('../../scripts/lib/nightlyEligibility');

const NOW = Date.UTC(2026, 4, 26, 12, 0, 0);
const days = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

describe('nightlyEligibility — Pro gating (active → nightly, expired → none)', () => {
  it('active paid subscriber is eligible', () => {
    expect(
      isProActive({ pro_subscription: true, pro_subscription_expires_at: days(30) }, NOW)
    ).toBe(true);
  });

  it('expired subscriber falls back to free → NOT eligible', () => {
    expect(
      isProActive({ pro_subscription: true, pro_subscription_expires_at: days(-1) }, NOW)
    ).toBe(false);
  });

  it('trial user within 14 days is eligible', () => {
    expect(isProActive({ pro_trial_started_at: days(-5) }, NOW)).toBe(true);
  });

  it('lapsed trial (>14 days) → NOT eligible', () => {
    expect(isProActive({ pro_trial_started_at: days(-20) }, NOW)).toBe(false);
  });

  it('no subscription and no trial → NOT eligible', () => {
    expect(isProActive({}, NOW)).toBe(false);
    expect(isProActive(null, NOW)).toBe(false);
  });

  it('trial boundary expires at exactly 14 days', () => {
    expect(isTrialActive({ pro_trial_started_at: days(-TRIAL_DURATION_DAYS) }, NOW)).toBe(false);
  });

  it('paid + trial helpers match the client lib semantics', () => {
    expect(
      isPaidProActive({ pro_subscription: true, pro_subscription_expires_at: days(1) }, NOW)
    ).toBe(true);
    expect(isTrialActive({ pro_trial_started_at: days(-1) }, NOW)).toBe(true);
  });
});

describe('nightlyEligibility — idempotency guard (root cause of stopped nightly dreams)', () => {
  it('skips a user who already got a COMPLETED nightly dream today', () => {
    const rows = [{ user_id: 'pro-1', rolled_axes: { engine: 'nightly-cast-character' } }];
    expect(nightlyDreamedUserIds(rows).has('pro-1')).toBe(true);
  });

  it('does NOT skip a user whose only dream today was a MANUAL Create render', () => {
    // The bug: the old guard keyed on ai_generation_budget, which the manual
    // path also writes — so a daily power-user always looked "already dreamed"
    // and never got their nightly dream. Manual engines must not count here.
    const rows = [
      { user_id: 'u-manual', rolled_axes: { engine: 'v4-create' } },
      { user_id: 'u-none', rolled_axes: {} },
      { user_id: 'u-null', rolled_axes: null },
    ];
    const set = nightlyDreamedUserIds(rows);
    expect(set.has('u-manual')).toBe(false);
    expect(set.has('u-none')).toBe(false);
    expect(set.has('u-null')).toBe(false);
  });

  it('recognizes all nightly engine variants', () => {
    const rows = [
      { user_id: 'a', rolled_axes: { engine: 'nightly-cast-character' } },
      { user_id: 'b', rolled_axes: { engine: 'nightly-cast-epic' } },
      { user_id: 'c', rolled_axes: { engine: 'nightly-pure-scene' } },
    ];
    expect(nightlyDreamedUserIds(rows).size).toBe(3);
  });

  it('handles empty / undefined input', () => {
    expect(nightlyDreamedUserIds([]).size).toBe(0);
    expect(nightlyDreamedUserIds(undefined).size).toBe(0);
  });
});
