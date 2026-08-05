/**
 * botCadence.js — the SINGLE SOURCE for bot posting cadence math: "how often should
 * a bot post" and "when is it genuinely stale". Both the fan-out (posts_per_day
 * slots) and the health monitor derive their numbers from HERE, so changing a bot's
 * cadence can never silently desync the monitor.
 *
 * WHY THIS EXISTS (2026-08-05 incident): the health monitor had a FIXED 18h stale
 * threshold. When bot cadence dropped 3×/day → 1×/day, a bot posting fine (once every
 * ~24h) started tripping the 18h alarm — a false CI failure that looked like "bots
 * broke". The fix is to DERIVE the threshold from posts_per_day, and the invariant
 * "an on-schedule bot is never flagged stale" is LOCKED by __tests__/lib/botCadence.test.ts.
 *
 * Pure + deterministic; unit-tested.
 */

/** Hours between posts for a bot posting N times/day. */
function expectedIntervalHours(postsPerDay) {
  return 24 / Math.max(1, postsPerDay || 1);
}

/**
 * The staleness threshold for the health monitor: a bot is "stale" only once it
 * exceeds its OWN posting interval by a grace margin that absorbs dispatcher jitter
 * (GitHub throttles the every-15-min bots-dispatcher to ~every 2h, gaps up to ~6h).
 *
 * INVARIANT (locked by the test): this MUST be > expectedIntervalHours for every
 * supported cadence — otherwise a bot posting exactly on schedule false-alarms.
 */
function staleThresholdHours(postsPerDay, graceHours = 8) {
  return expectedIntervalHours(postsPerDay) + graceHours;
}

module.exports = { expectedIntervalHours, staleThresholdHours };
