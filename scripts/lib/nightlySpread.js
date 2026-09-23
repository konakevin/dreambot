/**
 * nightlySpread.js — spread one hour's nightly jobs over a few minutes instead of starting them all at once
 * (NIGHTLY_ROBUSTNESS_PLAN.md item 3, migration 551).
 *
 * WHY. Users are enqueued at their local 4am, so everyone in a time zone lands in ONE insert. The worker only
 * claims jobs whose created_at has passed, so a batch inserted at the same instant starts together — the 10:18
 * UTC Denver burst that hit the Fly swap cliff every night (3+ couples at once → 31% swap errors). The swap
 * capacity gate (migration 549) makes that burst safe; spreading makes it cheap: fewer swaps waiting on slots,
 * fewer capacity retries, and heavy slots left free for people using Create at the same moment.
 *
 * RULE (the SQL backstop enqueue_nightly_dreams mirrors it exactly — __tests__/lib/nightlySpread.test.ts):
 *   job i starts at now + i * spacing, spacing = min(spacingS, maxSpreadMin * 60 / (n - 1)) seconds,
 *   so the batch never spreads wider than maxSpreadMin however large the cohort gets. spacingS <= 0 = off
 *   (every job at now, exactly the old behaviour).
 */

/** Offsets in ms for n jobs. */
function spreadOffsetsMs(n, spacingS, maxSpreadMin) {
  if (!n || n < 1) return [];
  const spacing = Number(spacingS);
  if (!Number.isFinite(spacing) || spacing <= 0) return Array.from({ length: n }, () => 0);
  const maxSpreadMs = Math.max(0, Number(maxSpreadMin) || 0) * 60_000;
  const stepMs = n > 1 ? Math.min(spacing * 1000, maxSpreadMs / (n - 1)) : 0;
  return Array.from({ length: n }, (_, i) => Math.round(i * stepMs));
}

/** Give each row a created_at on the spread. Returns new row objects; the input is not mutated. */
function spreadRows(rows, nowMs, spacingS, maxSpreadMin) {
  const offsets = spreadOffsetsMs(rows.length, spacingS, maxSpreadMin);
  return rows.map((r, i) => ({ ...r, created_at: new Date(nowMs + offsets[i]).toISOString() }));
}

module.exports = { spreadOffsetsMs, spreadRows };
