/**
 * BrandSpinner — the on-brand loading swirl (Kevin 2026-07-09: "the colors of
 * the gradient logo ... swirling little colors").
 *
 * Eight dots in the brand gradient (purple → pink → teal, constants/theme
 * `gradients.brand`) orbit continuously while each dot breathes on a
 * staggered phase — reads as a swirl of brand color rather than a stock
 * ActivityIndicator. Pure Reanimated on the UI thread; safe anywhere
 * (no native deps beyond reanimated).
 */
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Brand gradient sampled at 8 stops (purple → pink → teal and back around, so
// the ring has no hard seam).
const DOT_COLORS = [
  '#A78BFA',
  '#C99AE7',
  '#F9A8D4',
  '#D5C4DC',
  '#5EEAD4',
  '#7ED9DE',
  '#8FB6EC',
  '#9BA2F5',
];

function Dot({
  index,
  spin,
  center,
  radius,
  dotSize,
}: {
  index: number;
  spin: SharedValue<number>;
  center: number;
  radius: number;
  dotSize: number;
}) {
  const angle = (index / DOT_COLORS.length) * Math.PI * 2;
  const style = useAnimatedStyle(() => {
    // Staggered breathing: each dot scales on its own phase of the spin.
    const phase = (spin.value + index / DOT_COLORS.length) % 1;
    const scale = interpolate(phase, [0, 0.5, 1], [0.55, 1.15, 0.55]);
    const opacity = interpolate(phase, [0, 0.5, 1], [0.45, 1, 0.45]);
    return { transform: [{ scale }], opacity };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: DOT_COLORS[index],
          // Dot CENTER sits on a circle of `radius` around the container's
          // center — an off-center pivot makes the whole ring wobble as it
          // spins (the 2026-07-09 "lopsided" bug: the old expression drifted
          // the pivot by one dot-width).
          left: center + radius * Math.cos(angle) - dotSize / 2,
          top: center + radius * Math.sin(angle) - dotSize / 2,
        },
        style,
      ]}
    />
  );
}

export function BrandSpinner({ size = 44 }: { size?: number }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    // 1540ms ≈ 10% slower than the original 1400 (Kevin 2026-07-09).
    spin.value = withRepeat(withTiming(1, { duration: 1540, easing: Easing.linear }), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  const dotSize = Math.max(5, Math.round(size / 6.5));
  // Keep the breathing dots (max scale 1.15) fully inside the container.
  const radius = size / 2 - (dotSize * 1.15) / 2;
  const center = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ width: size, height: size }, ringStyle]}>
        {DOT_COLORS.map((_, i) => (
          <Dot key={i} index={i} spin={spin} center={center} radius={radius} dotSize={dotSize} />
        ))}
      </Animated.View>
    </View>
  );
}
