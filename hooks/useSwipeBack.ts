import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { router } from 'expo-router';
import { SNAP_SPRING, SLIDE_OFF_DURATION } from '@/constants/gestures';

/**
 * Full-screen swipe-right-to-go-back gesture.
 * Spread panHandlers on the outermost Animated.View of the screen.
 *
 * History: this hook used to get "stuck at 2/3" on the photo detail screen
 * because the inner FullScreenFeed contains a react-native-gesture-handler
 * FlatList + DreamCard GestureDetector that could terminate the outer
 * PanResponder mid-swipe. The old implementation had no `onPanResponderTerminate`
 * handler so `translateX` froze wherever it was when termination happened.
 *
 * Fix, in priority order:
 *   1. `onPanResponderTerminate` — spring back to 0 if another gesture forces
 *      termination, so the view never gets stuck mid-slide
 *   2. `onPanResponderTerminationRequest: () => false` — refuse to yield the
 *      responder to a child once we've claimed the swipe
 *   3. Capture-phase handlers — win touch arbitration BEFORE the inner
 *      gesture-handler children see the event
 *   4. Stricter activation (1.5x horizontal dominance instead of 1.2x) — makes
 *      the vertical FlatList less likely to claim mixed-direction swipes
 *   5. Removed the `gs.vx > 0` activation requirement — slow careful drags
 *      should also work, not just flicks
 *   6. Raised release threshold 25 → 80px — a tiny nudge shouldn't accidentally
 *      dismiss the screen
 */
export function useSwipeBack() {
  const translateX = useRef(new Animated.Value(0)).current;

  const springBack = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: SNAP_SPRING.stiffness,
      friction: SNAP_SPRING.damping,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gs) => gs.dx > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      // Claim the gesture in the capture phase so gesture-handler children
      // (FlatList scroll, DreamCard pinch/pan) don't steal it first.
      onMoveShouldSetPanResponderCapture: (_, gs) =>
        gs.dx > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      // Once we own the swipe, refuse to hand it off.
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0) translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > 80 || gs.vx > 0.3) {
          Animated.timing(translateX, {
            toValue: 400,
            duration: SLIDE_OFF_DURATION,
            useNativeDriver: true,
          }).start(() => router.back());
        } else {
          springBack();
        }
      },
      // If termination is forced despite our refusal (background, hardware
      // back, etc.), spring back so the view isn't left frozen mid-slide.
      onPanResponderTerminate: springBack,
    })
  ).current;

  return { translateX, panHandlers: panResponder.panHandlers };
}
