/**
 * Unit tests for startHydrationLatch (lib/deferredHydration.ts) — the once-only,
 * adaptive-OR-bounded latch behind VerticalPager's deferred hydration.
 *
 * These lock the contract that guarantees the fix can never double-fire or
 * ripple into an unexpected re-render/re-fetch: `onHydrate` runs AT MOST ONCE
 * (even when BOTH the interaction signal and the fallback timer fire), NEVER
 * after cleanup, and cleanup cancels both sources. Dependency-injected
 * scheduler (same pattern as upscalePoll's HqPollDeps) so the pure mechanics
 * are testable without a real InteractionManager or timers.
 *
 * Context: hydration was wedging the feed at one card after idle because
 * `runAfterInteractions` never fired on a leaked handle (Kevin 2026-07-22).
 */

import { startHydrationLatch, type HydrationScheduler } from '@/lib/deferredHydration';

/** A controllable scheduler: capture the interaction + timer callbacks so the
 *  test fires them in any order (or not at all), and record cancels. */
function makeScheduler() {
  let interactionCb: (() => void) | null = null;
  let timerCb: (() => void) | null = null;
  let timerMs = -1;
  const cancels = { interaction: 0, timer: 0 };

  const scheduler: HydrationScheduler = {
    runAfterInteractions: (cb) => {
      interactionCb = cb;
      return { cancel: () => (cancels.interaction += 1) };
    },
    setTimer: (cb, ms) => {
      timerCb = cb;
      timerMs = ms;
      return 'timer-id';
    },
    clearTimer: () => (cancels.timer += 1),
  };

  return {
    scheduler,
    cancels,
    fireInteractions: () => interactionCb?.(),
    fireTimer: () => timerCb?.(),
    get timerMs() {
      return timerMs;
    },
  };
}

it('fires onHydrate once via the interaction signal (healthy fast path)', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  startHydrationLatch(onHydrate, 600, s.scheduler);

  s.fireInteractions();
  expect(onHydrate).toHaveBeenCalledTimes(1);
});

it('fires onHydrate once via the timer when interactions never settle (wedged manager)', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  startHydrationLatch(onHydrate, 600, s.scheduler);

  // Interactions never fire (leaked handle) — the timer alone recovers it.
  s.fireTimer();
  expect(onHydrate).toHaveBeenCalledTimes(1);
  expect(s.timerMs).toBe(600);
});

it('fires onHydrate EXACTLY once when BOTH sources fire (the no-double guard)', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  startHydrationLatch(onHydrate, 600, s.scheduler);

  // Interaction wins, then the timer fires too — must NOT double-fire.
  s.fireInteractions();
  s.fireTimer();
  expect(onHydrate).toHaveBeenCalledTimes(1);
});

it('fires exactly once with both sources in the OTHER order too', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  startHydrationLatch(onHydrate, 600, s.scheduler);

  s.fireTimer();
  s.fireInteractions();
  expect(onHydrate).toHaveBeenCalledTimes(1);
});

it('never fires after cleanup, and cleanup cancels BOTH sources', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  const cleanup = startHydrationLatch(onHydrate, 600, s.scheduler);

  cleanup();
  // A late/racing callback that slips past cancellation must be a no-op.
  s.fireInteractions();
  s.fireTimer();

  expect(onHydrate).not.toHaveBeenCalled();
  expect(s.cancels.interaction).toBe(1);
  expect(s.cancels.timer).toBe(1);
});

it('cleanup after firing does not re-invoke or throw (idempotent close)', () => {
  const onHydrate = jest.fn();
  const s = makeScheduler();
  const cleanup = startHydrationLatch(onHydrate, 600, s.scheduler);

  s.fireInteractions(); // fired once
  expect(() => cleanup()).not.toThrow();
  s.fireTimer(); // post-cleanup callback — still a no-op
  expect(onHydrate).toHaveBeenCalledTimes(1);
});
