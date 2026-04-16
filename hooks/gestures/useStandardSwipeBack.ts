/**
 * useStandardSwipeBack — unified swipe-right-to-dismiss gesture.
 *
 * Replaces the legacy PanResponder-based useSwipeBack hook. Built on
 * react-native-gesture-handler + Reanimated so it composes cleanly with
 * other gestures (pinch, pan, tap) via Gesture.Simultaneous / Exclusive.
 *
 * USAGE
 *   const { gesture, animatedStyle } = useStandardSwipeBack();
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View style={[styles.root, animatedStyle]}>
 *         {children}
 *       </Animated.View>
 *     </GestureDetector>
 *   );
 *
 * COMPOSITION
 *   If the screen has other gestures (e.g. DreamCard pinch/zoom), compose:
 *     const { gesture: backGesture, animatedStyle } = useStandardSwipeBack();
 *     const cardGesture = useCardGestures(...);
 *     const composed = Gesture.Simultaneous(backGesture, cardGesture);
 *
 * NOTES
 *   - Gesture activates only on clear right-swipe (activeOffsetX [12, Infinity]).
 *   - Fails early if vertical drag exceeds FAIL_OFFSET — lets FlatLists scroll.
 *   - Fires router.back() via runOnJS after slide-off animation.
 *   - If gesture is cancelled mid-way, translation is sprung back to 0.
 */

import { router } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  ACTIVE_OFFSET,
  FAIL_OFFSET,
  SLIDE_OFF_DURATION,
  SNAP_SPRING,
  SWIPE_BACK_DISTANCE,
  VELOCITY_THRESHOLD,
} from '@/constants/gestures';

export interface UseStandardSwipeBackOptions {
  /** Called instead of router.back() on dismiss. Useful for custom teardown. */
  onDismiss?: () => void;
  /** Disable the gesture entirely (e.g. during modal loading states) */
  disabled?: boolean;
}

export function useStandardSwipeBack(options?: UseStandardSwipeBackOptions) {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);

  function dismiss() {
    if (options?.onDismiss) options.onDismiss();
    else router.back();
  }

  const gesture = Gesture.Pan()
    .enabled(!options?.disabled)
    .activeOffsetX([ACTIVE_OFFSET, Infinity])
    .failOffsetY([-FAIL_OFFSET, FAIL_OFFSET])
    .onUpdate((e) => {
      'worklet';
      // Only honor rightward drag. Negative doesn't move the view.
      if (e.translationX > 0) translateX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      const shouldDismiss =
        e.translationX > SWIPE_BACK_DISTANCE || e.velocityX > VELOCITY_THRESHOLD;
      if (shouldDismiss) {
        translateX.value = withTiming(screenWidth, { duration: SLIDE_OFF_DURATION }, (finished) => {
          if (finished) runOnJS(dismiss)();
        });
      } else {
        translateX.value = withSpring(0, SNAP_SPRING);
      }
    })
    .onFinalize(() => {
      'worklet';
      // Safety net: if the gesture is cancelled without onEnd firing
      // (e.g. another gesture wins), snap back so we're never stuck mid-slide.
      if (translateX.value !== 0 && translateX.value < SWIPE_BACK_DISTANCE) {
        translateX.value = withSpring(0, SNAP_SPRING);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { gesture, animatedStyle, translateX };
}
