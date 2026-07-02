/**
 * useCardGestures — composed pinch-zoom-and-drag + swipe-left-to-profile.
 *
 * For fullscreen image cards (feed, photo detail, etc). Bundles the gestures
 * that must coexist on a dream card:
 *   1. Pinch to zoom (1x – 5x, auto-reset on release). The image point under
 *      the fingers TRACKS them: spreading zooms, sliding both fingers drags
 *      the zoomed image around (clamped to image boundaries) — one gesture,
 *      like Instagram's peek zoom.
 *   2. Single-finger swipe-left to profile (disabled while zoomed)
 *
 * USAGE
 *   const {
 *     gesture,
 *     imageTransformStyle,
 *     isZoomed,
 *   } = useCardGestures({ onSwipeLeft: () => nav.push('/user/[id]') });
 *
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View style={StyleSheet.absoluteFill}>
 *         <Animated.Image source={...} style={[styles.image, imageTransformStyle]} />
 *       </Animated.View>
 *     </GestureDetector>
 *   );
 *
 * COMPOSITION WITH SWIPE-BACK
 *   To stack this with a screen-level swipe-back gesture:
 *     const cardGesture = useCardGestures(...);
 *     const { gesture: backGesture, animatedStyle } = useStandardSwipeBack();
 *     const composed = Gesture.Simultaneous(backGesture, cardGesture);
 *     return (
 *       <GestureDetector gesture={composed}>
 *         <Animated.View style={animatedStyle}>
 *           ...card content...
 *         </Animated.View>
 *       </GestureDetector>
 *     );
 */

import { useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import {
  ACTIVE_OFFSET,
  FAIL_OFFSET,
  PINCH_MAX_SCALE,
  PINCH_MIN_SCALE,
  PINCH_RESET_DURATION,
} from '@/constants/gestures';

export interface UseCardGesturesOptions {
  /** Called when user swipes left past the activation threshold (and not zoomed). */
  onSwipeLeft?: () => void;
  /** Disable the swipe-left gesture without disabling pinch/pan. */
  disableSwipeLeft?: boolean;
}

export function useCardGestures(options?: UseCardGesturesOptions) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const isZoomed = useSharedValue(false);

  function triggerSwipeLeft() {
    if (options?.onSwipeLeft) options.onSwipeLeft();
  }

  // Swipe-left to profile — only active when not zoomed, not disabled.
  //
  // Snappy-by-design: nav.push fires on `onStart` (gesture activation at
  // ~8px of leftward travel, ~50ms after touch). The user sees the profile
  // begin sliding in within that frame instead of waiting for finger-up.
  //
  // maxPointers(1) is critical: when the user begins a pinch, the first
  // finger lands milliseconds before the second. Without this constraint,
  // any incidental leftward drift on finger #1 before finger #2 arrives
  // would trip the 8px activation threshold and navigate away before the
  // pinch even starts. Restricting to one finger makes the swipe FAIL as
  // soon as a 2nd pointer touches down, handing control to the pinch.
  //
  // No card translation: we tried tracking the finger with a Reanimated
  // shared value, but UIKit's native push animation snapshotted the home
  // hierarchy while Reanimated was actively transforming it — concurrent
  // animations on the same view caused compositing hitches. The profile
  // sliding in within ~50ms IS the feedback; we don't need a second motion
  // competing with it.
  const swipeGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    // Require a clear leftward swipe before navigating to profile, and fail
    // fast on vertical movement — at the old -8 / ±15 a vertical flick with a
    // little left drift would trip profile-nav. Aligned to the shared offsets
    // (ACTIVE_OFFSET ~2× FAIL_OFFSET) so horizontal must dominate. 2026-06-07.
    .activeOffsetX(-ACTIVE_OFFSET)
    .failOffsetX(FAIL_OFFSET)
    .failOffsetY([-FAIL_OFFSET, FAIL_OFFSET])
    .enabled(!options?.disableSwipeLeft)
    .onStart(() => {
      'worklet';
      if (savedScale.value > 1) return; // suppress while zoomed
      runOnJS(triggerSwipeLeft)();
    });

  // Pinch to zoom AND drag. Gesture.Pinch fires onUpdate whenever either
  // pointer moves (not just when the spread changes), so tracking the LIVE
  // focal point each frame gives two-finger drag-while-zoomed for free: the
  // image point grabbed at pinch-start stays glued under the fingers as they
  // spread apart or slide around. (The old separate two-finger Pan gesture was
  // dead code — its `savedScale > 1` guard never passed because savedScale was
  // only ever reset, and it fought the pinch for transX/transY anyway.)
  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      'worklet';
      // The grabbed image point, in pre-transform coords relative to the view
      // center. Divide out the CURRENT transform (not identity) so re-grabbing
      // mid reset-animation doesn't make the image jump.
      savedScale.value = scale.value;
      focalX.value = (e.focalX - SCREEN_WIDTH / 2 - transX.value) / scale.value;
      focalY.value = (e.focalY - SCREEN_HEIGHT / 2 - transY.value) / scale.value;
    })
    .onUpdate((e) => {
      'worklet';
      const newScale = Math.max(
        PINCH_MIN_SCALE,
        Math.min(PINCH_MAX_SCALE, savedScale.value * e.scale)
      );
      scale.value = newScale;
      isZoomed.value = newScale > 1.01;
      // Solve translate so the grabbed point sits under the live focal point
      // (screen = point*scale + translate), clamped to the image boundaries so
      // dragging can't pull the image edge past the screen edge.
      const maxX = ((newScale - 1) * SCREEN_WIDTH) / 2;
      const maxY = ((newScale - 1) * SCREEN_HEIGHT) / 2;
      const rawX = e.focalX - SCREEN_WIDTH / 2 - focalX.value * newScale;
      const rawY = e.focalY - SCREEN_HEIGHT / 2 - focalY.value * newScale;
      transX.value = Math.max(-maxX, Math.min(maxX, rawX));
      transY.value = Math.max(-maxY, Math.min(maxY, rawY));
    })
    .onEnd(() => {
      'worklet';
      // Animate back to identity on release — no bounce, no hold at scale.
      scale.value = withTiming(1, { duration: PINCH_RESET_DURATION });
      transX.value = withTiming(0, { duration: PINCH_RESET_DURATION });
      transY.value = withTiming(0, { duration: PINCH_RESET_DURATION });
      savedScale.value = 1;
      isZoomed.value = false;
    });

  const gesture = Gesture.Simultaneous(swipeGesture, pinchGesture);

  const imageTransformStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value }, { translateY: transY.value }, { scale: scale.value }],
  }));

  return { gesture, imageTransformStyle, isZoomed, scale };
}
