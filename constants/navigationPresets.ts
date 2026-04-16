/**
 * Navigation screen presets — standardized Stack.Screen options for every
 * navigation context in the app. Use these instead of per-screen ad-hoc
 * configuration so dismissal behavior stays consistent.
 *
 * USAGE
 *   import { SCREEN_PRESETS } from '@/constants/navigationPresets';
 *   <Stack.Screen name="photo/[id]" options={SCREEN_PRESETS.MODAL_SWIPEABLE} />
 *
 * If a screen needs to override one thing, spread and override:
 *   options={{ ...SCREEN_PRESETS.MODAL_SWIPEABLE, headerShown: true }}
 */

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const SCREEN_PRESETS = {
  /**
   * Card overlay with full horizontal swipe-back from the right edge.
   * For content-viewing screens: photo detail, user profile, sparkle store, etc.
   */
  MODAL_SWIPEABLE: {
    presentation: 'card',
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
    headerShown: false,
  } satisfies NativeStackNavigationOptions,

  /**
   * iOS-style sheet from the bottom with swipe-down-to-dismiss.
   * For contextual actions: comments, share options, etc.
   */
  SHEET_DISMISSIBLE: {
    presentation: 'formSheet',
    gestureEnabled: true,
    headerShown: false,
  } satisfies NativeStackNavigationOptions,

  /**
   * Card overlay where swipe-back is explicitly disabled.
   * For screens that must be completed before leaving (payment, destructive confirm, etc.).
   */
  MODAL_LOCKED: {
    presentation: 'card',
    gestureEnabled: false,
    headerShown: false,
  } satisfies NativeStackNavigationOptions,

  /**
   * Linear flow where back-swipe is disabled to prevent losing state.
   * For onboarding, dream loading, dream reveal, etc.
   */
  FLOW_LOCKED: {
    gestureEnabled: false,
    headerShown: false,
    animation: 'slide_from_right',
  } satisfies NativeStackNavigationOptions,

  /**
   * Transparent overlay (can see the screen behind it).
   * For custom fade-in overlays like share sheets that fade rather than slide.
   */
  OVERLAY_TRANSPARENT: {
    presentation: 'transparentModal',
    gestureEnabled: true,
    animation: 'fade',
    headerShown: false,
  } satisfies NativeStackNavigationOptions,
};
