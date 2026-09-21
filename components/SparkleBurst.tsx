/**
 * SparkleBurst — a one-shot spray of sparkles radiating from a point.
 *
 * LINEAGE: this is the confetti half of `MilestoneBurst`, the Rad-or-Bad era component deleted in
 * 76e91e3d ("Remove rad/bad voting system"). Kevin asked for that feeling back on a repost. What came
 * across: the seeded particle layout, the ease-out travel with a slight upward drift, and the
 * fade-in-then-out curve. What did NOT: the tier config, the milestone headline, the masked gradient
 * text, and the looping twinkle stars — all of which existed for a full-screen celebration, not a
 * ~1s punctuation on a feed card.
 *
 * WHY SEEDED: particle angles and sizes are derived once at module load from a deterministic RNG, so
 * no `Math.random` runs during render. Every burst is laid out identically, which keeps it feeling
 * like a designed effect rather than noise, and keeps re-renders free.
 *
 * COST: mount it only while it runs. The parent should render it on the action and drop it when
 * `onDone` fires — an always-mounted burst would put idle animated nodes on every card in the feed.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

/** Sparkle palette: the app's gold, warmed and cooled, plus white for the hottest few. */
const SPARKLE_COLORS = [
  '#FFD700',
  '#FFFFFF',
  '#FFC044',
  '#FFEE88',
  '#FFD700',
  '#FFF0AA',
  '#FFFFFF',
  '#FFAA33',
];

// Tuned by eye (Kevin, 2026-09-20: "make it a bit bigger and last longer"). Raising SPREAD and
// DURATION together is what keeps it reading as a throw: distance alone makes particles look
// flung, duration alone makes them look slow. COUNT rose with the spread so the wider circle does
// not thin out into scattered dots.
const COUNT = 18;
const SPREAD = 108;
const DURATION = 900;

/** Deterministic RNG — same shape as the original so the burst keeps its character. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface ParticleConfig {
  angle: number;
  distanceFactor: number;
  size: number;
  color: string;
  delayMs: number;
  rotationDeg: number;
}

const PARTICLES: ParticleConfig[] = Array.from({ length: COUNT }, (_, i) => {
  const r1 = seededRandom(i);
  const r2 = seededRandom(i + 100);
  const r3 = seededRandom(i + 200);
  const r4 = seededRandom(i + 300);
  return {
    // Evenly spaced around the circle with a little jitter, so it reads as a spray rather than a dial.
    angle: (i / COUNT) * Math.PI * 2 + (r1 - 0.5) * 0.7,
    distanceFactor: 0.45 + r2 * 0.55,
    size: 3.5 + r3 * 4.5,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    delayMs: Math.floor(r4 * 90),
    rotationDeg: Math.floor(r1 * 360),
  };
});

function Particle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delayMs,
      withTiming(1, {
        duration: DURATION * (0.8 + config.distanceFactor * 0.4),
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [config.delayMs, config.distanceFactor, progress]);

  const dist = config.distanceFactor * SPREAD;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    // Decelerating travel: fast out of the icon, drifting to a stop.
    const eased = 1 - Math.pow(1 - p, 2);
    const d = dist * eased;
    // Snap in over the first 15%, then fade for the rest — the particle is brightest mid-flight.
    const opacity = p < 0.15 ? p / 0.15 : Math.max(0, 1 - (p - 0.35) / 0.65);
    return {
      opacity,
      transform: [
        { translateX: Math.cos(config.angle) * d },
        // Slight lift, so it feels thrown rather than merely scaled.
        { translateY: Math.sin(config.angle) * d - eased * 14 },
        { rotate: `${config.rotationDeg * p}deg` },
        { scale: 1 - p * 0.35 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  );
}

interface Props {
  /** Fires once the longest particle has finished, so the parent can unmount this. */
  onDone?: () => void;
}

export function SparkleBurst({ onDone }: Props) {
  useEffect(() => {
    // Longest particle = max delay + max scaled duration. One timer for the whole burst.
    const longest = 90 + DURATION * 1.2 + 60;
    const t = setTimeout(() => onDone?.(), longest);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    // pointerEvents none: the burst must never eat the tap that spawned it, or a double-repost.
    <View style={s.root} pointerEvents="none">
      {PARTICLES.map((config, i) => (
        <Particle key={i} config={config} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  // Centred on the parent so particles radiate from the icon they belong to.
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
