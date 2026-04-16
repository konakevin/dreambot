/**
 * useStandardSheetDismiss — unified swipe-down-to-dismiss for bottom sheet modals.
 *
 * Replaces the legacy PanResponder-based useSheetDismiss hook. Built on
 * react-native-gesture-handler + Reanimated for consistent behavior with
 * the rest of the gesture system.
 *
 * USAGE
 *   const { gesture, animatedStyle } = useStandardSheetDismiss();
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View style={[styles.sheet, animatedStyle]}>
 *         {content}
 *       </Animated.View>
 *     </GestureDetector>
 *   );
 *
 * NOTES
 *   - Dismisses the keyboard on pan begin (hooks into JS side via runOnJS).
 *   - Fires router.dismiss() on successful swipe.
 *   - Snaps back if drag is below threshold.
 */

import { Keyboard } from 'react-native';
import { router } from 'expo-router';
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
  SWIPE_DISMISS_DISTANCE,
  VELOCITY_THRESHOLD,
} from '@/constants/gestures';

export interface UseStandardSheetDismissOptions {
  /** Called instead of router.dismiss() on dismissal. */
  onDismiss?: () => void;
  /** Disable the gesture entirely */
  disabled?: boolean;
}

export function useStandardSheetDismiss(options?: UseStandardSheetDismissOptions) {
  const translateY = useSharedValue(0);

  function dismissKeyboard() {
    Keyboard.dismiss();
  }

  function dismiss() {
    if (options?.onDismiss) options.onDismiss();
    else router.dismiss();
  }

  const gesture = Gesture.Pan()
    .enabled(!options?.disabled)
    .activeOffsetY([ACTIVE_OFFSET, Infinity])
    .failOffsetX([-FAIL_OFFSET, FAIL_OFFSET])
    .onBegin(() => {
      'worklet';
      runOnJS(dismissKeyboard)();
    })
    .onUpdate((e) => {
      'worklet';
      // Only honor downward drag.
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      'worklet';
      const shouldDismiss =
        e.translationY > SWIPE_DISMISS_DISTANCE || e.velocityY > VELOCITY_THRESHOLD;
      if (shouldDismiss) {
        translateY.value = withTiming(800, { duration: SLIDE_OFF_DURATION }, (finished) => {
          if (finished) runOnJS(dismiss)();
        });
      } else {
        translateY.value = withSpring(0, SNAP_SPRING);
      }
    })
    .onFinalize(() => {
      'worklet';
      if (translateY.value !== 0 && translateY.value < SWIPE_DISMISS_DISTANCE) {
        translateY.value = withSpring(0, SNAP_SPRING);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { gesture, animatedStyle, translateY };
}
