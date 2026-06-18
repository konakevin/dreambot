/**
 * WaveLoader — a small lavender wave-of-dots loading indicator.
 *
 * 5 dots in a horizontal row. A single shared clock drives every dot; each
 * reads `(t + index*phaseFraction) % 1` so the row reads as a wave traveling
 * left→right and looping. Light, recognizable as "loading", with a tiny bounce
 * for personality without screaming for attention.
 *
 * Shared by the dream generating screen (MagicalLoadingStage) and the HD
 * upscale modal (UpscaleOverlay) so both use the exact same loader.
 *
 * The phase offset is STRUCTURAL (derived from the dot's index in the worklet),
 * not a one-time start delay — so it survives app background/foreground: when
 * Reanimated pauses & resumes the clock, the per-dot offset is recomputed every
 * frame and the wave never collapses into a synchronized bulge (the old
 * withDelay stagger was lost on resume).
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

const DOT_COUNT = 5;
const DOT_CYCLE_MS = 1400;
const DOT_PHASE_MS = 140;
const DOT_SIZE = 9;

function WaveDot({ index, t }: { index: number; t: SharedValue<number> }) {
  const offset = (index * DOT_PHASE_MS) / DOT_CYCLE_MS;

  const animatedStyle = useAnimatedStyle(() => {
    // Subtract the offset (+1 to stay non-negative) so higher-index dots peak
    // LATER — the wave travels left→right.
    const phase = (t.value - offset + 1) % 1;
    // Sin-shaped pulse: peaks mid-cycle then falls back. Continuous at the
    // 0/1 wrap (both ends map to 0), so the modulo seam is invisible.
    const pulse = interpolate(phase, [0, 0.5, 1], [0, 1, 0]);
    return {
      opacity: interpolate(pulse, [0, 1], [0.35, 1]),
      transform: [
        { scale: interpolate(pulse, [0, 1], [0.55, 1.15]) },
        { translateY: interpolate(pulse, [0, 1], [0, -6]) },
      ],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function WaveLoader() {
  // One linear clock for all dots — no per-dot start stagger to lose.
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: DOT_CYCLE_MS, easing: Easing.linear }),
      -1,
      false
    );
  }, [t]);

  return (
    <View style={styles.waveRow}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <WaveDot key={i} index={i} t={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Just enough horizontal gap that the dots stay visually separated
    // even at their peak scale (1.15× DOT_SIZE).
    gap: 10,
    // Reserve vertical space for the -6px bounce so the row doesn't
    // shift the layout below it.
    height: DOT_SIZE + 12,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.accent,
  },
});
