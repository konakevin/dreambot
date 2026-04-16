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
 */
export const ACTIVE_OFFSET = 12;

/**
 * How far the gesture can travel on its opposing axis before it fails.
 * Keeps vertical-scroll and horizontal-swipe from getting confused.
 */
export const FAIL_OFFSET = 20;

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
