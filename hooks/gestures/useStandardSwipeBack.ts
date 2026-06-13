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
 *   - Ratio-based manual activation (2026-06-12): activates only when a
 *     rightward drag clearly out-paces vertical, and fails the instant vertical
 *     wins — handing the drag to an underlying FlatList. This is what makes the
 *     back-swipe reliable over a vertical feed instead of "stuck" (the native
 *     fullScreenGestureEnabled pop it replaces fought the scroll). See
 *     hooks/gestures/horizontalSwipeDecision.ts.
 *   - Fires router.back() via runOnJS after the slide-off animation.
 *   - If the gesture is cancelled mid-way, translation is sprung back to 0.
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
  SLIDE_OFF_DURATION,
  SNAP_SPRING,
  SWIPE_BACK_DISTANCE,
  SWIPE_DOMINANCE_RATIO,
  SWIPE_MIN_ACTIVATION,
  VELOCITY_THRESHOLD,
} from '@/constants/gestures';
import { horizontalSwipeDecision } from '@/hooks/gestures/horizontalSwipeDecision';

export interface UseStandardSwipeBackOptions {
  /** Called instead of router.back() on dismiss. Useful for custom teardown. */
  onDismiss?: () => void;
  /** Disable the gesture entirely (e.g. during modal loading states) */
  disabled?: boolean;
}

export function useStandardSwipeBack(options?: UseStandardSwipeBackOptions) {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  // Gesture-start touch position + the translation captured at activation, so
  // the content tracks the finger from the activation point with no snap-jump.
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const activationTranslateX = useSharedValue(0);

  function dismiss() {
    if (options?.onDismiss) options.onDismiss();
    else router.back();
  }

  const gesture = Gesture.Pan()
    .enabled(!options?.disabled)
    .manualActivation(true)
    .onTouchesDown((e) => {
      'worklet';
      const t = e.allTouches[0];
      if (t) {
        startX.value = t.absoluteX;
        startY.value = t.absoluteY;
      }
    })
    .onTouchesMove((e, manager) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t) return;
      const decision = horizontalSwipeDecision({
        dx: t.absoluteX - startX.value,
        dy: t.absoluteY - startY.value,
        minDistance: SWIPE_MIN_ACTIVATION,
        ratio: SWIPE_DOMINANCE_RATIO,
        direction: 'right',
      });
      if (decision === 'activate') manager.activate();
      else if (decision === 'fail') manager.fail();
    })
    .onStart((e) => {
      'worklet';
      // Subtract the travel already accumulated at activation so onUpdate
      // doesn't jump the content by ~minDistance px.
      activationTranslateX.value = e.translationX;
    })
    .onUpdate((e) => {
      'worklet';
      // Only honor rightward drag. Negative doesn't move the view.
      const tx = e.translationX - activationTranslateX.value;
      if (tx > 0) translateX.value = tx;
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
