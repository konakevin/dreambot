import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// Height (px) of the self-held pull-to-refresh gap the spinner rests in.
export const PULL_REFRESH_GAP = 56;

/**
 * Animated height for a SELF-HELD pull-to-refresh gap.
 *
 * The native RefreshControl's spinner AND its held-open gap are both unreliable
 * on the New Architecture (Fabric, RN 0.81, react-native#56343 — it drops the
 * control's prop updates, so it rendered gray / purple / doubled / nothing
 * across identical configs). So the grids pin `refreshing={false}` (the flaky
 * native spinner never shows) and hold the gap themselves with this value,
 * resting their own <ActivityIndicator> in it — the same reliable pattern the
 * home feed's VerticalPager uses (Kevin 2026-07-12).
 *
 * Usage: put an `<Animated.View style={{ height }} />` at the TOP of the list
 * (ListHeaderComponent) and an absolutely-positioned spinner over the gap.
 */
export function useRefreshGap(isPulling: boolean): Animated.Value {
  const gapHeight = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(gapHeight, {
      toValue: isPulling ? PULL_REFRESH_GAP : 0,
      duration: 180,
      useNativeDriver: false, // height can't run on the native driver
    }).start();
  }, [isPulling, gapHeight]);
  return gapHeight;
}
