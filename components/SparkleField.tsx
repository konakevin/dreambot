/**
 * SparkleField — a scatter of little white + lavender sparkles that twinkle in
 * and out at random positions, each with a soft diffused glow, to make the dream
 * loading screen feel dreamy and alive. Purely decorative (pointerEvents none),
 * and driven entirely by Reanimated on the UI thread, so it stays smooth even
 * while the JS thread is busy generating the dream.
 *
 * Each sparkle flashes on its OWN rhythm — random fade-in / fade-out / hold-dark
 * pause + random peak brightness + scale — so the field feels irregular and
 * organic rather than a synchronized pulse.
 */
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// White + DreamBot purple + a lighter lavender, so the twinkle stays on-brand.
const SPARKLE_COLORS = ['#FFFFFF', '#A78BFA', '#C4B5FD'] as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

interface SparkleSpec {
  id: number;
  left: number; // %
  top: number; // %
  size: number;
  color: string;
  delay: number;
  fadeIn: number;
  fadeOut: number;
  hold: number; // dark pause between flashes
  peak: number; // max opacity
  maxScale: number;
}

function Sparkle({
  left,
  top,
  size,
  color,
  delay,
  fadeIn,
  fadeOut,
  hold,
  peak,
  maxScale,
}: Omit<SparkleSpec, 'id'>) {
  const t = useSharedValue(0);

  useEffect(() => {
    // Fade in → fade out → hold dark, forever; staggered by `delay`.
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: fadeIn, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: fadeOut, easing: Easing.in(Easing.quad) }),
          withDelay(hold, withTiming(0, { duration: 0 }))
        ),
        -1
      )
    );
  }, [t, delay, fadeIn, fadeOut, hold]);

  const style = useAnimatedStyle(() => ({
    opacity: t.value * peak,
    transform: [{ scale: 0.4 + t.value * (maxScale - 0.4) }],
  }));

  return (
    <Animated.View style={[styles.sparkle, { left: `${left}%`, top: `${top}%` }, style]}>
      <Ionicons
        name="sparkles"
        size={size}
        color={color}
        // Diffused glow — a soft halo of the sparkle's own colour around the glyph.
        style={{
          textShadowColor: color,
          textShadowRadius: size * 0.9,
          textShadowOffset: { width: 0, height: 0 },
        }}
      />
    </Animated.View>
  );
}

interface Props {
  /** How many sparkles to scatter. Default 22. */
  count?: number;
}

export function SparkleField({ count = 22 }: Props) {
  const sparkles = useMemo<SparkleSpec[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: rand(2, 96),
        top: rand(2, 96),
        size: rand(7, 22),
        color: pick(SPARKLE_COLORS),
        delay: rand(0, 4000),
        fadeIn: rand(500, 1200),
        fadeOut: rand(700, 1700),
        hold: rand(400, 2800),
        peak: rand(0.55, 1),
        maxScale: rand(0.9, 1.4),
      })),
    [count]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {sparkles.map(({ id, ...rest }) => (
        <Sparkle key={id} {...rest} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
  },
});
