/**
 * Global swipe/gesture constants — applied everywhere for consistent feel.
 * Change these values once and they propagate to all cards and screens.
 */

/** Distance in points before a swipe is considered intentional */
export const SWIPE_THRESHOLD = 80;

/** Active offset before gesture activates (prevents accidental triggers) */
export const ACTIVE_OFFSET = 15;

/** Fail offset on the opposing axis (lets vertical scroll through) */
export const FAIL_OFFSET = 10;

/** Resistance multiplier when swiping in the allowed direction (0-1) */
export const SWIPE_RESISTANCE = 0.6;

/** Resistance multiplier when swiping against the allowed direction */
export const COUNTER_RESISTANCE = 0.1;

/** Spring config for snapping back to origin */
export const SNAP_SPRING = { damping: 20, stiffness: 200 };

/** Duration (ms) for the slide-off animation when threshold is passed */
export const SLIDE_OFF_DURATION = 200;

/** Deceleration rate for vertical paging feeds */
export const PAGING_DECELERATION = 'fast' as const;
