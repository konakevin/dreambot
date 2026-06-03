/**
 * MagicalLoadingStage — the "Workshop" loading visual.
 *
 * Clean black backdrop matching the Create screen + the DreamBot
 * mascot breathing softly + a soft lavender pulse glow behind the
 * mascot + a `Dreaming…` title with sequenced dots + a rotating
 * poetic subtitle that cross-fades through a small phrase pool.
 *
 * Designed to occupy the whole screen of the dream-generation loading
 * flow (replacing the prior tiny mascot + ActivityIndicator) and
 * intentionally re-usable on the first-dream generating screen — pass
 * the mascot URL and we'll do the rest.
 *
 * History: an earlier iteration drove a Skia nebula shader + a 14-18
 * particle sparkle field. It looked nice in stills but took 2-3s to
 * compile its GLSL on cold launch — the user saw a black flash before
 * anything appeared. Ripped 2026-06-02 in favor of this lightweight
 * pure-Reanimated approach: zero GPU compile cost, on-screen instantly.
 *
 * All animations run on the Reanimated worklet thread, so frame cost
 * is ~negligible.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

const MASCOT_SIZE = 200;
const GLOW_SIZE = 360;

const PHRASES = [
  'Mixing moonlight and memory…',
  'Whispering to a star…',
  'Painting the impossible…',
  'Stitching constellations…',
  'Spinning thread from light…',
  'Folding shadows into wings…',
  'Borrowing colors from a sunset…',
];

// ── Dots ───────────────────────────────────────────────────────────────────
// 3-dot sequence: `.` → `..` → `...` → repeat. Reserves space for the
// final 3 dots with a transparent placeholder so the title doesn't
// horizontally jitter between states.
function AnimatedDots() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c % 3) + 1), 380);
    return () => clearInterval(id);
  }, []);
  return (
    <Text style={styles.dotsRun}>
      <Text style={styles.dots}>{'·'.repeat(count)}</Text>
      <Text style={styles.dotsHidden}>{'·'.repeat(3 - count)}</Text>
    </Text>
  );
}

interface Props {
  /** URL of the mascot image to feature centrally. */
  mascotUrl: string;
}

export function MagicalLoadingStage({ mascotUrl }: Props) {
  const breathe = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const subtitleOpacity = useSharedValue(1);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Mascot breathing — gentle 1.8s in / 1.8s out, runs forever on the
  // worklet thread.
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [breathe]);

  // Lavender glow pulse behind the mascot — same sine breath but
  // slightly out of phase via a longer period so the two animations
  // don't lock-step. Subtle enough to feel like ambient warmth, not a
  // discrete "ring expanding."
  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [glowPulse]);

  // Rotating subtitle — fade out, swap text, fade back in. setTimeout
  // for the swap+rise step keeps the worklet/runOnJS dance out of this:
  // 400ms is the same duration the fade-out animation runs, so the swap
  // lands when the text is fully transparent. JS-side timer drift over
  // a 25–40s render is irrelevant.
  useEffect(() => {
    const id = setInterval(() => {
      subtitleOpacity.value = withTiming(0, { duration: 400 });
      setTimeout(() => {
        setPhraseIndex((p) => (p + 1) % PHRASES.length);
        subtitleOpacity.value = withTiming(1, { duration: 400 });
      }, 400);
    }, 3800);
    return () => clearInterval(id);
  }, [subtitleOpacity]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(breathe.value, [0, 1], [0, -8]) },
      { scale: interpolate(breathe.value, [0, 1], [1, 1.02]) },
    ],
  }));

  // Glow: opacity ranges 0.25 → 0.45 (subtle baseline + gentle swell);
  // scale 0.95 → 1.08 (soft breath that follows the mascot but feels
  // like a halo, not a discrete object).
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.25, 0.45]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.95, 1.08]) }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.stage}>
      {/* Soft lavender halo behind the mascot. A simple radial-ish
          look using a translucent View with a heavy shadow — no Skia,
          no shader compile, paints instantly. */}
      <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />

      <Animated.View style={mascotStyle}>
        <Image source={{ uri: mascotUrl }} style={styles.mascot} contentFit="cover" />
      </Animated.View>

      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dreaming</Text>
          <AnimatedDots />
        </View>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {PHRASES[phraseIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    overflow: 'hidden',
    // Pure black — matches the Create screen + the rest of the dark
    // theme. The route container also paints this so React mounts the
    // backdrop the instant the screen pushes.
    backgroundColor: colors.background,
  },
  // Soft lavender halo behind the mascot — translucent accent disc
  // with a heavy glow shadow. Roughly twice the mascot diameter so the
  // mascot floats inside a warm pool of color rather than feeling like
  // it's wearing a tight ring.
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
    // The pulse animation positions this absolutely centered via the
    // flex parent — the mascot sits on top because it's the next sibling.
  },
  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: MASCOT_SIZE / 2,
  },
  textBlock: {
    marginTop: 36,
    alignItems: 'center',
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dotsRun: {
    fontSize: 26,
    fontWeight: '700',
    marginLeft: 2,
  },
  dots: {
    color: colors.accent,
  },
  dotsHidden: {
    color: 'transparent',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 300,
  },
});
