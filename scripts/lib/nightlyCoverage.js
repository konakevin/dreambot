/**
 * nightlyCoverage.js — pure classification for the nightly coverage sweep (L5,
 * NIGHTLY_DREAM_GUARANTEE_PLAN.md). Kept out of the script so the invariants
 * (what counts as covered vs a gap, when to alert) are unit-tested.
 */

const IN_FLIGHT = new Set(['queued', 'in_progress']);

/**
 * Classify a coverage-due user's nightly dream_queue status into a bucket.
 *   completed              → 'covered'
 *   null/undefined (no row)→ 'missing'   (never enqueued → gap, insert)
 *   queued | in_progress   → 'in_flight' (rendering now → leave it)
 *   anything else          → 'failed'    (dead_letter/failed/nsfw → gap, reset)
 */
function classifyCoverageStatus(status) {
  if (status === 'completed') return 'covered';
  if (status == null) return 'missing';
  if (IN_FLIGHT.has(status)) return 'in_flight';
  return 'failed';
}

/**
 * Is the gap rate a SYSTEMIC problem worth a loud alert (email), vs routine
 * self-healed one-offs? Requires a minimum sample so a tiny/quiet hour with one
 * transient gap doesn't false-alarm.
 */
function isSystemicGap(gaps, due, rate = 0.03, minSample = 10) {
  if (!due || due < minSample) return false;
  return gaps / due > rate;
}

module.exports = { classifyCoverageStatus, isSystemicGap, IN_FLIGHT };
