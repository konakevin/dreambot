/**
 * useAxisLockSwipeBack — swipe-right-to-go-back that NEVER fights a vertical
 * scroll under it.
 *
 * The native full-screen back gesture (fullScreenGestureEnabled) listens across
 * the whole screen and competes with a vertical scroll, which (a) makes the
 * scroll feel locked/laggy and (b) boots you back on an up-swipe's sideways
 * drift. This replaces it with an RNGH gesture that LOCKS the axis on the first
 * ~12px of travel: vertical-dominant → fail (the scroll owns it), clear
 * rightward → drive the back. Diagonals wait until one axis wins.
 *
 * USAGE
 *   const { gesture, animatedStyle } = useAxisLockSwipeBack();
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View style={[styles.root, animatedStyle]}>{children}</Animated.View>
 *     </GestureDetector>
 *   );
 * Disable the native gesture for the route (gestureEnabled:false) so only this runs.
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

const LOCK_DISTANCE = 12; // px of travel before we commit to an axis
const DOMINANCE = 1.3; // horizontal must beat vertical by this to count as "back"
const BACK_DISTANCE = 42; // px dragged right to dismiss
const VELOCITY = 280; // px/s fling to dismiss
const SLIDE_MS = 200;
const SNAP_SPRING = { damping: 20, stiffness: 220 } as const;

export interface UseAxisLockSwipeBackOptions {
  onDismiss?: () => void;
  disabled?: boolean;
}

export function useAxisLockSwipeBack(options?: UseAxisLockSwipeBackOptions) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const lockedAxis = useSharedValue(0); // 0 none, 1 horizontal (back), 2 vertical
  const activationTX = useSharedValue(0);

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
      lockedAxis.value = 0;
    })
    .onTouchesMove((e, manager) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t) return;
      const dx = t.absoluteX - startX.value;
      const dy = t.absoluteY - startY.value;
      if (lockedAxis.value === 0) {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (Math.sqrt(dx * dx + dy * dy) < LOCK_DISTANCE) return; // too early
        if (adx > ady * DOMINANCE)
          lockedAxis.value = 1; // horizontal
        else if (ady > adx * DOMINANCE)
          lockedAxis.value = 2; // vertical
        else return; // diagonal — keep waiting
      }
      if (lockedAxis.value === 1) {
        if (dx > 0)
          manager.activate(); // rightward → back
        else manager.fail(); // leftward → not a back gesture
      } else {
        manager.fail(); // vertical → let the scroll own it
      }
    })
    .onStart((e) => {
      'worklet';
      activationTX.value = e.translationX; // avoid a jump at activation
    })
    .onUpdate((e) => {
      'worklet';
      const tx = e.translationX - activationTX.value;
      if (tx > 0) translateX.value = tx;
    })
    .onEnd((e) => {
      'worklet';
      if (e.translationX > BACK_DISTANCE || e.velocityX > VELOCITY) {
        translateX.value = withTiming(width, { duration: SLIDE_MS }, (finished) => {
          if (finished) runOnJS(dismiss)();
        });
      } else {
        translateX.value = withSpring(0, SNAP_SPRING);
      }
    })
    .onFinalize(() => {
      'worklet';
      if (translateX.value !== 0 && translateX.value < BACK_DISTANCE) {
        translateX.value = withSpring(0, SNAP_SPRING);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { gesture, animatedStyle };
}
