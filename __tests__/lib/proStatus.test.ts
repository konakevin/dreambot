/**
 * Behavioral tests for the Pro-subscription state machine (lib/proStatus.ts),
 * the single source of truth the client auth store uses to decide whether a
 * user has Pro perks right now.
 *
 * Core guarantee under test (Kevin, 2026-05-26): a user is Pro while they have
 * an active paid subscription OR an active 14-day trial, and is automatically
 * put back in the FREE state the moment the subscription expires or the trial
 * lapses — every read re-validates the timestamps.
 */

import {
  isProActive,
  isPaidProActive,
  isTrialActive,
  trialEndsAt,
  TRIAL_DURATION_DAYS,
} from '@/lib/proStatus';

const NOW = Date.UTC(2026, 4, 26, 12, 0, 0); // 2026-05-26T12:00:00Z
const days = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

describe('proStatus — paid subscription', () => {
  it('is Pro when pro_subscription=true and expiry is in the future', () => {
    const row = { pro_subscription: true, pro_subscription_expires_at: days(30) };
    expect(isPaidProActive(row, NOW)).toBe(true);
    expect(isProActive(row, NOW)).toBe(true);
  });

  it('falls back to FREE when the paid subscription has expired', () => {
    const row = { pro_subscription: true, pro_subscription_expires_at: days(-1) };
    expect(isPaidProActive(row, NOW)).toBe(false);
    expect(isProActive(row, NOW)).toBe(false);
  });

  it('treats a null expiry as active (no EXPIRATION recorded yet)', () => {
    expect(
      isPaidProActive({ pro_subscription: true, pro_subscription_expires_at: null }, NOW)
    ).toBe(true);
  });

  it('is FREE when pro_subscription is false / absent / null row', () => {
    expect(isPaidProActive({ pro_subscription: false }, NOW)).toBe(false);
    expect(isPaidProActive({}, NOW)).toBe(false);
    expect(isPaidProActive(null, NOW)).toBe(false);
  });
});

describe('proStatus — 14-day trial', () => {
  it('is Pro within the 14-day window', () => {
    expect(isTrialActive({ pro_trial_started_at: days(-5) }, NOW)).toBe(true);
    expect(isProActive({ pro_trial_started_at: days(-5) }, NOW)).toBe(true);
  });

  it('falls back to FREE once the trial lapses (>14 days)', () => {
    const row = { pro_trial_started_at: days(-15) };
    expect(isTrialActive(row, NOW)).toBe(false);
    expect(isProActive(row, NOW)).toBe(false);
  });

  it('expires exactly at the 14-day boundary', () => {
    // trial started exactly 14 days ago → ends exactly NOW → not > now
    expect(isTrialActive({ pro_trial_started_at: days(-TRIAL_DURATION_DAYS) }, NOW)).toBe(false);
  });

  it('has no trial when pro_trial_started_at is absent', () => {
    expect(isTrialActive({}, NOW)).toBe(false);
    expect(isTrialActive(null, NOW)).toBe(false);
  });

  it('trialEndsAt = start + 14 days, null when no trial', () => {
    expect(trialEndsAt({ pro_trial_started_at: days(0) })).toBe(days(TRIAL_DURATION_DAYS));
    expect(trialEndsAt({})).toBeNull();
    expect(trialEndsAt(null)).toBeNull();
  });
});

describe('proStatus — effective state + lifecycle transitions', () => {
  it('a trial user is Pro but NOT paid-Pro (UI: "upgrade" vs "manage")', () => {
    const row = { pro_trial_started_at: days(-3) };
    expect(isProActive(row, NOW)).toBe(true);
    expect(isPaidProActive(row, NOW)).toBe(false);
  });

  it('stays Pro if the trial is still active even after a paid sub expired', () => {
    const row = {
      pro_subscription: true,
      pro_subscription_expires_at: days(-1),
      pro_trial_started_at: days(-2),
    };
    expect(isProActive(row, NOW)).toBe(true);
  });

  it('full lifecycle: trial → lapses to free → subscribes to Pro → expires to free', () => {
    const onlyTrial = { pro_trial_started_at: days(-2) };
    // During trial → Pro
    expect(isProActive(onlyTrial, NOW)).toBe(true);
    // 20 days later, no payment → trial lapsed → FREE
    const later = NOW + 20 * 86_400_000;
    expect(isProActive(onlyTrial, later)).toBe(false);
    // User subscribes (expiry 30 days out) → Pro again
    const paid = {
      ...onlyTrial,
      pro_subscription: true,
      pro_subscription_expires_at: new Date(later + 30 * 86_400_000).toISOString(),
    };
    expect(isProActive(paid, later)).toBe(true);
    expect(isPaidProActive(paid, later)).toBe(true);
    // Subscription later expires → back to FREE
    const muchLater = later + 40 * 86_400_000;
    expect(isProActive(paid, muchLater)).toBe(false);
    expect(isPaidProActive(paid, muchLater)).toBe(false);
  });
});

describe('proStatus — configurable trial window (trialDays param)', () => {
  // A trial started 20 days ago: lapsed under the default 14d, active under 30d.
  const row = { pro_trial_started_at: days(-20) };

  it('defaults to TRIAL_DURATION_DAYS (14) when trialDays omitted', () => {
    expect(TRIAL_DURATION_DAYS).toBe(14);
    expect(isProActive(row, NOW)).toBe(false);
    expect(isTrialActive(row, NOW)).toBe(false);
  });

  it('honors a widened trialDays', () => {
    expect(isTrialActive(row, NOW, 30)).toBe(true);
    expect(isProActive(row, NOW, 30)).toBe(true);
  });

  it('trialEndsAt shifts with trialDays', () => {
    const start = days(0);
    expect(trialEndsAt({ pro_trial_started_at: start }, 30)).toBe(days(30));
    expect(trialEndsAt({ pro_trial_started_at: start }, 7)).toBe(days(7));
  });
});
