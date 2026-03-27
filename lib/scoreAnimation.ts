import { withTiming, withSequence } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

interface ScoreAnimationConfig {
  fadeDuration?: number;
  punchDuration?: number;
  settleDuration?: number;
}

/**
 * Shared score badge entrance animation.
 * Punches to 1.38× then settles — used on SwipeCard and photo detail.
 * Timing can be overridden per context (feed needs fast, detail can be slower).
 */
export function animateScoreIn(
  scoreOpacity: SharedValue<number>,
  scoreScale: SharedValue<number>,
  config: ScoreAnimationConfig = {},
) {
  const { fadeDuration = 50, punchDuration = 100, settleDuration = 80 } = config;
  scoreOpacity.value = withTiming(1, { duration: fadeDuration });
  scoreScale.value = withSequence(
    withTiming(1.38, { duration: punchDuration }),
    withTiming(1, { duration: settleDuration }),
  );
}
