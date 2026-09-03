/**
 * Locks the subscription-reconcile decision logic (Architect audit 2026-09-03, H2).
 *
 * This is the daily backstop that GRANTS SPARKLES when a RevenueCat RENEWAL webhook
 * was dropped — money-adjacent code that previously had zero tests. Locks:
 *   - cycle-start math, INCLUDING the month-end rollover clamp (the extraction found
 *     a real latent bug: naive setMonth() turned "Mar 31 − 1 month" into Mar 3,
 *     which would have made a legit webhook grant near the true cycle start look
 *     "outside the cycle" → DOUBLE-GRANT on month-end expiries);
 *   - period inference (stamp is authoritative; 12x-amount fallback; indeterminate);
 *   - the skip/grant matrix (yearly never granted, covered cycles skipped,
 *     indeterminate NEVER auto-granted);
 *   - the idempotency-reason format (the ledger contract — must stay stable).
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  monthlyCycleStart,
  inferPeriod,
  decideReconcile,
} = require('../../scripts/lib/subscriptionReconcile');

const iso = (d: Date) => d.toISOString().slice(0, 10);

describe('monthlyCycleStart — one month before expiry, day-clamped', () => {
  it('normal mid-month date: Jun 15 → May 15', () => {
    expect(iso(monthlyCycleStart('2026-06-15T12:00:00Z'))).toBe('2026-05-15');
  });

  it('MONTH-END CLAMP: Mar 31 → Feb 28 (not Mar 3; the double-grant bug)', () => {
    expect(iso(monthlyCycleStart('2026-03-31T12:00:00Z'))).toBe('2026-02-28');
  });

  it('leap year: Mar 31 2028 → Feb 29', () => {
    expect(iso(monthlyCycleStart('2028-03-31T12:00:00Z'))).toBe('2028-02-29');
  });

  it('31st → 30-day month: Jul 31 → Jun 30', () => {
    expect(iso(monthlyCycleStart('2026-07-31T12:00:00Z'))).toBe('2026-06-30');
  });

  it('year boundary: Jan 15 → Dec 15 of prior year', () => {
    expect(iso(monthlyCycleStart('2026-01-15T12:00:00Z'))).toBe('2025-12-15');
  });
});

describe('inferPeriod — stamp authoritative, amount fallback, indeterminate', () => {
  it('stamp wins over a contradicting grant amount', () => {
    expect(
      inferPeriod({
        periodStamp: 'monthly',
        lastGrant: { amount: 900, created_at: '2026-08-01T00:00:00Z' }, // looks yearly
        monthlyBundle: 75,
      })
    ).toBe('monthly');
  });

  it('yearly stamp respected', () => {
    expect(inferPeriod({ periodStamp: 'yearly', lastGrant: null, monthlyBundle: 75 })).toBe(
      'yearly'
    );
  });

  it('no stamp: 12x amount infers yearly', () => {
    expect(
      inferPeriod({
        periodStamp: null,
        lastGrant: { amount: 900, created_at: '2026-08-01T00:00:00Z' },
        monthlyBundle: 75,
      })
    ).toBe('yearly');
  });

  it('no stamp: 1x amount infers monthly', () => {
    expect(
      inferPeriod({
        periodStamp: null,
        lastGrant: { amount: 75, created_at: '2026-08-01T00:00:00Z' },
        monthlyBundle: 75,
      })
    ).toBe('monthly');
  });

  it('no stamp, no grant history → null (indeterminate)', () => {
    expect(inferPeriod({ periodStamp: null, lastGrant: null, monthlyBundle: 75 })).toBeNull();
  });
});

describe('decideReconcile — the grant/skip matrix', () => {
  const base = {
    tierName: 'pro',
    userId: 'user-1',
    monthlyBundle: 75,
    expiresAt: '2026-09-20T00:00:00Z', // cycle start 2026-08-20
  };

  it('yearly (stamped) → skip_yearly, never a reason', () => {
    const r = decideReconcile({ ...base, periodStamp: 'yearly', lastGrant: null });
    expect(r.action).toBe('skip_yearly');
    expect(r.reconcileReason).toBeNull();
  });

  it('indeterminate (no stamp, no history) → skip_indeterminate, NEVER auto-grants', () => {
    const r = decideReconcile({ ...base, periodStamp: null, lastGrant: null });
    expect(r.action).toBe('skip_indeterminate');
    expect(r.reconcileReason).toBeNull();
  });

  it('monthly, grant already landed INSIDE the cycle → skip_covered', () => {
    const r = decideReconcile({
      ...base,
      periodStamp: 'monthly',
      lastGrant: { amount: 75, created_at: '2026-08-25T00:00:00Z' }, // after Aug 20 start
    });
    expect(r.action).toBe('skip_covered');
  });

  it('monthly, last grant BEFORE the cycle → grant, with the stable reason format', () => {
    const r = decideReconcile({
      ...base,
      periodStamp: 'monthly',
      lastGrant: { amount: 75, created_at: '2026-07-19T00:00:00Z' },
    });
    expect(r.action).toBe('grant');
    // THE LEDGER CONTRACT: sub_reconcile:<tier>:<userId>:<cycleKey(YYYY-MM-DD)>
    expect(r.reconcileReason).toBe(`sub_reconcile:pro:user-1:${r.cycleKey}`);
    expect(r.cycleKey).toBe('2026-08-20');
  });

  it('12x-inferred yearly (pre-stamp sub) → skip_yearly', () => {
    const r = decideReconcile({
      ...base,
      periodStamp: null,
      lastGrant: { amount: 900, created_at: '2026-01-01T00:00:00Z' },
    });
    expect(r.action).toBe('skip_yearly');
  });

  it('REGRESSION LOCK (month-end double-grant bug): expiry Mar 31, webhook granted at the', () => {
    // TRUE cycle start (Feb 28). The old naive setMonth() computed the cycle start as
    // Mar 3, which made this legit grant look "outside the cycle" → double-grant.
    const r = decideReconcile({
      tierName: 'basic',
      userId: 'user-2',
      monthlyBundle: 20,
      expiresAt: '2026-03-31T00:00:00Z',
      periodStamp: 'monthly',
      lastGrant: { amount: 20, created_at: '2026-02-28T12:00:00Z' },
    });
    expect(r.action).toBe('skip_covered'); // NOT 'grant'
  });

  it('basic tier reason carries its own tier name', () => {
    const r = decideReconcile({
      tierName: 'basic',
      userId: 'user-3',
      monthlyBundle: 20,
      expiresAt: '2026-09-10T00:00:00Z',
      periodStamp: 'monthly',
      lastGrant: null,
    });
    expect(r.action).toBe('grant');
    expect(r.reconcileReason).toBe('sub_reconcile:basic:user-3:2026-08-10');
  });
});
