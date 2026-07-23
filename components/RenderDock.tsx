/**
 * RenderDock — the ambient "your dreams are cooking" pill above the tab bar.
 *
 * Mounted inside the tab navigator's tabBar (so it's on all 5 tabs and fades
 * with the HUD on the immersive feed), positioned just above the bar. Shows the
 * user's in-flight dream count + current stage, or a brief "ready ✨" / failed
 * flash when one finishes. Tapping it opens Profile ▸ Dreams (the pending-tile
 * tracker). It reserves layout space via the renderDock store's `dockHeight`, so
 * every tab surface eases content up to clear it. See DREAM_TRACKING_PLAN.md.
 *
 * v1 notes: the ready-flash routes to Profile ▸ Dreams (consistent with the
 * rendering tap) rather than jumping straight to the finished dream's fullscreen
 * — a follow-up can add the direct-to-reveal path. The `bottomOffset` is an
 * approximation of the tab-bar height (paddingTop + icon + safe-area pad); tune
 * if a hairline gap/overlap appears.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { BrandSpinner } from '@/components/BrandSpinner';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import { useInFlightDreams } from '@/hooks/useInFlightDreams';
import { getDreamStageInfo } from '@/lib/dreamStageLabels';
import { DOCK_HEIGHT, useRenderDockStore } from '@/store/renderDock';

const FLASH_TTL_MS = 4200;

export function RenderDock({ bottomOffset }: { bottomOffset: number }) {
  const { data: inFlight = [] } = useInFlightDreams();
  const flash = useRenderDockStore((s) => s.flash);
  const clearFlash = useRenderDockStore((s) => s.clearFlash);
  const setDockHeight = useRenderDockStore((s) => s.setDockHeight);
  const requestDreamsTab = useRenderDockStore((s) => s.requestDreamsTab);

  const count = inFlight.length;
  const visible = count > 0 || flash !== null;

  // Reserve / release layout space so tab surfaces make room (0 at rest).
  useEffect(() => {
    setDockHeight(visible ? DOCK_HEIGHT : 0);
    return () => setDockHeight(0);
  }, [visible, setDockHeight]);

  // Auto-clear the completion/failure flash after its dwell.
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => clearFlash(), FLASH_TTL_MS);
    return () => clearTimeout(id);
  }, [flash, clearFlash]);

  if (!visible) return null;

  // Flash takes precedence over the rendering summary.
  let icon: React.ReactNode;
  let label: string;
  if (flash?.kind === 'ready') {
    icon = <Ionicons name="sparkles" size={16} color={colors.accentLight} />;
    label = 'Dream ready — tap to view';
  } else if (flash?.kind === 'failed') {
    icon = <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />;
    label = "Couldn't render — tap to check";
  } else if (count === 1) {
    icon = <BrandSpinner size={18} />;
    const s = getDreamStageInfo(inFlight[0].status, inFlight[0].currentStage);
    label = `${s.label}…`;
  } else {
    icon = <BrandSpinner size={18} />;
    label = `${count} dreams rendering`;
  }

  const onPress = () => {
    Haptics.selectionAsync();
    clearFlash();
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
        {icon}
        <Text style={styles.label} numberOfLines={1} allowFontScaling={false}>
          {label}
        </Text>
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
    maxWidth: horizontalScale(320),
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: verticalScale(8),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontScale(13),
    fontWeight: '600',
    flexShrink: 1,
  },
});
