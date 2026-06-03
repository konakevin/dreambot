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

// DreamBot mascot painting a star on an easel, set in a dreamy
// lavender starscape with pink puffy clouds underneath — rendered via
// `scripts/gen-mascot-painter.js` (Flux 1.1 Pro Ultra with a locked
// character DNA paragraph + painter pose + whimsy-scene closing).
// Mirrors the app-icon vibe so the loading screen reads as the same
// magical world. Mounted as a rounded-corner card floating on the
// black stage. Local require → ships with the JS bundle, no remote
// fetch, paints instantly. ~32 KB at 512×512 JPG q85.
const MASCOT_SOURCE = require('@/assets/images/mascots/mascot.jpg');

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
// Static-sized painter mascot with a gentle vertical bob (no scale pulse
// — Kevin: "don't increase/decrease the size, just leave it static
// sized"). The translateY float keeps it feeling alive without changing
// the image dimensions.
function BreathingMascot() {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [bob]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(bob.value, [0, 1], [0, -4]) }],
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
    // Tight centered column — the PARENT now controls vertical placement
    // and pairs this block with the CTA cluster below as one unit. This
    // component used to be `flex: 1, justifyContent: 'center'` which let
    // it dominate the screen and float its title in dead space.
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  mascot: {
    // Bumped 140 → 180 now that the mascot has its own whimsy scene
    // baked in (lavender starscape + clouds + painter setup) — it
    // deserves more presence than a plain isolated character did.
    width: 180,
    height: 180,
    // Rounded "card" treatment so the lavender scene floats on the
    // black stage as a discrete dreamy artifact rather than a hard-
    // edged rectangle. ~22% radius (the iOS app-icon ratio) reads
    // friendly without going full-circle.
    borderRadius: 32,
    overflow: 'hidden',
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
