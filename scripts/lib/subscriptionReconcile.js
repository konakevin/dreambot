/**
 * Pure decision logic for the subscription sparkle reconciliation backstop
 * (scripts/reconcile-subscription-sparkles.js). Extracted so the money-adjacent
 * rules are unit-testable (Architect audit 2026-09-03, finding H2) — the script
 * stays a thin I/O shell.
 *
 * Contract highlights:
 *  - The reconcile reason `sub_reconcile:<tier>:<userId>:<cycleKey>` is the
 *    IDEMPOTENCY KEY (one reconcile grant per user per cycle, and a marker that
 *    distinguishes backstop grants from webhook grants in the ledger). Its format
 *    must stay stable.
 *  - Yearly subs got 12x the monthly bundle up front and are NEVER owed monthly.
 *  - Indeterminate subs (no period stamp AND no grant history — trials, admin
 *    flags, pre-stamp rows) are SKIPPED, never auto-granted.
 */

/**
 * Start of the current monthly billing cycle: one month before the expiry.
 * DAY-CLAMPED: naive setMonth() rolls month-end dates over (Mar 31 → "Feb 31" →
 * Mar 3), which would shift the cycle start days LATE — making a legit webhook
 * grant near the true cycle start look "outside the cycle" and causing the
 * backstop to DOUBLE-GRANT. Clamping to the previous month's last day (Mar 31 →
 * Feb 28) keeps the window honest. (Latent bug found + fixed during the audit-H2
 * test extraction, 2026-09-03.)
 */
function monthlyCycleStart(expiresAt) {
  // UTC math throughout: the ledger/expiry timestamps are UTC, and local-time
  // setMonth() would shift the computed day by the machine's timezone offset
  // (laptop vs CI would disagree). Caught by the H2 test suite, 2026-09-03.
  const d = new Date(expiresAt);
  const targetMonth = (d.getUTCMonth() + 11) % 12;
  d.setUTCMonth(d.getUTCMonth() - 1);
  if (d.getUTCMonth() !== targetMonth) d.setUTCDate(0); // rolled over → clamp to prev month's last day
  return d;
}

/**
 * Which billing period is this sub on?
 *  - The users.<tier>_subscription_period stamp (migration 452) is authoritative.
 *  - Pre-stamp subs: infer from the last bundle grant amount (12x monthly = yearly).
 *  - Neither → null (indeterminate).
 */
function inferPeriod({ periodStamp, lastGrant, monthlyBundle }) {
  if (periodStamp === 'monthly' || periodStamp === 'yearly') return periodStamp;
  if (lastGrant) return Number(lastGrant.amount) >= monthlyBundle * 12 ? 'yearly' : 'monthly';
  return null;
}

/**
 * The full per-subscriber decision.
 * @returns {{ action: 'grant'|'skip_yearly'|'skip_covered'|'skip_indeterminate',
 *             cycleKey: string, reconcileReason: string|null }}
 */
function decideReconcile({ tierName, userId, periodStamp, lastGrant, monthlyBundle, expiresAt }) {
  const cycleStart = monthlyCycleStart(expiresAt);
  const cycleKey = cycleStart.toISOString().slice(0, 10);
  const reconcileReason = `sub_reconcile:${tierName}:${userId}:${cycleKey}`;

  const period = inferPeriod({ periodStamp, lastGrant, monthlyBundle });

  if (period === 'yearly') {
    return { action: 'skip_yearly', cycleKey, reconcileReason: null };
  }
  if (period === null) {
    return { action: 'skip_indeterminate', cycleKey, reconcileReason: null };
  }
  // Monthly: covered if a bundle grant already landed inside the current cycle.
  if (lastGrant && new Date(lastGrant.created_at) >= cycleStart) {
    return { action: 'skip_covered', cycleKey, reconcileReason: null };
  }
  return { action: 'grant', cycleKey, reconcileReason };
}

module.exports = { monthlyCycleStart, inferPeriod, decideReconcile };
