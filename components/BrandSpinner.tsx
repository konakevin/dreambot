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
import { memo, useEffect } from 'react';
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
// the ring has no hard seam. Every stop is a SUB-COLOR of the brand gradient
// (theme gradients.brand: #A78BFA → #F9A8D4 → #5EEAD4) — no foreign hues —
// but the blend stops are kept CHROMATIC: naive RGB midpoints pass through
// gray (#D5C4DC read washed-out on the dark scrim; Kevin 2026-07-10
// "more vivid").
const DOT_COLORS = [
  '#A78BFA', // brand violet
  '#C99BF2', // violet → pink
  '#F9A8D4', // brand pink
  '#EBA9DF', // pink → lilac (chromatic bridge, was gray #D5C4DC)
  '#5EEAD4', // brand teal
  '#7EE3DE', // teal light
  '#8FC0F0', // teal → periwinkle
  '#9F9FF7', // periwinkle → violet (wraps to the start)
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
    // Staggered opacity ONLY — dots stay a uniform size (Kevin 2026-07-10:
    // the scale stagger read as one side of the ring shrinking as it spun).
    // The opacity wave alone carries the chasing-swirl motion.
    const phase = (spin.value + index / DOT_COLORS.length) % 1;
    // Floor 0.65 (was 0.45) — the deep dip muted half the ring at any moment,
    // which read washed-out on the dark scrim (Kevin 2026-07-10 "more vivid").
    const opacity = interpolate(phase, [0, 0.5, 1], [0.65, 1, 0.65]);
    return { opacity };
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

// ONE canonical spinner, scaled. The ring is always laid out at BASE_SIZE and
// smaller sizes are a pure transform scale of it (Kevin 2026-07-10: "make one
// uniform gradient spinner and just scale it down") — per-size dot math
// (rounding + min-size floors) subtly changed the proportions at small sizes,
// so the pull-to-refresh minis didn't look like miniatures of the loader.
const BASE_SIZE = 44;

// Memoized: `size` is effectively constant per mount, so once mounted the
// spinner never needs to re-render. Without this, a parent that re-renders on a
// timer (the album pending tile ticks its progress every 400ms) reconciles all
// 8 animated dots each tick, re-attaching their worklets mid-spin — which read
// as a stutter (Kevin 2026-07-23 "very janky, doesn't spin smoothly").
export const BrandSpinner = memo(function BrandSpinner({ size = BASE_SIZE }: { size?: number }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    // 1540ms ≈ 10% slower than the original 1400 (Kevin 2026-07-09).
    spin.value = withRepeat(withTiming(1, { duration: 1540, easing: Easing.linear }), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  // Uniform dots — all leaves the same size (Kevin 2026-07-10). Divisor 7.5
  // (was 6.5×1.15): uniform-max-size leaves carried noticeably more visual
  // mass than the old breathing average and read chunky at loader scale, so
  // the leaf slimmed back down while keeping the uniformity.
  const dotSize = Math.round(BASE_SIZE / 7.5);
  const radius = BASE_SIZE / 2 - dotSize / 2;
  const center = BASE_SIZE / 2;
  const scale = size / BASE_SIZE;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Scale around the center: identical proportions at every size. */}
      <View style={{ width: BASE_SIZE, height: BASE_SIZE, transform: [{ scale }] }}>
        <Animated.View style={[{ width: BASE_SIZE, height: BASE_SIZE }, ringStyle]}>
          {DOT_COLORS.map((_, i) => (
            <Dot key={i} index={i} spin={spin} center={center} radius={radius} dotSize={dotSize} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
});
