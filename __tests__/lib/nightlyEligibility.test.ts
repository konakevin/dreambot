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
  hoursUntilTrialEnds,
  hoursUntilProSubscriptionEnds,
  shouldSend3DayTrialReminder,
  shouldSendLastNightTrialReminder,
  shouldSend3DayPaidProReminder,
  shouldSendLastNightPaidProReminder,
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

describe('trial-reminder windows — 3-day fires in (48, 84]h', () => {
  // trial = 14 days → trial_ends_at = trial_started_at + 14d
  // For h hours until expiry, trial_started_at = NOW + h*h - 14d*ms
  const trialAt = (hUntilEnd: number) =>
    new Date(NOW + hUntilEnd * 3_600_000 - TRIAL_DURATION_DAYS * 86_400_000).toISOString();

  it('fires at the middle of the window (66h = 2.75d before expiry)', () => {
    const u = { pro_trial_started_at: trialAt(66) };
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(true);
  });

  it('fires at the upper-bound edge (84h)', () => {
    const u = { pro_trial_started_at: trialAt(84) };
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(true);
  });

  it('does NOT fire above the upper bound (84.5h)', () => {
    const u = { pro_trial_started_at: trialAt(84.5) };
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(false);
  });

  it('does NOT fire at the lower-bound edge (48h — should land in last-night window instead)', () => {
    const u = { pro_trial_started_at: trialAt(48) };
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(false);
  });

  it('does NOT fire when trial already expired (-1h)', () => {
    const u = { pro_trial_started_at: trialAt(-1) };
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(false);
  });

  it('does NOT fire when no trial started', () => {
    expect(shouldSend3DayTrialReminder({ pro_trial_started_at: null }, NOW)).toBe(false);
    expect(shouldSend3DayTrialReminder({}, NOW)).toBe(false);
    expect(shouldSend3DayTrialReminder(null, NOW)).toBe(false);
  });
});

describe('trial-reminder windows — last-night fires in (0, 36]h', () => {
  const trialAt = (hUntilEnd: number) =>
    new Date(NOW + hUntilEnd * 3_600_000 - TRIAL_DURATION_DAYS * 86_400_000).toISOString();

  it('fires at 12h before expiry (mid-window)', () => {
    const u = { pro_trial_started_at: trialAt(12) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(true);
  });

  it('fires at the upper-bound edge (36h)', () => {
    const u = { pro_trial_started_at: trialAt(36) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(true);
  });

  it('does NOT fire above the upper bound (37h — caller will use this run to deliver dream but reminder is held for tomorrow)', () => {
    const u = { pro_trial_started_at: trialAt(37) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(false);
  });

  it('does NOT fire when trial just expired (-0.1h)', () => {
    const u = { pro_trial_started_at: trialAt(-0.1) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(false);
  });

  it('does NOT fire at exactly 0 (lower bound exclusive — already expired)', () => {
    const u = { pro_trial_started_at: trialAt(0) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(false);
  });

  it('regression: sunnysteph case — trial expires 13h after cron run should fire last-night reminder', () => {
    // She would have gotten the last-night ping the day before expiry,
    // when cron at ~10:00 UTC sees trial expiring at ~02:30 UTC next day.
    const u = { pro_trial_started_at: trialAt(13.5) };
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(true);
    expect(shouldSend3DayTrialReminder(u, NOW)).toBe(false);
  });
});

describe('paid-Pro reminder windows — mirror trial windows but key on pro_subscription_expires_at', () => {
  // For h hours until expiry, pro_subscription_expires_at = NOW + h hours
  const paidExpiringIn = (hUntilEnd: number) => ({
    pro_subscription: true,
    pro_subscription_expires_at: new Date(NOW + hUntilEnd * 3_600_000).toISOString(),
  });

  describe('3-day window', () => {
    it('fires at 66h (mid-window)', () => {
      expect(shouldSend3DayPaidProReminder(paidExpiringIn(66), NOW)).toBe(true);
    });

    it('does NOT fire above upper bound (84.5h)', () => {
      expect(shouldSend3DayPaidProReminder(paidExpiringIn(84.5), NOW)).toBe(false);
    });

    it('does NOT fire when not paid Pro', () => {
      expect(
        shouldSend3DayPaidProReminder(
          {
            pro_subscription: false,
            pro_subscription_expires_at: new Date(NOW + 66 * 3_600_000).toISOString(),
          },
          NOW
        )
      ).toBe(false);
    });

    it('does NOT fire when no expires_at (indefinite access)', () => {
      expect(
        shouldSend3DayPaidProReminder(
          { pro_subscription: true, pro_subscription_expires_at: null },
          NOW
        )
      ).toBe(false);
    });
  });

  describe('last-night window', () => {
    it('fires at 12h before expiry', () => {
      expect(shouldSendLastNightPaidProReminder(paidExpiringIn(12), NOW)).toBe(true);
    });

    it('does NOT fire after expiry', () => {
      expect(shouldSendLastNightPaidProReminder(paidExpiringIn(-0.5), NOW)).toBe(false);
    });

    it('does NOT fire above upper bound (37h)', () => {
      expect(shouldSendLastNightPaidProReminder(paidExpiringIn(37), NOW)).toBe(false);
    });
  });
});

describe('hour calculators — null-safe + correct sign', () => {
  it('hoursUntilTrialEnds is null when no trial started', () => {
    expect(hoursUntilTrialEnds({}, NOW)).toBeNull();
    expect(hoursUntilTrialEnds(null, NOW)).toBeNull();
  });

  it('hoursUntilTrialEnds is positive in trial, negative after', () => {
    const inTrial = { pro_trial_started_at: new Date(NOW - 7 * 86_400_000).toISOString() };
    expect(hoursUntilTrialEnds(inTrial, NOW)).toBeGreaterThan(0); // 7 days left
    const lapsed = { pro_trial_started_at: new Date(NOW - 20 * 86_400_000).toISOString() };
    expect(hoursUntilTrialEnds(lapsed, NOW)).toBeLessThan(0);
  });

  it('hoursUntilProSubscriptionEnds is null when not paid Pro', () => {
    expect(hoursUntilProSubscriptionEnds({ pro_subscription: false }, NOW)).toBeNull();
    expect(
      hoursUntilProSubscriptionEnds(
        { pro_subscription: true, pro_subscription_expires_at: null },
        NOW
      )
    ).toBeNull();
  });
});

describe('configurable trial window (trialDays param — mirrors engine_config.pro_trial_days)', () => {
  // Trial started 20 days ago: lapsed under default 14d, active under 30d.
  const u = { pro_trial_started_at: days(-20) };

  it('defaults to 14 when trialDays omitted', () => {
    expect(TRIAL_DURATION_DAYS).toBe(14);
    expect(isProActive(u, NOW)).toBe(false);
    expect(isTrialActive(u, NOW)).toBe(false);
  });

  it('isProActive + isTrialActive honor a widened trialDays', () => {
    expect(isTrialActive(u, NOW, 30)).toBe(true);
    expect(isProActive(u, NOW, 30)).toBe(true);
  });

  it('hoursUntilTrialEnds shifts with trialDays', () => {
    // started 20d ago, 30d window → 10 days (240h) remaining
    expect(hoursUntilTrialEnds(u, NOW, 30)).toBeCloseTo(240, 5);
    // default 14d window → already 6 days past (negative)
    expect(hoursUntilTrialEnds(u, NOW)).toBeCloseTo(-144, 5);
  });
});
