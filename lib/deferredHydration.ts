/**
 * deferredHydration — the "render the active item now, expand the window once
 * things settle" latch, extracted from VerticalPager so its corner cases are
 * unit-testable (the fast-jest lane can't drive a real InteractionManager).
 *
 * WHY IT EXISTS: a virtualized pager renders ONLY the active card until
 * hydration flips, keeping the initial open fast. Hydration was set solely by
 * `InteractionManager.runAfterInteractions`, whose callback NEVER fires if a
 * leaked interaction handle is stuck (common after idle/background) — which
 * wedged the feed at one card, un-swipeable, until an app restart (Kevin
 * 2026-07-22). The latch fires on the FIRST of {interactions settle, a fallback
 * timer}, so hydration is guaranteed.
 *
 * CONTRACT (the invariants the tests lock):
 *   1. `onHydrate` fires AT MOST ONCE, even if BOTH sources fire.
 *   2. `onHydrate` NEVER fires after cleanup (no setState-on-unmounted, and no
 *      surprise re-render that could ripple into a re-fetch).
 *   3. cleanup cancels BOTH the interaction handle and the timer.
 * Hydration only controls which already-loaded cards are MOUNTED — it triggers
 * no fetch/refresh — so "at most once" is belt-and-suspenders, not correctness-
 * critical for data. But locking it keeps the latch from ever rippling.
 */

import { useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';

export interface HydrationScheduler {
  /** Run `cb` after interactions settle; returns a cancelable handle. */
  runAfterInteractions: (cb: () => void) => { cancel: () => void };
  /** Schedule `cb` after `ms`; returns a timer id. */
  setTimer: (cb: () => void, ms: number) => unknown;
  /** Cancel a timer created by `setTimer`. */
  clearTimer: (id: unknown) => void;
}

/**
 * Start a once-only hydration latch. `onHydrate` runs on the FIRST of:
 * interactions settling OR the `fallbackMs` timer elapsing. Returns a cleanup
 * function that cancels both sources and guarantees `onHydrate` can never fire
 * afterward.
 */
export function startHydrationLatch(
  onHydrate: () => void,
  fallbackMs: number,
  scheduler: HydrationScheduler
): () => void {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onHydrate();
  };
  const handle = scheduler.runAfterInteractions(finish);
  const timer = scheduler.setTimer(finish, fallbackMs);
  return () => {
    // Latch closed: any late/racing callback that slips past cancellation
    // becomes a no-op (belt-and-suspenders against setState-after-unmount).
    done = true;
    handle.cancel();
    scheduler.clearTimer(timer);
  };
}

/**
 * React hook wrapping {@link startHydrationLatch} with the real RN scheduler.
 * Returns `false` until the FIRST of {interactions settle, `fallbackMs`} —
 * then `true`, permanently for this mount. The effect runs ONCE (empty deps,
 * `fallbackMs` read at mount) so hydration can't re-fire or ripple.
 */
export function useDeferredHydration(fallbackMs = 600): boolean {
  const [hydrated, setHydrated] = useState(false);
  const fallbackRef = useRef(fallbackMs);
  useEffect(() => {
    return startHydrationLatch(() => setHydrated(true), fallbackRef.current, {
      runAfterInteractions: (cb) => InteractionManager.runAfterInteractions(cb),
      setTimer: (cb, ms) => setTimeout(cb, ms),
      clearTimer: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
    });
  }, []);
  return hydrated;
}
