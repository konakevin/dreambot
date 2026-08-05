/**
 * FAILSAFE for the 2026-08-05 incident: the bot health monitor had a FIXED 18h stale
 * threshold. When fleet cadence dropped 3×/day → 1×/day, bots posting fine (~24h apart)
 * tripped the 18h alarm — a false "bots broke" CI failure. Root cause: a threshold that
 * did NOT scale with posts_per_day.
 *
 * This test LOCKS the invariant so it can never regress silently: for EVERY supported
 * cadence, the monitor's stale threshold must exceed the bot's own posting interval
 * (with room for dispatcher jitter). If anyone reintroduces a fixed/too-tight threshold,
 * CI goes red BEFORE it ships. This is the "can't be ignored" check.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { expectedIntervalHours, staleThresholdHours } = require('../../scripts/lib/botCadence');

// bot_schedules CHECK: posts_per_day BETWEEN 1 AND 96 (migration 177).
const SUPPORTED_CADENCES = [1, 2, 3, 4, 6, 8, 12, 24, 48, 96];

describe('botCadence — the monitor threshold can never false-alarm an on-schedule bot', () => {
  it.each(SUPPORTED_CADENCES)(
    'posts_per_day=%i: stale threshold > expected posting interval',
    (pd: number) => {
      // THE INVARIANT. A bot posting exactly on cadence must NEVER be flagged stale.
      expect(staleThresholdHours(pd)).toBeGreaterThan(expectedIntervalHours(pd));
    }
  );

  it('a bot posting on schedule survives a realistic dispatcher delay without alarming', () => {
    // The */15 dispatcher is throttled by GitHub to ~every 2h, with gaps up to ~6h.
    // interval + that jitter must still stay under the threshold.
    const JITTER_H = 6;
    for (const pd of SUPPORTED_CADENCES) {
      expect(expectedIntervalHours(pd) + JITTER_H).toBeLessThanOrEqual(staleThresholdHours(pd));
    }
  });

  it('REGRESSION LOCK: the old fixed 18h WOULD have failed this at 1×/day (the actual bug)', () => {
    const OLD_FIXED_THRESHOLD_H = 18;
    // 18h < the 24h interval of a 1×/day bot → guaranteed false alarm. This is the
    // exact failure; if someone hardcodes a threshold like this again, they'll be
    // pointed straight here.
    expect(OLD_FIXED_THRESHOLD_H).toBeLessThan(expectedIntervalHours(1));
  });

  it('expectedIntervalHours: 1→24h, 2→12h, 3→8h, 24→1h; guards bad input', () => {
    expect(expectedIntervalHours(1)).toBe(24);
    expect(expectedIntervalHours(2)).toBe(12);
    expect(expectedIntervalHours(3)).toBe(8);
    expect(expectedIntervalHours(24)).toBe(1);
    expect(expectedIntervalHours(0)).toBe(24); // 0/null treated as 1×/day, no divide-by-zero
    expect(expectedIntervalHours(null)).toBe(24);
  });

  it('threshold grows as cadence slows (monotonic in the interval)', () => {
    expect(staleThresholdHours(1)).toBeGreaterThan(staleThresholdHours(2));
    expect(staleThresholdHours(2)).toBeGreaterThan(staleThresholdHours(4));
  });
});
