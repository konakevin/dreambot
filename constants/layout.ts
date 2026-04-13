/**
 * Shared layout constants for consistent spacing, sizing, and clearances
 * across all screens. Use these instead of hardcoding magic numbers.
 */

/** Standard horizontal padding for headers and content areas */
export const HEADER_H_PAD = 16;

/** Standard vertical padding for inline headers */
export const HEADER_V_PAD = 12;

/** Back/close icon size — standardized across all screens */
export const NAV_ICON_SIZE = 24;

/** hitSlop applied to all back/close/action buttons */
export const NAV_HIT_SLOP = 12;

/** Floating tab bar height (icon area, not including safe area) */
export const TAB_BAR_HEIGHT = 49;

/** Padding below content to clear the floating tab bar + breathing room */
export const TAB_BAR_CLEARANCE = TAB_BAR_HEIGHT + 16;
