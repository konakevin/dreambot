/**
 * Cross-runtime PARITY lock for the Pro-state rule.
 *
 * Pro entitlement is encoded in THREE runtimes that must agree (CLAUDE.md):
 *   • lib/proStatus.ts                 (client)   — tested here
 *   • scripts/lib/nightlyEligibility.js (cron)    — tested here
 *   • is_pro_active() Postgres fn       (edge)    — locked by isProActive.dbspec.ts
 *
 * proStatus.test.ts + nightlyEligibility.test.ts each test ONE runtime in
 * isolation, so a change to one that silently DIVERGES from the other (the
 * Architect-audit 2026-06-19 concern: triplicated logic with no shared
 * assertion) passes both. This test runs an IDENTICAL matrix of entitlement
 * rows × now × trialDays through BOTH JS impls and asserts they never disagree
 * on isProActive or isDreamEligible — so divergence fails CI immediately.
 */

import {
  isProActive as tsIsProActive,
  isDreamEligible as tsIsDreamEligible,
} from '@/lib/proStatus';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const js = require('../../scripts/lib/nightlyEligibility');

const NOW = Date.UTC(2026, 5, 19, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();

// A spread of entitlement shapes that exercise every branch + boundary.
const ROWS: Array<Record<string, unknown> | null> = [
  null,
  {},
  // paid pro
  { pro_subscription: true },
  { pro_subscription: true, pro_subscription_expires_at: iso(DAY) }, // active
  { pro_subscription: true, pro_subscription_expires_at: iso(-DAY) }, // expired
  { pro_subscription: true, pro_subscription_expires_at: iso(0) }, // boundary (==now)
  { pro_subscription: false, pro_subscription_expires_at: iso(DAY) },
  // trial
  { pro_trial_started_at: iso(-1 * DAY) }, // 1d into trial
  { pro_trial_started_at: iso(-13 * DAY) }, // late but inside 14d
  { pro_trial_started_at: iso(-15 * DAY) }, // lapsed under 14d
  { pro_trial_started_at: iso(-18 * DAY) }, // inside 20d, outside 14d (window-sensitive)
  // basic
  { basic_subscription: true },
  { basic_subscription: true, basic_subscription_expires_at: iso(DAY) },
  { basic_subscription: true, basic_subscription_expires_at: iso(-DAY) },
  // admin (only affects isDreamEligible)
  { is_admin: true },
  { is_admin: true, pro_subscription: true, pro_subscription_expires_at: iso(-DAY) },
  // combined
  {
    pro_subscription: true,
    pro_subscription_expires_at: iso(-DAY),
    pro_trial_started_at: iso(-2 * DAY),
  },
];

const NOWS = [NOW, NOW - 30 * DAY, NOW + 30 * DAY];
const TRIAL_DAYS = [14, 20, 7];

describe('Pro-state parity: client (proStatus.ts) === cron (nightlyEligibility.js)', () => {
  it('isProActive agrees across every row × now × trialDays', () => {
    for (const row of ROWS) {
      for (const now of NOWS) {
        for (const td of TRIAL_DAYS) {
          const ts = tsIsProActive(row, now, td);
          const j = js.isProActive(row, now, td);
          expect({ ts, j, row, now, td }).toEqual({ ts: j, j, row, now, td });
        }
      }
    }
  });

  it('isDreamEligible agrees across every row × now × trialDays', () => {
    for (const row of ROWS) {
      for (const now of NOWS) {
        for (const td of TRIAL_DAYS) {
          const ts = tsIsDreamEligible(row, now, td);
          const j = js.isDreamEligible(row, now, td);
          expect({ ts, j, row, now, td }).toEqual({ ts: j, j, row, now, td });
        }
      }
    }
  });
});
