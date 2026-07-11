/**
 * Locks the equal-jitter contract used by every render-path backoff: bounded to
 * [ms/2, ms] (spreads a retry herd but keeps a floor) and jitter(0)===0 (so
 * retry_after:0 and the instant-sleep test paths stay instant).
 */

import { jitter } from '@engine/jitter';

it('jitter(0) === 0 (instant paths stay instant)', () => {
  expect(jitter(0)).toBe(0);
  expect(jitter(-100)).toBe(0);
});

it('jitter bounds every sample to [ms/2, ms]', () => {
  for (let i = 0; i < 500; i++) {
    const j = jitter(1000);
    expect(j).toBeGreaterThanOrEqual(500);
    expect(j).toBeLessThanOrEqual(1000);
  }
});

it('jitter actually varies (not a constant)', () => {
  const samples = new Set(Array.from({ length: 50 }, () => jitter(1000)));
  expect(samples.size).toBeGreaterThan(1);
});
