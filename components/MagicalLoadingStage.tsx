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
import { LinearGradient } from 'expo-linear-gradient';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MASCOT_SIZE = 200;
const PARTICLE_COUNT = 14;

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
// Single particle that drifts upward with a sine-wave horizontal wobble,
// fades in then back out, and loops forever. Each instance bakes its own
// seed at mount so the field looks individually random but stays
// deterministic per render.
function Sparkle({ index }: { index: number }) {
  const seed = useMemo(() => Math.random(), []);
  const startX = useMemo(() => (SCREEN_WIDTH - 16) / 2 + (seed - 0.5) * 220, [seed]);
  const duration = useMemo(() => 2800 + seed * 1600, [seed]);
  const delay = useMemo(
    () => (index / PARTICLE_COUNT) * duration + seed * 600,
    [index, seed, duration]
  );

  const progress = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.out(Easing.cubic) }), -1, false)
    );
    wobble.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: duration * 0.5 }), -1, true)
    );
  }, [delay, duration, progress, wobble]);

  const size = useMemo(() => 3 + seed * 4, [seed]); // 3–7px
  const color = seed > 0.5 ? '#FFE9B3' : '#C4B5FD'; // warm gold or soft purple
  const wobbleAmp = 14 * (1 - seed * 0.4);

  const animatedStyle = useAnimatedStyle(() => {
    const y = interpolate(progress.value, [0, 1], [0, -240]);
    const x = startX + interpolate(wobble.value, [0, 1], [-wobbleAmp, wobbleAmp]);
    const opacity = interpolate(
      progress.value,
      [0, 0.15, 0.85, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      progress.value,
      [0, 0.1, 0.9, 1],
      [0.5, 1, 1, 0.6],
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
  const glow = useSharedValue(0);
  const subtitleOpacity = useSharedValue(1);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Mascot breathing + glow pulse — both run forever on the worklet
  // thread, free of JS-side ticking.
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [breathe, glow]);

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

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.32, 0.62]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.9, 1.1]) }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.stage}>
      <LinearGradient
        colors={['#1B0E33', '#0F0F1A', '#1A0F2C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Pulsing radial glow centered behind the mascot. Just a big
          soft purple disc with shadow + low opacity — does the work of
          a true radial gradient at a fraction of the cost. */}
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />

      {/* Sparkle field — sits underneath the mascot, particles rise
          past it. Layered absolutely. */}
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
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#8B5CF6',
    top: '42%',
    marginTop: -160,
  },
  sparkleField: {
    // Sparkles spawn near the middle of the screen and rise; the field
    // itself just provides an absolute coordinate space. No padding —
    // particles use their own absolute positions.
  },
  sparkle: {
    position: 'absolute',
    top: '60%',
    left: 0,
    shadowOpacity: 0.95,
    shadowRadius: 5,
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
    color: '#FFFFFF',
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
    color: '#FFE9B3',
  },
  dotsHidden: {
    color: 'transparent',
  },
  subtitle: {
    color: '#C4B5FD',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 300,
  },
});
