/**
 * CROSS-RUNTIME REGRESSION LOCK (Architect audit A1, 2026-07-19).
 *
 * Pro / Basic / dream-eligibility is encoded in THREE runtimes that must stay in
 * lockstep: lib/proStatus.ts (client), scripts/lib/nightlyEligibility.js (cron),
 * and is_pro_active()/is_dream_eligible() SQL (locked separately by
 * __tests__/db/isProActive.dbspec.ts). The two JS/TS copies have identical logic
 * today, but a future edit to one could silently diverge — and eligibility gates
 * nightly-dream DELIVERY, so drift means users lose access with nothing catching it.
 *
 * This test runs BOTH the client and cron implementations over a fuzzed grid of
 * entitlement states x clock times x trial windows and asserts they return the
 * exact same booleans for every case. If someone changes one runtime's rule
 * without changing the other, this fails.
 */
import {
  isPaidProActive as tsPaidPro,
  isTrialActive as tsTrial,
  isProActive as tsPro,
  isBasicActive as tsBasic,
  isDreamEligible as tsEligible,
} from '@/lib/proStatus';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('../../scripts/lib/nightlyEligibility');

const BASE = Date.parse('2026-07-19T00:00:00.000Z');
const DAY = 24 * 60 * 60 * 1000;

// Timestamps relative to a reference `now`, covering every boundary that matters:
// null (unset), well in the past, just past, just future, well in the future.
function stamps(now: number): (string | null)[] {
  return [
    null,
    new Date(now - 100 * DAY).toISOString(),
    new Date(now - 1 * DAY).toISOString(),
    new Date(now - 1000).toISOString(),
    new Date(now + 1000).toISOString(),
    new Date(now + 1 * DAY).toISOString(),
    new Date(now + 100 * DAY).toISOString(),
  ];
}

const BOOLS = [true, false, undefined];
const NOWS = [BASE, BASE + 3 * DAY, BASE + 20 * DAY];
const TRIAL_DAYS = [7, 14, 30];

interface Row {
  pro_subscription?: boolean;
  pro_subscription_expires_at?: string | null;
  pro_trial_started_at?: string | null;
  basic_subscription?: boolean;
  basic_subscription_expires_at?: string | null;
  is_admin?: boolean;
}

// Build the full cartesian grid once (deterministic — no Math.random, which is
// banned in this lane anyway). Kept to a representative slice per axis so the
// grid stays in the low tens of thousands, not millions.
function* rows(now: number): Generator<Row> {
  for (const pro of BOOLS)
    for (const proExp of stamps(now))
      for (const trial of stamps(now))
        for (const basic of BOOLS)
          for (const basicExp of stamps(now))
            for (const admin of [true, false, undefined])
              yield {
                pro_subscription: pro,
                pro_subscription_expires_at: proExp,
                pro_trial_started_at: trial,
                basic_subscription: basic,
                basic_subscription_expires_at: basicExp,
                is_admin: admin,
              };
}

describe('eligibility: client (proStatus.ts) and cron (nightlyEligibility.js) agree', () => {
  it('returns identical results across the fuzzed entitlement grid', () => {
    let checked = 0;
    for (const now of NOWS) {
      for (const trialDays of TRIAL_DAYS) {
        for (const row of rows(now)) {
          // Compare each of the 5 shared predicates. A single mismatch throws
          // with the exact row/now/trialDays so a regression is trivially located.
          const cases: [string, boolean, boolean][] = [
            ['isPaidProActive', tsPaidPro(row, now), cron.isPaidProActive(row, now)],
            [
              'isTrialActive',
              tsTrial(row, now, trialDays),
              cron.isTrialActive(row, now, trialDays),
            ],
            ['isProActive', tsPro(row, now, trialDays), cron.isProActive(row, now, trialDays)],
            ['isBasicActive', tsBasic(row, now), cron.isBasicActive(row, now)],
            [
              'isDreamEligible',
              tsEligible(row, now, trialDays),
              cron.isDreamEligible(row, now, trialDays),
            ],
          ];
          for (const [name, a, b] of cases) {
            if (a !== b) {
              throw new Error(
                `${name} MISMATCH — client=${a} cron=${b}\n` +
                  `now=${new Date(now).toISOString()} trialDays=${trialDays}\n` +
                  `row=${JSON.stringify(row)}`
              );
            }
          }
          checked += cases.length;
        }
      }
    }
    // Sanity: the grid actually ran (guards against a broken generator silently
    // asserting nothing).
    expect(checked).toBeGreaterThan(10000);
  });

  it('both runtimes default to a 14-day trial window', () => {
    expect(cron.TRIAL_DURATION_DAYS).toBe(14);
    // proStatus exports the same default constant.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TRIAL_DURATION_DAYS } = require('@/lib/proStatus');
    expect(TRIAL_DURATION_DAYS).toBe(14);
  });
});
