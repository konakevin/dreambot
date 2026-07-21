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
  isBasicActive,
  isDreamEligible,
  nightlyDreamedUserIds,
  hoursUntilTrialEnds,
  hoursUntilProSubscriptionEnds,
  hoursUntilBasicSubscriptionEnds,
  shouldSend3DayTrialReminder,
  shouldSendLastNightTrialReminder,
  shouldSendTrialEndedNotice,
  shouldSend3DayPaidProReminder,
  shouldSendLastNightPaidProReminder,
  shouldSend3DayBasicReminder,
  shouldSendLastNightBasicReminder,
  TRIAL_DURATION_DAYS,
} = require('../../scripts/lib/nightlyEligibility');

// The client TS source of truth, for the cross-runtime parity block below.
import {
  isProActive as tsIsProActive,
  isPaidProActive as tsIsPaidProActive,
  isTrialActive as tsIsTrialActive,
  isBasicActive as tsIsBasicActive,
  isDreamEligible as tsIsDreamEligible,
} from '@/lib/proStatus';

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

describe('trial-reminder windows — ended notice fires in [-36, 0]h (post-expiry)', () => {
  const trialAt = (hUntilEnd: number) =>
    new Date(NOW + hUntilEnd * 3_600_000 - TRIAL_DURATION_DAYS * 86_400_000).toISOString();

  it('fires just after expiry (-1h)', () => {
    const u = { pro_trial_started_at: trialAt(-1) };
    expect(shouldSendTrialEndedNotice(u, NOW)).toBe(true);
  });

  it('fires at exactly 0 (the moment of expiry)', () => {
    const u = { pro_trial_started_at: trialAt(0) };
    expect(shouldSendTrialEndedNotice(u, NOW)).toBe(true);
  });

  it('fires at the lower-bound edge (-36h — late cron still catches)', () => {
    const u = { pro_trial_started_at: trialAt(-36) };
    expect(shouldSendTrialEndedNotice(u, NOW)).toBe(true);
  });

  it('does NOT fire on a stale lapsed trial (-37h — chance missed, no nagging)', () => {
    const u = { pro_trial_started_at: trialAt(-37) };
    expect(shouldSendTrialEndedNotice(u, NOW)).toBe(false);
  });

  it('does NOT fire while the trial is still alive (+1h — that is last-night territory)', () => {
    const u = { pro_trial_started_at: trialAt(1) };
    expect(shouldSendTrialEndedNotice(u, NOW)).toBe(false);
    expect(shouldSendLastNightTrialReminder(u, NOW)).toBe(true);
  });

  it('never fires for a user who never started a trial', () => {
    expect(shouldSendTrialEndedNotice({ pro_trial_started_at: null }, NOW)).toBe(false);
  });

  it('windows are mutually exclusive — no hour matches both last-night and ended', () => {
    for (const h of [-36, -12, -0.5, 0, 0.5, 12, 36]) {
      const u = { pro_trial_started_at: trialAt(h) };
      const both = shouldSendLastNightTrialReminder(u, NOW) && shouldSendTrialEndedNotice(u, NOW);
      expect(both).toBe(false);
    }
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

describe('Basic reminder windows — mirror paid-Pro but key on basic_subscription_expires_at', () => {
  const basicExpiringIn = (hUntilEnd: number) => ({
    basic_subscription: true,
    basic_subscription_expires_at: new Date(NOW + hUntilEnd * 3_600_000).toISOString(),
  });

  describe('3-day window', () => {
    it('fires at 66h (mid-window)', () => {
      expect(shouldSend3DayBasicReminder(basicExpiringIn(66), NOW)).toBe(true);
    });

    it('does NOT fire above upper bound (84.5h)', () => {
      expect(shouldSend3DayBasicReminder(basicExpiringIn(84.5), NOW)).toBe(false);
    });

    it('does NOT fire when not Basic', () => {
      expect(
        shouldSend3DayBasicReminder(
          {
            basic_subscription: false,
            basic_subscription_expires_at: new Date(NOW + 66 * 3_600_000).toISOString(),
          },
          NOW
        )
      ).toBe(false);
    });

    it('does NOT fire when no expires_at (indefinite access)', () => {
      expect(
        shouldSend3DayBasicReminder(
          { basic_subscription: true, basic_subscription_expires_at: null },
          NOW
        )
      ).toBe(false);
    });
  });

  describe('last-night window', () => {
    it('fires at 12h before expiry', () => {
      expect(shouldSendLastNightBasicReminder(basicExpiringIn(12), NOW)).toBe(true);
    });

    it('does NOT fire after expiry', () => {
      expect(shouldSendLastNightBasicReminder(basicExpiringIn(-0.5), NOW)).toBe(false);
    });

    it('does NOT fire above upper bound (37h)', () => {
      expect(shouldSendLastNightBasicReminder(basicExpiringIn(37), NOW)).toBe(false);
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

  it('hoursUntilBasicSubscriptionEnds is null when not Basic', () => {
    expect(hoursUntilBasicSubscriptionEnds({ basic_subscription: false }, NOW)).toBeNull();
    expect(
      hoursUntilBasicSubscriptionEnds(
        { basic_subscription: true, basic_subscription_expires_at: null },
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

describe('nightlyEligibility — DreamBot Basic (the enqueue gate now includes Basic)', () => {
  it('active paid Basic → isBasicActive + dream-eligible', () => {
    const u = { basic_subscription: true, basic_subscription_expires_at: days(20) };
    expect(isBasicActive(u, NOW)).toBe(true);
    expect(isDreamEligible(u, NOW)).toBe(true);
  });

  it('Basic with no expiry → active', () => {
    expect(
      isBasicActive({ basic_subscription: true, basic_subscription_expires_at: null }, NOW)
    ).toBe(true);
  });

  it('expired Basic → not active, not eligible (when no Pro/trial)', () => {
    const u = { basic_subscription: true, basic_subscription_expires_at: days(-1) };
    expect(isBasicActive(u, NOW)).toBe(false);
    expect(isDreamEligible(u, NOW)).toBe(false);
  });

  it('Basic has NO trial of its own — a lapsed Pro trial does not confer Basic', () => {
    expect(isBasicActive({ pro_trial_started_at: days(-1) }, NOW)).toBe(false);
  });

  it('dream-eligible = Pro OR trial OR Basic', () => {
    // Pro paid
    expect(
      isDreamEligible({ pro_subscription: true, pro_subscription_expires_at: days(30) }, NOW)
    ).toBe(true);
    // Pro trial
    expect(isDreamEligible({ pro_trial_started_at: days(-5) }, NOW)).toBe(true);
    // Basic only (lapsed Pro trial, no Pro sub)
    expect(
      isDreamEligible(
        {
          basic_subscription: true,
          basic_subscription_expires_at: days(10),
          pro_trial_started_at: days(-40),
        },
        NOW
      )
    ).toBe(true);
    // none
    expect(isDreamEligible({}, NOW)).toBe(false);
    expect(isDreamEligible(null, NOW)).toBe(false);
  });

  it('respects the configurable trial window for the Pro side of eligibility', () => {
    const u = { pro_trial_started_at: days(-20) }; // lapsed at 14d
    expect(isDreamEligible(u, NOW)).toBe(false);
    expect(isDreamEligible(u, NOW, 30)).toBe(true); // widened trial → eligible again
  });
});

// L11: the cron re-implements the Pro/Basic/trial rule in JS rather than calling
// the SQL is_dream_eligible(). This locks the cron JS to the client TS source of
// truth on a fixture battery; combined with isProActive.dbspec.ts (SQL === TS),
// all THREE runtimes (client, cron, Postgres) are pinned to the same verdict.
describe('nightlyEligibility ⇆ proStatus parity (cron JS === client TS)', () => {
  const FIXTURES: [string, Record<string, unknown>][] = [
    [
      'paid active (future expiry)',
      { pro_subscription: true, pro_subscription_expires_at: days(30) },
    ],
    ['paid expired', { pro_subscription: true, pro_subscription_expires_at: days(-1) }],
    ['paid null-expiry', { pro_subscription: true, pro_subscription_expires_at: null }],
    ['trial active (5d old)', { pro_trial_started_at: days(-5) }],
    ['trial lapsed (20d old)', { pro_trial_started_at: days(-20) }],
    ['basic active', { basic_subscription: true, basic_subscription_expires_at: days(30) }],
    ['basic expired', { basic_subscription: true, basic_subscription_expires_at: days(-1) }],
    [
      'basic + lapsed trial',
      {
        basic_subscription: true,
        basic_subscription_expires_at: days(30),
        pro_trial_started_at: days(-40),
      },
    ],
    [
      'paid + lapsed trial',
      {
        pro_subscription: true,
        pro_subscription_expires_at: days(30),
        pro_trial_started_at: days(-40),
      },
    ],
    ['nothing', {}],
  ];

  for (const trialDays of [7, 14, 30]) {
    for (const [label, row] of FIXTURES) {
      it(`${label} @ ${trialDays}d window agrees`, () => {
        expect(isPaidProActive(row, NOW)).toBe(tsIsPaidProActive(row, NOW));
        expect(isTrialActive(row, NOW, trialDays)).toBe(tsIsTrialActive(row, NOW, trialDays));
        expect(isProActive(row, NOW, trialDays)).toBe(tsIsProActive(row, NOW, trialDays));
        expect(isBasicActive(row, NOW)).toBe(tsIsBasicActive(row, NOW));
        expect(isDreamEligible(row, NOW, trialDays)).toBe(tsIsDreamEligible(row, NOW, trialDays));
      });
    }
  }
});
