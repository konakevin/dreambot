/**
 * Responsive layout utilities.
 *
 * All values scale proportionally between iPhone SE (667pt) and
 * iPhone 16 Pro Max (932pt). The app is portrait-only so only
 * vertical scaling matters.
 *
 * Usage:
 *   import { hp, wp, screen } from '@/lib/responsive';
 *   style={{ height: hp(30), paddingBottom: hp(5) }}
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/** Screen dimensions (static — safe for portrait-only apps) */
export const screen = { width, height };

/** Height percentage — converts a % of screen height to points */
export function hp(percent: number): number {
  return Math.round((percent / 100) * height);
}

/** Width percentage — converts a % of screen width to points */
export function wp(percent: number): number {
  return Math.round((percent / 100) * width);
}

/**
 * Scale a design-time value (designed at 844pt height, iPhone 14)
 * to the current device proportionally.
 *
 * iPhone SE (667pt) → 79% of design value. iPhone 17 Pro Max (932pt)
 * → 110% of design value. Best for paddings, margins, mascot
 * dimensions, and other vertical layout values that should shrink
 * to fit smaller screens.
 */
const BASE_HEIGHT = 844;
export function vs(size: number): number {
  return Math.round((size / BASE_HEIGHT) * height);
}

/**
 * Font scale — proportional like vs() but with a tighter curve so
 * headlines don't shrink to unreadable sizes on small screens or
 * balloon on tall screens. Clamped to 85%–110% of the base size.
 *
 * Use `fs()` for fontSize values. Use `vs()` for paddings/margins
 * around them.
 */
export function fs(size: number): number {
  const ratio = height / BASE_HEIGHT;
  const clampedRatio = Math.max(0.85, Math.min(1.1, ratio));
  return Math.round(size * clampedRatio);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Scale a design-time value with explicit min/max bounds. Cleaner than
 * `clamp(vs(N), min, max)` at every call site.
 */
export function vsClamp(size: number, min: number, max: number): number {
  return clamp(vs(size), min, max);
}
