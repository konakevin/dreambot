/**
 * Equal-jitter backoff. Returns a random delay in [ms/2, ms] so that N renders
 * which fail at the same instant (a provider brownout under burst) DON'T retry
 * in lockstep and re-throttle the provider — the classic thundering-herd fix.
 *
 * Equal jitter (half fixed floor + half random) keeps a minimum wait while still
 * spreading the herd; full jitter (0..ms) could retry too eagerly. jitter(0)===0
 * so callers passing retry_after:0 (and the tests that mock it) stay instant.
 */
export function jitter(ms: number): number {
  if (ms <= 0) return 0;
  return Math.round(ms / 2 + Math.random() * (ms / 2));
}
