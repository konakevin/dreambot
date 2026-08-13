/**
 * Locks the coverage-sweep classification (NIGHTLY_DREAM_GUARANTEE_PLAN.md L5):
 * which nightly job statuses count as covered vs a gap to re-enqueue, and when a
 * gap rate is "systemic" enough to page vs a routine self-healed one-off.
 */

// Plain CJS lib shared with scripts/nightly-coverage-sweep.js.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { classifyCoverageStatus, isSystemicGap } = require('../../scripts/lib/nightlyCoverage');

describe('classifyCoverageStatus', () => {
  it('completed → covered', () => {
    expect(classifyCoverageStatus('completed')).toBe('covered');
  });
  it('no job row (null/undefined) → missing (never enqueued)', () => {
    expect(classifyCoverageStatus(null)).toBe('missing');
    expect(classifyCoverageStatus(undefined)).toBe('missing');
  });
  it('queued / in_progress → in_flight (leave it, it is rendering)', () => {
    expect(classifyCoverageStatus('queued')).toBe('in_flight');
    expect(classifyCoverageStatus('in_progress')).toBe('in_flight');
  });
  it('dead_letter / failed / nsfw → failed (a gap to reset)', () => {
    for (const s of ['dead_letter', 'failed', 'nsfw', 'canceled']) {
      expect(classifyCoverageStatus(s)).toBe('failed');
    }
  });
});

describe('isSystemicGap (alert gate)', () => {
  it('never alerts below the minimum sample (a quiet hour)', () => {
    expect(isSystemicGap(5, 5)).toBe(false);
    expect(isSystemicGap(9, 9)).toBe(false);
  });
  it('does not alert on a routine one-off self-heal', () => {
    expect(isSystemicGap(1, 100)).toBe(false);
  });
  it('alerts on a systemic spike (> 3% of a real sample)', () => {
    expect(isSystemicGap(10, 100)).toBe(true);
    expect(isSystemicGap(4, 100)).toBe(true);
  });
  it('boundary: exactly at the 3% rate does NOT alert (strictly greater)', () => {
    expect(isSystemicGap(3, 100)).toBe(false);
  });
});
