/**
 * Global swipe/gesture constants — tuned for easy, fluid navigation.
 * Everything should feel like a quick flick, not a deliberate drag.
 */

/** Distance before a swipe triggers an action */
export const SWIPE_THRESHOLD = 40;

/** Active offset before gesture activates */
export const ACTIVE_OFFSET = 12;

/** Fail offset on the opposing axis */
export const FAIL_OFFSET = 20;

/** Spring config for snapping back */
export const SNAP_SPRING = { damping: 20, stiffness: 200 };

/** Duration for slide-off animations */
export const SLIDE_OFF_DURATION = 150;
