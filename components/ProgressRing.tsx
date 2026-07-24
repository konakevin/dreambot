/**
 * ProgressRing — a circular determinate progress arc used across the render
 * tracking UX (dock rings + album pending tiles). The arc creeps asymptotically
 * toward `target` (same honest "no fake percent" model as the loading bar, just
 * circular). An optional orbiting "head" dot conveys active work; terminal
 * states swap the fill color + a check/alert glyph and do a little scale pop.
 * See DREAM_TRACKING_PLAN.md.
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type RingState = 'active' | 'complete' | 'failed';

interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  /** 0..1 checkpoint the arc creeps toward while active. */
  target: number;
  state?: RingState;
  color?: string;
  /** Orbiting head dot for an "actively working" feel (dock rings). Turn off
   *  where a separate spinner conveys activity (the album tile). */
  sweep?: boolean;
}

export function ProgressRing({
  size,
  strokeWidth,
  target,
  state = 'active',
  color = colors.accent,
  sweep = true,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const center = size / 2;

  // Seed the fill at the CURRENT target (not 0) so a remount — e.g. landing on
  // the Dreams tab mounts a fresh PostGrid — starts already filled to where the
  // render actually is, instead of re-sweeping from empty (Kevin 2026-07-23).
  const fill = useSharedValue(state === 'complete' ? 1 : Math.min(Math.max(target, 0), 1));
  const rotate = useSharedValue(0);
  const pop = useSharedValue(1);

  // Track `target` DIRECTLY (forward-only), not via an independent asymptotic
  // creep. `target` is already time-based and advances on its own
  // (useDreamProgress reads stage_updated_at), so the ring stays alive without a
  // second creep on top — and because every ring for the same dream converges to
  // the SAME deterministic target, the dock pill ring and the album tile ring
  // stay in lockstep no matter when each one mounted (Kevin 2026-07-23: the dock
  // ring ran ahead because it had been creeping since the dream started, while
  // the tile ring kept restarting its creep from 0). On complete, fill runs from
  // the held value up to 1 (the tile ring PERSISTS its instance across
  // active → complete via a stable key, so this reads as a real ~90%→100% finish
  // with a check, not a reset). On failed it just holds where it was.
  useEffect(() => {
    if (state === 'failed') return;
    const goal = state === 'complete' ? 1 : Math.min(Math.max(target, 0), 1);
    const cur = fill.value;
    if (goal <= cur) return; // never animate backward
    // On complete, deliberately fill ALL the way to full — even from a low value
    // — over a distance-scaled duration, so the ring visibly "hurries to finish"
    // (~0.4–1.2s) before the result is revealed, rather than the image popping in
    // with the ring still short (Kevin 2026-07-23: "if it completes and it's
    // still not finished, hurry and show it progress to finished, then done").
    const duration = state === 'complete' ? Math.round(320 + (goal - cur) * 1500) : 420;
    fill.value = withTiming(goal, { duration, easing: Easing.out(Easing.cubic) });
  }, [target, state, fill]);

  // Orbiting head while active.
  useEffect(() => {
    if (sweep && state === 'active') {
      rotate.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1);
    } else {
      cancelAnimation(rotate);
    }
    return () => cancelAnimation(rotate);
  }, [sweep, state, rotate]);

  // Pop when the terminal state "lands": failed pops at once (the ring holds
  // where it stopped); complete pops as the fill reaches full — together with the
  // check fade-in below — so the bounce reads as the finish landing, not a bounce
  // mid-fill during the deliberate ~1s finish.
  const didPop = useSharedValue(0);
  useEffect(() => {
    if (state === 'failed') {
      pop.value = withSequence(
        withTiming(1.18, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 190, easing: Easing.out(Easing.quad) })
      );
    }
    if (state === 'active') didPop.value = 0;
  }, [state, pop, didPop]);
  useAnimatedReaction(
    () => fill.value,
    (f) => {
      if (state === 'complete' && f >= 0.985 && didPop.value === 0) {
        didPop.value = 1;
        pop.value = withSequence(
          withTiming(1.18, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 190, easing: Easing.out(Easing.quad) })
        );
      }
    }
  );

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - Math.min(fill.value, 1)),
  }));
  const headStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  // Glyph reveals in step with the ring: on complete it fades in only as the fill
  // nears full (never sits over a half-empty ring during the finish); on failed
  // it shows immediately.
  const glyphStyle = useAnimatedStyle(() => {
    if (state === 'failed') return { opacity: 1 };
    if (state !== 'complete') return { opacity: 0 };
    return { opacity: Math.max(0, Math.min(1, (fill.value - 0.9) / 0.09)) };
  });

  const strokeColor =
    state === 'failed' ? colors.warning : state === 'complete' ? colors.success : color;

  return (
    <Animated.View style={[{ width: size, height: size }, popStyle]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={r}
          // Track (unfilled part) — a touch brighter than colors.overlayWhite
          // (0.12) so a barely-filled ring still reads as a full circle on the
          // black dock, not a lone arc (Kevin 2026-07-23).
          stroke="rgba(255,255,255,0.24)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={r}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={arcProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {sweep && state === 'active' ? (
        <Animated.View style={[StyleSheet.absoluteFill, headStyle]}>
          <Svg width={size} height={size}>
            <Circle
              cx={center}
              cy={strokeWidth / 2}
              r={strokeWidth * 0.7}
              fill={colors.accentLight}
            />
          </Svg>
        </Animated.View>
      ) : null}
      {state !== 'active' ? (
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, glyphStyle]}>
          <Ionicons
            name={state === 'complete' ? 'checkmark' : 'alert'}
            size={size * 0.5}
            color={strokeColor}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
