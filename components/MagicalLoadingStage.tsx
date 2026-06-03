/**
 * MagicalLoadingStage — the "Workshop" loading visual.
 *
 * Cosmic gradient backdrop + a pulsing radial glow + the DreamBot
 * mascot breathing softly + a field of upward-drifting sparkle
 * particles + a `Dreaming…` title with sequenced dots + a rotating
 * poetic subtitle that cross-fades through a small phrase pool.
 *
 * Designed to occupy the whole screen of the dream-generation
 * loading flow (replacing the prior tiny mascot + ActivityIndicator)
 * and intentionally re-usable on the first-dream generating screen —
 * pass the mascot URL and we'll do the rest.
 *
 * All animations run on the Reanimated worklet thread (no JS-side
 * Animated.Value polling), so frame budget cost is ~negligible even
 * with 14 sparkles in flight.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { NebulaBackdrop } from './NebulaBackdrop';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MASCOT_SIZE = 200;
const PARTICLE_COUNT = 18;

const PHRASES = [
  'Mixing moonlight and memory…',
  'Whispering to a star…',
  'Painting the impossible…',
  'Stitching constellations…',
  'Spinning thread from light…',
  'Folding shadows into wings…',
  'Borrowing colors from a sunset…',
];

// ── Sparkle ────────────────────────────────────────────────────────────────
// Single particle that drifts DOWNWARD from above the top of the screen
// to below the bottom with a slow sine-wave horizontal wobble, fades in
// then back out, and loops forever. Each instance bakes its own seed at
// mount so the field looks individually random but stays deterministic
// per render. Slower than the prior upward drift (5–8s per pass vs 2.8–
// 4.4s) so it reads as gentle haze rather than confetti.
function Sparkle({ index }: { index: number }) {
  const seed = useMemo(() => Math.random(), []);
  // Spawn anywhere across the screen width — full spread, not clustered
  // near the mascot like the old upward field.
  const startX = useMemo(() => seed * (SCREEN_WIDTH - 16), [seed]);
  const duration = useMemo(() => 5000 + seed * 3000, [seed]); // 5–8s
  const delay = useMemo(
    () => (index / PARTICLE_COUNT) * duration + seed * 600,
    [index, seed, duration]
  );

  const progress = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      // Linear easing for a steady "snow falling" feel — out(cubic)
      // accelerated the drift, which read as urgent.
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false)
    );
    wobble.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: duration * 0.5 }), -1, true)
    );
  }, [delay, duration, progress, wobble]);

  const size = useMemo(() => 4 + seed * 4, [seed]); // 4–8px (was 3–7)
  // Warm golden hour sparkles — saturated gold + soft cream amber. The
  // prior white sparkles disappeared into the highlight band; warmer
  // tones pop against both the dusky lavender shadows and the peach
  // highlights without ever color-matching either.
  const color = seed > 0.5 ? '#FFD27A' : '#FFEED1';
  const wobbleAmp = 14 * (1 - seed * 0.4);
  // Spawn just above the screen; drift to just past the bottom so the
  // field stays continuous across the loop (no pop-in/pop-out moment).
  const startY = useMemo(() => -40 - seed * 40, [seed]); // -40 to -80px
  const endY = useMemo(() => SCREEN_HEIGHT + 40, []);

  const animatedStyle = useAnimatedStyle(() => {
    const y = interpolate(progress.value, [0, 1], [startY, endY]);
    const x = startX + interpolate(wobble.value, [0, 1], [-wobbleAmp, wobbleAmp]);
    const opacity = interpolate(
      progress.value,
      [0, 0.1, 0.9, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      progress.value,
      [0, 0.1, 0.9, 1],
      [0.5, 1, 1, 0.7],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

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
  const subtitleOpacity = useSharedValue(1);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Mascot breathing — runs forever on the worklet thread, free of
  // JS-side ticking. The standalone radial-glow disc that used to pulse
  // behind the mascot was removed 2026-06-03 — the new Skia nebula
  // backdrop already breathes in/out via its drifting cloud density,
  // so a discrete glow circle felt redundant + read as an "expanding
  // bubble" that drew attention away from the mascot.
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

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.stage}>
      {/* Animated Skia nebula — fluid periwinkle/lavender haze drifting
          in two parallaxed layers, GPU-driven, ~zero JS cost. See
          NebulaBackdrop for the tuning knobs (palette stops, noise scales,
          scroll speeds, vignette). Replaced the prior static LinearGradient
          2026-06-03 + retuned to soft daylight haze. */}
      <NebulaBackdrop />

      {/* Sparkle field — particles drift slowly DOWN from above the top
          of the screen to below the bottom, like soft falling snow.
          Layered absolutely under the mascot/text. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.sparkleField]}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <Sparkle key={i} index={i} />
        ))}
      </View>

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
    // Match NebulaBackdrop.BASE_COLOR (~#8C7AB3 dusky lavender) so the
    // stage paints the cloud-shadow color the instant React mounts the
    // View — no flash while the Skia Canvas allocates its first frame
    // or the mascot image fetches.
    backgroundColor: '#8C7AB3',
  },
  sparkleField: {
    // Sparkles spawn just above the screen top and drift slowly downward;
    // the field itself just provides an absolute coordinate space. No
    // padding — particles use their own absolute positions.
  },
  sparkle: {
    position: 'absolute',
    // top: 0 so the translateY range (-40 → SCREEN_HEIGHT+40) actually
    // sweeps the FULL screen. The prior `top: '60%'` was a leftover
    // from the old upward-drift design and kept all sparkles trapped
    // in the bottom 40% of the screen — half of them never appeared.
    top: 0,
    left: 0,
    // Bigger glow halo so each particle reads as a luminous dot
    // against the warmer (less-bright) backdrop.
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
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
    // Pale cream — bright enough to read clearly against the warmer,
    // slightly darker golden-hour backdrop. The prior dark indigo
    // (#3B2178) was tuned for a near-white backdrop and reads as
    // cramped/heavy now that the bg is dusty lavender + mauve.
    color: '#FFF5E1',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.3,
    // Soft amber glow lifts the title off the cloud — golden hour
    // light wrapping the type.
    textShadowColor: 'rgba(255, 188, 110, 0.55)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  dotsRun: {
    fontSize: 26,
    fontWeight: '700',
    marginLeft: 2,
  },
  dots: {
    // Warm cream accent — still pops nicely against the lavender bg
    // (the warm/cool contrast carries readability without needing dark).
    color: '#D4A547',
  },
  dotsHidden: {
    color: 'transparent',
  },
  subtitle: {
    // Warm cream a couple shades softer than the title — golden hour
    // light through fabric. Stays legible on both the mauve mids and
    // the peach highlights of the cloud field.
    color: '#FBE3B7',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 300,
  },
});
