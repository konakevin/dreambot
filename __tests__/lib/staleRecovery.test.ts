import { decideStaleRecovery, MAX_ATTEMPTS_BEFORE_DEAD_LETTER } from '@engine/staleRecovery';

// Regression lock for the queue-worker stale-recovery invariant. The bug this
// guards: the original bulk reset re-queued a hard-killed (546/OOM/wall-clock)
// in_progress job WITHOUT bumping attempt_count, so a job that reliably kills its
// isolate looped in the sweep forever — never dead-lettering, never refunding.
describe('decideStaleRecovery', () => {
  it('ALWAYS bumps attempt_count (a hard-kill is a real attempt)', () => {
    expect(decideStaleRecovery(0).nextAttempt).toBe(1);
    expect(decideStaleRecovery(1).nextAttempt).toBe(2);
    expect(decideStaleRecovery(4).nextAttempt).toBe(5);
  });

  it('re-queues while attempts remain', () => {
    for (let a = 0; a < MAX_ATTEMPTS_BEFORE_DEAD_LETTER - 1; a++) {
      expect(decideStaleRecovery(a).dead).toBe(false);
    }
  });

  it('dead-letters once the bumped count reaches the max (so it cannot loop forever)', () => {
    // attempt_count 4 → nextAttempt 5 → dead: the 5th stale recovery terminates.
    expect(decideStaleRecovery(MAX_ATTEMPTS_BEFORE_DEAD_LETTER - 1).dead).toBe(true);
    expect(decideStaleRecovery(MAX_ATTEMPTS_BEFORE_DEAD_LETTER).dead).toBe(true);
    expect(decideStaleRecovery(99).dead).toBe(true);
  });

  it('converges: repeated stale recoveries reach dead within MAX_ATTEMPTS sweeps', () => {
    let attempt = 0;
    let sweeps = 0;
    // Simulate a pathological job that hard-kills its isolate every time.
    for (; sweeps < 100; sweeps++) {
      const { nextAttempt, dead } = decideStaleRecovery(attempt);
      attempt = nextAttempt;
      if (dead) break;
    }
    expect(sweeps + 1).toBe(MAX_ATTEMPTS_BEFORE_DEAD_LETTER);
  });

  it('honors a caller-supplied max', () => {
    expect(decideStaleRecovery(1, 3).dead).toBe(false);
    expect(decideStaleRecovery(2, 3).dead).toBe(true);
  });
});
