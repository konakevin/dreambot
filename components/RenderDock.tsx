/**
 * RenderDock — the ambient "your dreams are cooking" pill above the tab bar.
 *
 * A DreamBot mascot glyph (branding + whimsy) followed by one ring per in-flight
 * dream, each filling to its render stage. No changing text — the ring count is
 * the count, the fill is the progress. When a dream finishes its ring fills,
 * shows a check (or alert on failure) with a little pop, then drops off. Past 5
 * dreams it shows 5 rings + "+N"; tapping anywhere opens Profile ▸ Dreams (the
 * full pending-tile tracker). Mounted in the tab bar so it's on all 5 tabs and
 * fades with the HUD on the immersive feed. See DREAM_TRACKING_PLAN.md.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { ProgressRing } from '@/components/ProgressRing';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import { useInFlightDreams } from '@/hooks/useInFlightDreams';
import { getDreamStageInfo } from '@/lib/dreamStageLabels';
import { DOCK_HEIGHT, useRenderDockStore, type FinishedRing } from '@/store/renderDock';

const MASCOT = require('@/assets/images/icon.png');
const MAX_RINGS = 5;
const RING_SIZE = 26;
const RING_STROKE = 3;
const FINISHED_TTL_MS = 1500;

/** A finished dream's ring — plays its completion then removes itself. */
function CompletingRing({ item, onExpire }: { item: FinishedRing; onExpire: () => void }) {
  useEffect(() => {
    const id = setTimeout(onExpire, FINISHED_TTL_MS);
    return () => clearTimeout(id);
  }, [onExpire]);
  return (
    <ProgressRing
      size={RING_SIZE}
      strokeWidth={RING_STROKE}
      target={1}
      state={item.kind === 'ready' ? 'complete' : 'failed'}
      sweep={false}
    />
  );
}

export function RenderDock({ bottomOffset }: { bottomOffset: number }) {
  const { data: inFlight = [] } = useInFlightDreams();
  const finished = useRenderDockStore((s) => s.finished);
  const removeFinished = useRenderDockStore((s) => s.removeFinished);
  const setDockHeight = useRenderDockStore((s) => s.setDockHeight);
  const requestDreamsTab = useRenderDockStore((s) => s.requestDreamsTab);

  // A dream that just went terminal is briefly in BOTH sets (finished pushed by
  // realtime before useInFlightDreams refetches) — dedup so its ring doesn't
  // double up. Completing rings render first (they own the animation slot).
  const finishedIds = new Set(finished.map((f) => f.jobId));
  const active = inFlight.filter((d) => !finishedIds.has(d.id));
  const total = finished.length + active.length;
  const visible = total > 0;

  useEffect(() => {
    setDockHeight(visible ? DOCK_HEIGHT : 0);
    return () => setDockHeight(0);
  }, [visible, setDockHeight]);

  if (!visible) return null;

  // Fill up to MAX_RINGS: completing rings first, then active; the rest → "+N".
  const shownFinished = finished.slice(0, MAX_RINGS);
  const activeSlots = Math.max(0, MAX_RINGS - shownFinished.length);
  const shownActive = active.slice(0, activeSlots);
  const overflow = total - (shownFinished.length + shownActive.length);

  const onPress = () => {
    Haptics.selectionAsync();
    requestDreamsTab();
    router.navigate('/(tabs)/profile');
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={[styles.wrap, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <Pressable style={styles.pill} onPress={onPress} accessibilityRole="button">
        <Image source={MASCOT} style={styles.mascot} contentFit="cover" />
        <View style={styles.rings}>
          {shownFinished.map((f) => (
            <CompletingRing key={f.jobId} item={f} onExpire={() => removeFinished(f.jobId)} />
          ))}
          {shownActive.map((d) => (
            <ProgressRing
              key={d.id}
              size={RING_SIZE}
              strokeWidth={RING_STROKE}
              target={getDreamStageInfo(d.status, d.currentStage).target}
              state="active"
              sweep={false}
            />
          ))}
        </View>
        {overflow > 0 ? <Text style={styles.overflow}>+{overflow}</Text> : null}
        <Ionicons name="chevron-forward" size={14} color={colors.subtleOnDark} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: DOCK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: verticalScale(6),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
  },
  mascot: {
    width: 26,
    height: 26,
    borderRadius: 7,
  },
  rings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overflow: {
    color: colors.bodyOnDark,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
});
