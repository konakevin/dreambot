/**
 * MagicalLoadingStage — the loading visual for dream generation.
 *
 * Black backdrop + a small lavender wave-of-dots loader + a single
 * clean "Dreaming…" message + a hint that the user can head back and
 * get notified. No mascot, no halo, no rotating subtitles — minimal
 * on purpose. Animations are Reanimated worklets, ~zero JS cost.
 *
 * History (kept terse — see git log for full arc): an earlier
 * iteration had a Skia nebula shader + sparkle field; a follow-up
 * dropped the shader but kept the mascot + lavender pulse halo. Both
 * felt too heavy — Kevin asked for "interesting animation + clean
 * message" instead of a centered glowing ball.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

// The app-icon/splash mascot — the little robot reaching for a star.
// Local require so it ships with the JS bundle (no remote fetch, no
// flash). The image itself already has soft pink/lavender clouds in
// its background, which sits cleanly against the black stage.
const MASCOT_SOURCE = require('@/assets/images/splash-icon.png');

// ── Wave loader ────────────────────────────────────────────────────────────
// 5 small dots in a horizontal row. Each dot runs the same 1400ms
// scale + opacity + translateY cycle, phase-offset by `index * 140ms`
// so the row reads as a wave traveling left→right and looping. Light,
// recognizable as "loading", and the tiny bounce gives it personality
// without screaming for attention.
const DOT_COUNT = 5;
const DOT_CYCLE_MS = 1400;
const DOT_PHASE_MS = 140;
const DOT_SIZE = 9;

function WaveDot({ index }: { index: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      index * DOT_PHASE_MS,
      withRepeat(
        withTiming(1, { duration: DOT_CYCLE_MS, easing: Easing.inOut(Easing.sin) }),
        -1,
        false
      )
    );
  }, [index, t]);

  const animatedStyle = useAnimatedStyle(() => {
    // t goes 0→1 once per cycle; map a "pulse" curve onto it so the
    // dot peaks in the middle of its cycle then falls back. Using a
    // simple sin-shaped pulse via two interpolations.
    const pulse = interpolate(t.value, [0, 0.5, 1], [0, 1, 0]);
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

function WaveLoader() {
  return (
    <View style={styles.waveRow}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <WaveDot key={i} index={i} />
      ))}
    </View>
  );
}

// ── Mascot ─────────────────────────────────────────────────────────────────
// Splash-icon robot, soft sine-breathe so it feels alive instead of
// pasted-on. Subtle (translateY −4, scale 1→1.025) — we don't want it
// drawing attention away from the wave loader, just gently breathing.
function BreathingMascot() {
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [breathe]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(breathe.value, [0, 1], [0, -4]) },
      { scale: interpolate(breathe.value, [0, 1], [1, 1.025]) },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image source={MASCOT_SOURCE} style={styles.mascot} contentFit="contain" />
    </Animated.View>
  );
}

export function MagicalLoadingStage() {
  return (
    <View style={styles.stage}>
      <BreathingMascot />
      <WaveLoader />
      <Text style={styles.title}>Dreaming</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
    gap: 24,
  },
  mascot: {
    width: 140,
    height: 140,
  },
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
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
