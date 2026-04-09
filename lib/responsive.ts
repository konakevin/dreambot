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
 */
const BASE_HEIGHT = 844;
export function vs(size: number): number {
  return Math.round((size / BASE_HEIGHT) * height);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
