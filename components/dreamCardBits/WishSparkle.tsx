/**
 * WishSparkle particle + perimeter math. Extracted from DreamCard (2026-06-06)
 * so the card component stays under the 800-line maintainability ceiling.
 *
 * Each sparkle animates a fade+scale loop along the screen perimeter; the
 * seeded RNG ensures positions are stable per (index, seed) so the same wish
 * always lights up the same constellation of particles.
 */

import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getSparklePosition(index: number, total: number, seed: number) {
  const perimeter = 2 * (SCREEN_WIDTH + SCREEN_HEIGHT);
  const step = perimeter / total;
  const pos = (step * index + seededRandom(index + seed + 7) * step * 0.6) % perimeter;
  const jitter = seededRandom(index + seed + 13) * 14;

  if (pos < SCREEN_WIDTH) {
    return { left: pos, top: jitter };
  } else if (pos < SCREEN_WIDTH + SCREEN_HEIGHT) {
    return { left: SCREEN_WIDTH - jitter, top: pos - SCREEN_WIDTH };
  } else if (pos < 2 * SCREEN_WIDTH + SCREEN_HEIGHT) {
    return { left: 2 * SCREEN_WIDTH + SCREEN_HEIGHT - pos, top: SCREEN_HEIGHT - jitter };
  } else {
    return { left: jitter, top: perimeter - pos };
  }
}

export function WishSparkle({
  index,
  total,
  seed,
}: {
  index: number;
  total: number;
  seed: number;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const { left, top } = getSparklePosition(index, total, seed);
  const delay = seededRandom(index + seed + 3) * 5000;
  const duration = 2500 + seededRandom(index + seed + 11) * 2500;
  const size = 3 + seededRandom(index + 17) * 4;

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.3 }),
          withTiming(0, { duration: duration * 0.7 })
        ),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: duration * 0.3 }),
          withTiming(0.3, { duration: duration * 0.7 })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const color =
    index % 3 === 0
      ? 'rgba(255,223,150,0.95)'
      : index % 3 === 1
        ? 'rgba(196,181,253,0.95)'
        : 'rgba(255,255,255,0.9)';

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowRadius: 6,
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}
