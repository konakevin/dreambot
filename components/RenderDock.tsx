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

import React, { useEffect, useReducer } from 'react';
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
import { useInFlightDreams, type InFlightDream } from '@/hooks/useInFlightDreams';
import { useDreamProgress } from '@/hooks/useDreamProgress';
import { DOCK_HEIGHT, FINISHED_RING_TTL_MS, useRenderDockStore } from '@/store/renderDock';
import { deriveDockItems } from '@/lib/dockItems';

const MASCOT = require('@/assets/images/icon.png');
const MAX_RINGS = 5;
const RING_SIZE = 26;
const RING_STROKE = 3;
// How often to re-evaluate the staleness cutoff while dreams are in flight, so a
// zombie ring ages out and the dock self-heals without waiting on another event.
const STALE_TICK_MS = 30_000;

/** One dream's ring — persists across active → complete (SAME instance, keyed by
 *  jobId), so its fill CARRIES OVER: on completion the arc animates from the held
 *  value up to full instead of resetting to 0 and re-sweeping. Fills to
 *  check/alert on terminal, then removes itself after the dwell. */
function DreamRing({
  dream,
  finishedKind,
}: {
  dream: InFlightDream | null;
  finishedKind: 'ready' | 'failed' | null;
}) {
  const { target } = useDreamProgress(
    dream ?? { status: null, currentStage: null, stageUpdatedAt: null }
  );
  const state =
    finishedKind === 'ready' ? 'complete' : finishedKind === 'failed' ? 'failed' : 'active';
  return (
    <ProgressRing
      size={RING_SIZE}
      strokeWidth={RING_STROKE}
      target={state === 'active' ? target : 1}
      state={state}
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

  // Re-render on a slow tick while anything is in flight, so deriveDockItems'
  // staleness cutoff is re-evaluated even when nothing else changes — that's what
  // lets a zombie ring (a job that never reaches a terminal state: worker crash,
  // a terminal write that never landed, a missed realtime event) age out so the
  // dock self-heals instead of sitting on a phantom "rendering" ring forever.
  const [, tick] = useReducer((n: number) => n + 1, 0);
  const hasInFlight = inFlight.length > 0;
  useEffect(() => {
    if (!hasInFlight) return;
    const id = setInterval(tick, STALE_TICK_MS);
    return () => clearInterval(id);
  }, [hasInFlight]);

  // Robustly drain finished rings: schedule removal for EVERY finished entry off
  // its own timestamp — not just the ≤5 that are rendered — so an overflow ring,
  // or one recorded while the dock was unmounted, can never linger in the store
  // and hold the dock open. Declared BEFORE the early return so it runs even when
  // the dock shows nothing; removeFinished is idempotent. (Replaces the old
  // per-ring onExpire timer, which only fired for a mounted, in-view ring.)
  useEffect(() => {
    if (finished.length === 0) return;
    const timers = finished.map((f) =>
      setTimeout(
        () => removeFinished(f.jobId),
        Math.max(0, FINISHED_RING_TTL_MS - (Date.now() - f.at))
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [finished, removeFinished]);

  // Unified, jobId-keyed, createdAt-ordered list. deriveDockItems dedups a job
  // that's briefly active+finished (finished wins), drops finished rings past
  // their TTL, and — critically — drops in-flight jobs idle past the stale window
  // so a dead render can't pin the dock open (see lib/dockItems + its tests).
  const items = deriveDockItems(inFlight, finished, Date.now(), {
    finishedTtlMs: FINISHED_RING_TTL_MS,
  });

  const visible = items.length > 0;

  useEffect(() => {
    setDockHeight(visible ? DOCK_HEIGHT : 0);
    return () => setDockHeight(0);
  }, [visible, setDockHeight]);

  if (!visible) return null;

  const shown = items.slice(0, MAX_RINGS);
  const overflow = items.length - shown.length;

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
          {shown.map((it) => (
            <DreamRing key={it.jobId} dream={it.dream} finishedKind={it.finishedKind} />
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
