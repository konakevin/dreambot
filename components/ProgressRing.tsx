/**
 * ProgressRing — a circular determinate progress arc used across the render
 * tracking UX (dock rings + album pending tiles). The arc creeps asymptotically
 * toward `target` (same honest "no fake percent" model as the loading bar, just
 * circular). An optional orbiting "head" dot conveys active work; terminal
 * states swap the fill color + a check/alert glyph and do a little scale pop.
 * See DREAM_TRACKING_PLAN.md.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
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

const TICK_MS = 220;
const APPROACH = 0.14;

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

  const fill = useSharedValue(0);
  const targetRef = useRef(target);
  const rotate = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (state === 'complete') targetRef.current = 1;
    else if (state === 'active') targetRef.current = Math.max(targetRef.current, target);
  }, [target, state]);

  // Creep toward the checkpoint (snap to full on complete; hold on failed).
  useEffect(() => {
    if (state === 'failed') return;
    const id = setInterval(() => {
      const t = targetRef.current;
      const cur = fill.value;
      if (t >= 1) {
        fill.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) });
        return;
      }
      if (cur >= t) return;
      fill.value = withTiming(cur + (t - cur) * APPROACH, {
        duration: TICK_MS,
        easing: Easing.linear,
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [fill, state]);

  // Orbiting head while active.
  useEffect(() => {
    if (sweep && state === 'active') {
      rotate.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1);
    } else {
      cancelAnimation(rotate);
    }
    return () => cancelAnimation(rotate);
  }, [sweep, state, rotate]);

  // Pop on entering a terminal state.
  useEffect(() => {
    if (state === 'complete' || state === 'failed') {
      pop.value = withSequence(
        withTiming(1.18, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 190, easing: Easing.out(Easing.quad) })
      );
    }
  }, [state, pop]);

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - Math.min(fill.value, 1)),
  }));
  const headStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

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
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Ionicons
            name={state === 'complete' ? 'checkmark' : 'alert'}
            size={size * 0.5}
            color={strokeColor}
          />
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
