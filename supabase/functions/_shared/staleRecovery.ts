/**
 * Stale-job recovery decision — pure, so the invariant is unit-lockable.
 *
 * A dream_queue job stuck `in_progress` past the stale threshold means its render
 * isolate almost certainly HARD-died (a 546 WORKER_RESOURCE_LIMIT / OOM / 150s
 * wall-clock kill SKIPS every catch), so neither the render nor the worker
 * recorded a terminal state. The worker's stale sweep recovers it.
 *
 * THE INVARIANT THIS LOCKS: a hard-kill IS a real attempt, so recovery ALWAYS
 * bumps attempt_count and dead-letters once attempts are exhausted. The bug it
 * guards against: the original bulk reset re-queued stale jobs WITHOUT bumping
 * the count, so a job that reliably kills its isolate (a pathologically slow
 * render, a bad cast photo) looped in the sweep FOREVER — never dead-lettering,
 * never refunding the user, and rotating through a concurrency slot every sweep.
 */

export const MAX_ATTEMPTS_BEFORE_DEAD_LETTER = 5;

export interface StaleDecision {
  /** attempt_count AFTER this recovery (always the old count + 1). */
  nextAttempt: number;
  /** true ⇒ dead-letter (refund + notify); false ⇒ re-queue with backoff. */
  dead: boolean;
}

export function decideStaleRecovery(
  attemptCount: number,
  maxAttempts: number = MAX_ATTEMPTS_BEFORE_DEAD_LETTER
): StaleDecision {
  const nextAttempt = attemptCount + 1;
  return { nextAttempt, dead: nextAttempt >= maxAttempts };
}
