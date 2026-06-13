/**
 * Unified gesture + animation constants for all swipes across the app.
 *
 * One source of truth. Every distance, velocity, and timing is here — no more
 * per-screen thresholds drifting out of sync.
 *
 * UNITS
 *   distances: pixels
 *   velocities: pixels/second (unified — no more mixing m/s with px/sec)
 *   durations: milliseconds
 */

// ── Distance thresholds ─────────────────────────────────────────────────

/** How far the user must drag horizontally before a swipe-back dismisses */
export const SWIPE_BACK_DISTANCE = 80;

/** How far the user must drag down before a sheet dismiss fires */
export const SWIPE_DISMISS_DISTANCE = 40;

/** How far the user must drag left on a card before navigating to profile */
export const SWIPE_PROFILE_DISTANCE = 25;

/**
 * How far the gesture must travel on its primary axis before it activates.
 * Anything below this is absorbed by underlying scrollers.
 *
 * Now used by the VERTICAL sheet-dismiss gestures (useStandardSheetDismiss /
 * FilterPickerSheet). The horizontal feed-card swipes (swipe-to-profile,
 * swipe-back) moved to ratio-based activation — see SWIPE_DOMINANCE_RATIO and
 * hooks/gestures/horizontalSwipeDecision.ts.
 */
export const ACTIVE_OFFSET = 20;

/**
 * How far the gesture can travel on its opposing axis before it fails.
 * Keeps vertical-scroll and horizontal-swipe from getting confused — a drag
 * that drifts past this on the cross axis cancels the gesture immediately.
 * (Vertical sheet gestures only; horizontal card swipes use the ratio gate.)
 */
export const FAIL_OFFSET = 10;

// ── Ratio-based directional activation (feed card swipe-to-profile + swipe-back) ──
// These replace the absolute ACTIVE_OFFSET/FAIL_OFFSET arbitration for the
// horizontal card gestures that fight the vertical feed scroll. The gesture
// activates by which axis DOMINATES, not by fixed distance — see
// hooks/gestures/horizontalSwipeDecision.ts. (ACTIVE_OFFSET/FAIL_OFFSET stay
// in use by the vertical sheet-dismiss gesture.)

/** Px the dominant axis must clear before a horizontal swipe commits/cancels. */
export const SWIPE_MIN_ACTIVATION = 12;

/**
 * How much horizontal must out-pace vertical to count as a horizontal swipe.
 * 1.2 = a deliberate horizontal drag wins even with some vertical arc, while a
 * vertical swipe (|dy| > |dx|) never activates. Lower = easier horizontal /
 * more accidental triggers; higher = stricter horizontal / harder to trigger.
 */
export const SWIPE_DOMINANCE_RATIO = 1.2;

/** @deprecated Use SWIPE_DISMISS_DISTANCE for clarity */
export const SWIPE_THRESHOLD = SWIPE_DISMISS_DISTANCE;

// ── Velocity thresholds ─────────────────────────────────────────────────

/** Pixels/second. Above this, the gesture fires regardless of distance */
export const VELOCITY_THRESHOLD = 500;

// ── Animations ──────────────────────────────────────────────────────────

/** Spring config for snapping a gesture back to its resting state */
export const SNAP_SPRING = { damping: 20, stiffness: 200, mass: 1 };

/** Duration (ms) of the final slide-off when a swipe triggers a nav dismiss */
export const SLIDE_OFF_DURATION = 200;

/** Duration (ms) of the pinch-reset animation on card release */
export const PINCH_RESET_DURATION = 200;

// ── Pinch ───────────────────────────────────────────────────────────────

export const PINCH_MIN_SCALE = 1;
export const PINCH_MAX_SCALE = 5;
