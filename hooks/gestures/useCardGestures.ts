/**
 * useCardGestures — composed pinch + pan-when-zoomed + swipe-left-to-profile.
 *
 * For fullscreen image cards (feed, photo detail, etc). Bundles the three
 * gestures that must coexist on a dream card:
 *   1. Pinch to zoom (1x – 5x, focal-point aware, auto-reset on release)
 *   2. Two-finger pan when zoomed (clamped to image boundaries)
 *   3. Single-finger swipe-left to profile (disabled while zoomed)
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
  PINCH_MAX_SCALE,
  PINCH_MIN_SCALE,
  PINCH_RESET_DURATION,
  SWIPE_DOMINANCE_RATIO,
  SWIPE_MIN_ACTIVATION,
} from '@/constants/gestures';
import { horizontalSwipeDecision } from '@/hooks/gestures/horizontalSwipeDecision';

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
  const savedTransX = useSharedValue(0);
  const savedTransY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const isZoomed = useSharedValue(false);
  // Gesture-start touch position (screen coords) for the ratio-based swipe.
  const swipeStartX = useSharedValue(0);
  const swipeStartY = useSharedValue(0);

  function triggerSwipeLeft() {
    if (options?.onSwipeLeft) options.onSwipeLeft();
  }

  // Swipe-left to profile — only active when not zoomed, not disabled.
  //
  // Ratio-based manual activation (2026-06-12): instead of absolute
  // activeOffsetX/failOffsetY (which can't be both "easy deliberate swipe" and
  // "ignore vertical drift" at once), we decide by which axis DOMINATES — the
  // swipe activates only when horizontal clearly out-paces vertical, and fails
  // (handing the drag to the vertical feed scroll) the moment vertical wins.
  // See hooks/gestures/horizontalSwipeDecision.ts.
  //
  // Snappy-by-design: nav.push fires on `onStart` (gesture activation), so the
  // profile begins sliding in mid-swipe instead of waiting for finger-up.
  //
  // maxPointers(1) + the explicit 2-finger fail below hand control to the pinch
  // the instant a 2nd finger lands, so incidental drift on finger #1 never
  // navigates away before a pinch starts.
  //
  // No card translation: tracking the finger with a shared value fought UIKit's
  // native push animation (compositing hitches). The profile sliding in IS the
  // feedback.
  const swipeGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .enabled(!options?.disableSwipeLeft)
    .manualActivation(true)
    .onTouchesDown((e, manager) => {
      'worklet';
      if (e.numberOfTouches > 1 || savedScale.value > 1) {
        manager.fail(); // 2nd finger (pinch) or already zoomed → not a profile swipe
        return;
      }
      const t = e.allTouches[0];
      if (t) {
        swipeStartX.value = t.absoluteX;
        swipeStartY.value = t.absoluteY;
      }
    })
    .onTouchesMove((e, manager) => {
      'worklet';
      if (e.numberOfTouches > 1 || savedScale.value > 1) {
        manager.fail();
        return;
      }
      const t = e.allTouches[0];
      if (!t) return;
      const decision = horizontalSwipeDecision({
        dx: t.absoluteX - swipeStartX.value,
        dy: t.absoluteY - swipeStartY.value,
        minDistance: SWIPE_MIN_ACTIVATION,
        ratio: SWIPE_DOMINANCE_RATIO,
        direction: 'left',
      });
      if (decision === 'activate') manager.activate();
      else if (decision === 'fail') manager.fail();
    })
    .onStart(() => {
      'worklet';
      runOnJS(triggerSwipeLeft)();
    });

  // Two-finger pan when zoomed.
  const zoomPanGesture = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      'worklet';
      savedTransX.value = transX.value;
      savedTransY.value = transY.value;
    })
    .onUpdate((e) => {
      'worklet';
      if (savedScale.value <= 1) return;
      // Clamp pan to image boundaries.
      const maxX = ((savedScale.value - 1) * SCREEN_WIDTH) / 2;
      const maxY = ((savedScale.value - 1) * SCREEN_HEIGHT) / 2;
      transX.value = Math.max(-maxX, Math.min(maxX, savedTransX.value + e.translationX));
      transY.value = Math.max(-maxY, Math.min(maxY, savedTransY.value + e.translationY));
    });

  // Pinch to zoom.
  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      'worklet';
      focalX.value = e.focalX - SCREEN_WIDTH / 2;
      focalY.value = e.focalY - SCREEN_HEIGHT / 2;
    })
    .onUpdate((e) => {
      'worklet';
      const newScale = Math.max(
        PINCH_MIN_SCALE,
        Math.min(PINCH_MAX_SCALE, savedScale.value * e.scale)
      );
      scale.value = newScale;
      isZoomed.value = newScale > 1.01;
      // Pan toward the focal point as you zoom.
      transX.value = savedTransX.value + focalX.value * (1 - e.scale);
      transY.value = savedTransY.value + focalY.value * (1 - e.scale);
    })
    .onEnd(() => {
      'worklet';
      // Animate back to identity on release — no bounce, no hold at scale.
      scale.value = withTiming(1, { duration: PINCH_RESET_DURATION });
      transX.value = withTiming(0, { duration: PINCH_RESET_DURATION });
      transY.value = withTiming(0, { duration: PINCH_RESET_DURATION });
      savedScale.value = 1;
      savedTransX.value = 0;
      savedTransY.value = 0;
      isZoomed.value = false;
    });

  const gesture = Gesture.Simultaneous(
    swipeGesture,
    Gesture.Simultaneous(pinchGesture, zoomPanGesture)
  );

  const imageTransformStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: transX.value }, { translateY: transY.value }, { scale: scale.value }],
  }));

  return { gesture, imageTransformStyle, isZoomed, scale };
}
