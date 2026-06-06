/**
 * Responsive layout utilities — scale designs proportionally between the
 * smallest supported iPhone (SE 3rd gen, 667pt) and the largest (iPhone 17
 * Pro Max, 932pt), with optional iPad support.
 *
 * All design-time values should be authored against the BASE_HEIGHT /
 * BASE_WIDTH constants below (iPhone 14 — 844 × 390pt). The scale functions
 * convert those values to the actual device.
 *
 * Naming convention (Kevin 2026-06-05): clarity over brevity. Helpers are
 * spelled out — `verticalScale(16)`, not `vs(16)` — because these helpers
 * spread across ~50 files and ambiguous two-letter names cost more in
 * read-time than they save in typing.
 *
 * Usage:
 *   import { verticalScale, fontScale, useDeviceClass } from '@/lib/responsive';
 *   const styles = StyleSheet.create({
 *     title: { fontSize: fontScale(24), marginBottom: verticalScale(16) },
 *   });
 *
 * For conditional sizing (hide a heavy element on SE, swap layout on iPad):
 *   const { isSmall, isTablet } = useDeviceClass();
 *   return isSmall ? <Compact /> : <Full />;
 */

import { useWindowDimensions, Dimensions } from 'react-native';

const BASE_HEIGHT = 844; // iPhone 14
const BASE_WIDTH = 390;

const initial = Dimensions.get('window');

/**
 * Screen dimensions captured at module load. Safe for portrait-locked iPhone
 * apps. NOT safe for split-screen iPad — use `useDeviceClass()` or
 * `useWindowDimensions()` directly in components that may resize at runtime.
 */
export const screen = { width: initial.width, height: initial.height };

/** Height percentage — converts a % of screen height to points. */
export function heightPercent(percent: number): number {
  return Math.round((percent / 100) * initial.height);
}

/** Width percentage — converts a % of screen width to points. */
export function widthPercent(percent: number): number {
  return Math.round((percent / 100) * initial.width);
}

/**
 * Scale a vertical design-time value (paddings, margins, fixed heights,
 * mascot dimensions) proportionally to the current device height.
 *
 * iPhone SE (667pt) → 79% of design value.
 * iPhone 14 (844pt) → 100% (1.0).
 * iPhone 17 Pro Max (932pt) → 110%.
 *
 * Use this for: vertical paddings, margins, gaps, fixed heights, mascot or
 * hero-image dimensions, anything that should shrink to fit smaller screens.
 */
export function verticalScale(size: number): number {
  return Math.round((size / BASE_HEIGHT) * initial.height);
}

/**
 * Scale a horizontal design-time value (rarely needed — most horizontal
 * sizing should use flex / `widthPercent`). The few cases that benefit:
 * fixed-width avatars in tight rows, location-chip widths, comment-composer
 * width on narrow phones.
 *
 * iPhone SE (375pt) → 96% of design value.
 * iPhone 14 (390pt) → 100%.
 * iPhone 17 Pro Max (440pt) → 113%.
 */
export function horizontalScale(size: number): number {
  return Math.round((size / BASE_WIDTH) * initial.width);
}

/**
 * Font scale — proportional like verticalScale but with a tighter curve so
 * headlines don't shrink to unreadable sizes on small screens or balloon
 * on tall screens. Clamped to 85%–110% of the base size.
 *
 * Use `fontScale()` for `fontSize` and `lineHeight` values.
 * Use `verticalScale()` for paddings/margins around them.
 */
export function fontScale(size: number): number {
  const ratio = initial.height / BASE_HEIGHT;
  const clampedRatio = Math.max(0.85, Math.min(1.1, ratio));
  return Math.round(size * clampedRatio);
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Scale a vertical design-time value with explicit min/max bounds — cleaner
 * than `clamp(verticalScale(N), min, max)` at every call site. Use for hero
 * elements that should never collapse below a presence floor or grow past
 * a "dominating" ceiling.
 *
 *   const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);
 */
export function verticalScaleClamped(size: number, min: number, max: number): number {
  return clamp(verticalScale(size), min, max);
}

/**
 * Spacing scale — token alias for `verticalScale(N)` at conventional
 * step sizes. Cuts call-site noise when the design follows the standard
 * 8/12/16/24/32 step pattern.
 *
 *   marginBottom: space.md  // === verticalScale(16)
 *
 * Computed once at module load. For runtime-reactive sizing use the
 * helpers directly inside the component.
 */
export const space = {
  xs: verticalScale(8),
  sm: verticalScale(12),
  md: verticalScale(16),
  lg: verticalScale(24),
  xl: verticalScale(32),
};

/**
 * Device class breakpoints. Use thresholds that map to real device families,
 * not arbitrary numbers.
 *
 * Phone height tiers:
 *   isSmall  — height < 700pt  (iPhone SE 3rd gen = 667pt)
 *   isLarge  — height >= 900pt (iPhone Pro Max class = 932pt)
 *
 * Tablet detection uses width (more reliable across portrait + landscape
 * since iPad always exceeds iPhone width regardless of orientation):
 *   isTablet — width >= 600pt  (iPad mini portrait = 744pt; iPhone Pro Max = 440pt)
 */
const SMALL_HEIGHT = 700;
const LARGE_HEIGHT = 900;
const TABLET_WIDTH = 600;

export interface DeviceClass {
  /** Height < 700pt — iPhone SE-class. Hide heavy decorative elements; use compact layouts. */
  isSmall: boolean;
  /** Height >= 900pt — iPhone Pro Max-class. Optional: spread content to take advantage. */
  isLarge: boolean;
  /** Width >= 600pt — iPad. Switch to multi-column layouts; bigger margins. */
  isTablet: boolean;
  /** Current screen height in points (reactive — updates on resize). */
  height: number;
  /** Current screen width in points (reactive — updates on resize). */
  width: number;
}

/**
 * Reactive device class hook. Updates on split-screen resize (iPad) and
 * orientation change. Components that need conditional layouts based on
 * device size should use this rather than reading `screen.*`.
 */
export function useDeviceClass(): DeviceClass {
  const { width, height } = useWindowDimensions();
  return {
    isSmall: height < SMALL_HEIGHT,
    isLarge: height >= LARGE_HEIGHT,
    isTablet: width >= TABLET_WIDTH,
    height,
    width,
  };
}
