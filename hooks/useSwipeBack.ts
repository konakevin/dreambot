import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { router } from 'expo-router';
import { SWIPE } from '@/constants/theme';

/**
 * Full-screen swipe-right-to-go-back gesture.
 * More forgiving than the native iOS edge swipe (~20px).
 * Spread panHandlers on the outermost View of the screen.
 */
export function useSwipeBack() {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dx > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5 && gs.vx > 0,
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0) translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE.DISMISS_THRESHOLD || gs.vx > (SWIPE.VELOCITY_THRESHOLD / 1000)) {
          Animated.timing(translateX, {
            toValue: 400,
            duration: 150,
            useNativeDriver: true,
          }).start(() => router.back());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 200,
            friction: 20,
          }).start();
        }
      },
    })
  ).current;

  return { translateX, panHandlers: panResponder.panHandlers };
}
