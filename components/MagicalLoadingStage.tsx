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

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

// 5 DreamBot painter variants — same character DNA, same dreamy
// lavender/cloud/star scene, different painting poses (standing
// frontal w/ palette, sitting on stool painting a star, crouched w/
// supplies, three-quarter angle at easel, triumphant beside finished
// star canvas). Rendered via `scripts/gen-mascot-painter.js` (Flux
// 1.1 Pro Ultra + locked DNA + whimsy-scene closing). Mirror the
// app-icon vibe so the loading screen reads as the same magical
// world. Mounted as a rounded-corner card floating on the black
// stage; the mount picks one at random. Local requires → ship with
// the JS bundle, no remote fetch, paint instantly. ~150 KB total
// across all 5 (~30 KB each, 512×512 JPG q85).
const MASCOT_SOURCES = [
  require('@/assets/images/mascots/mascot-1.jpg'),
  require('@/assets/images/mascots/mascot-2.jpg'),
  require('@/assets/images/mascots/mascot-3.jpg'),
  require('@/assets/images/mascots/mascot-4.jpg'),
  require('@/assets/images/mascots/mascot-5.jpg'),
];

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
// Fully static (Kevin: "don't even animate it"). Picks a random painter
// variant per mount, stable across re-renders via useMemo + empty deps.
// The whimsy scene baked into the artwork (clouds, stars, painter
// setup) carries all the visual interest on its own.

interface MagicalLoadingStageProps {
  /**
   * Optional small subline rendered below the "Dreaming" title. Used by
   * the onboarding first-dream flow to set wait expectations; callers
   * elsewhere (Create tab) leave it unset.
   */
  subtext?: string;
}

export function MagicalLoadingStage({ subtext }: MagicalLoadingStageProps = {}) {
  // Stable across re-renders of the same mount (no re-roll on parent
  // updates); fresh pick each time the stage mounts.
  const mascotSource = useMemo(
    () => MASCOT_SOURCES[Math.floor(Math.random() * MASCOT_SOURCES.length)],
    []
  );

  return (
    <View style={styles.stage}>
      <Image source={mascotSource} style={styles.mascot} contentFit="contain" />
      <WaveLoader />
      <Text style={styles.title}>Dreaming</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
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
  // Optional wait-hint shown when the caller passes `subtext`. Muted vs.
  // the title so it reads as supporting info, not a competing headline.
  subtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: -12, // tighten against the gap:24 the parent set
  },
});
