import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const PULL_THRESHOLD = 120;
const INDICATOR_HEIGHT = 40;

interface RefreshIndicatorProps {
  pullY: SharedValue<number>;
}

export function RefreshIndicator({ pullY }: RefreshIndicatorProps) {
  const [pastThreshold, setPastThreshold] = useState(false);

  useAnimatedReaction(
    () => pullY.value > PULL_THRESHOLD,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setPastThreshold)(current);
        if (current) {
          runOnJS(Haptics.selectionAsync)();
        }
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    // Track finger — resist at same rate as card (0.15x)
    const visualY = pullY.value * 0.15;
    const progress = Math.min(pullY.value / 60, 1);
    return {
      opacity: progress,
      transform: [{ translateY: -INDICATOR_HEIGHT + visualY }],
    };
  });

  return (
    <Animated.View style={[styles.indicator, animatedStyle]} pointerEvents="none">
      <Text style={styles.text}>
        {pastThreshold ? 'Release to refresh' : 'Pull down to refresh'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: INDICATOR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 100,
  },
  text: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
