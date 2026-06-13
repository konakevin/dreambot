/**
 * horizontalSwipeDecision — ratio-based directional gate for horizontal swipes
 * that must coexist with a vertical scroller (the full-screen feed).
 *
 * The problem with absolute activeOffsetX / failOffsetY thresholds: one fixed
 * pixel number can't be both "easy to trigger a deliberate horizontal swipe"
 * AND "never trip on the sideways drift of a vertical swipe". This decides by
 * which axis DOMINATES (an angle), independent of how far the finger travelled:
 *
 *   - vertical clearly winning      → 'fail'        (let the FlatList scroll)
 *   - horizontal clears minDistance
 *     AND out-paces vertical ×ratio → 'activate'    (run the nav/back gesture)
 *   - neither resolved yet          → 'undetermined' (keep waiting)
 *
 * Used from RNGH manualActivation Pan worklets (onTouchesMove) in
 * useCardGestures (swipe-left-to-profile) and useStandardSwipeBack
 * (swipe-right-to-back). Marked 'worklet' so it runs on the UI thread; it's a
 * pure function so it also runs as plain JS under jest (the directive is a
 * no-op there) — see __tests__/lib/horizontalSwipeDecision.test.ts.
 */

export type SwipeDirection = 'left' | 'right' | 'horizontal';
export type SwipeDecision = 'activate' | 'fail' | 'undetermined';

export interface HorizontalSwipeDecisionInput {
  /** Cumulative horizontal travel from gesture start, px (right = +). */
  dx: number;
  /** Cumulative vertical travel from gesture start, px (down = +). */
  dy: number;
  /** Px the dominant axis must clear before we commit to a decision. */
  minDistance: number;
  /** |dx| must be ≥ ratio × |dy| to count as a horizontal swipe (>1 = stricter). */
  ratio: number;
  /** Which horizontal direction activates ('horizontal' = either way). */
  direction: SwipeDirection;
}

export function horizontalSwipeDecision({
  dx,
  dy,
  minDistance,
  ratio,
  direction,
}: HorizontalSwipeDecisionInput): SwipeDecision {
  'worklet';
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  // Vertical must clearly dominate (by the same ratio) to fail → scroll. Using
  // the ratio symmetrically (not a mere |dy| >= |dx| tie) is what stops a
  // deliberate horizontal swipe from being stolen by the scroll the instant its
  // natural vertical arc edges ahead early in the drag. Anything inside the
  // ratio band on both axes stays 'undetermined' until one axis pulls clear.
  if (ady >= minDistance && ady >= ratio * adx) return 'fail';

  // Horizontal must clear the activation distance AND out-pace vertical by the
  // ratio, so a near-vertical flick with incidental sideways drift won't fire.
  if (adx >= minDistance && adx >= ratio * ady) {
    const sign: SwipeDirection = dx < 0 ? 'left' : 'right';
    if (direction === 'horizontal' || direction === sign) return 'activate';
    // Clear horizontal but the wrong way for a directional gesture (e.g. a
    // rightward drag on a left-only swipe) → fail, don't sit undetermined.
    return 'fail';
  }

  return 'undetermined';
}
