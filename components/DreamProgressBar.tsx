/**
 * DreamProgressBar — the staged progress bar on the dream loading screen.
 *
 * Renders are fast and one stage (`flux_render`) dominates the wall-clock, so
 * this deliberately does NOT show a precise percentage. It creeps asymptotically
 * toward the current stage's `target` checkpoint (from `lib/dreamStageLabels`),
 * always moving while below target and decelerating as it nears — an honest
 * "still working" feel that never hard-stalls on a number. Stage transitions
 * provide the punctuated jumps; completion (target 1) eases to full. See
 * DREAM_TRACKING_PLAN.md.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/AppText';
import { colors, gradients } from '@/constants/theme';
import { verticalScale, fontScale, horizontalScale } from '@/lib/responsive';
export interface DreamProgressBarInput {
  /** Live 0..1 fill target (time-based; see useDreamProgress). */
  target: number;
  label: string;
}

// Cadence of the creep. Each tick eases the fill toward the live target so
// stage transitions don't jump; the target itself advances over time.
const TICK_MS = 220;
const APPROACH = 0.14;

export function DreamProgressBar({ progress }: { progress: DreamProgressBarInput | null }) {
  const fill = useSharedValue(0); // 0..1
  const trackW = useSharedValue(0); // measured px
  const targetRef = useRef(progress?.target ?? 0.05);

  useEffect(() => {
    // Never let the target retreat — the bar only ever moves forward.
    targetRef.current = Math.max(targetRef.current, progress?.target ?? 0.05);
  }, [progress?.target]);

  useEffect(() => {
    const id = setInterval(() => {
      const target = targetRef.current;
      const cur = fill.value;
      if (target >= 1) {
        fill.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) });
        return;
      }
      if (cur >= target) return;
      const next = cur + (target - cur) * APPROACH;
      fill.value = withTiming(next, { duration: TICK_MS, easing: Easing.linear });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [fill]);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackW.value = e.nativeEvent.layout.width;
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: Math.min(fill.value, 1) * trackW.value,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.track} onLayout={onTrackLayout}>
        <Animated.View style={[styles.fill, fillStyle]}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      {progress?.label ? (
        <Text style={styles.label} allowFontScaling={false}>
          {progress.label}
        </Text>
      ) : null}
    </View>
  );
}

const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: verticalScale(10),
    width: horizontalScale(240),
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.overlayWhite,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  label: {
    color: colors.bodyOnDark,
    fontSize: fontScale(13),
    letterSpacing: 0.2,
  },
});
