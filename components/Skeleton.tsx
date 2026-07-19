/**
 * Skeleton — shimmer placeholder for loading states.
 * Renders a pulsing gradient block that indicates content is loading.
 * Much better perceived performance than a spinner.
 */

import { useEffect } from 'react';
import { verticalScale } from '@/lib/responsive';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BrandSpinner } from '@/components/BrandSpinner';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { TILE_WIDTH, TILE_HEIGHT } from '@/constants/grid';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ShimmerBlock({ style }: { style?: Record<string, unknown> }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.surface, borderRadius: 8 }, style, animStyle]}
    />
  );
}

/** Full-screen cold-load screen — brand wordmark + spinner on pure black. */
export function FeedCardSkeleton() {
  return (
    <View style={s.feedCard}>
      {/* Brand wordmark, dead-centered to match StartupLogo + the native splash
          (the SAME 220pt image → no size/position pop at the cold-start handoff),
          so the startup logo simply STAYS and the spinner appears below it,
          instead of the logo vanishing to a bare spinner (Kevin 2026-07-19). Do
          NOT swap the image for GradientTitle text — it renders a different width
          and pops (see StartupLogo). */}
      <View style={s.feedLogo} pointerEvents="none">
        <Image
          source={require('@/assets/images/splash-wordmark.png')}
          style={s.feedWordmark}
          contentFit="contain"
        />
      </View>
      <View style={s.feedSpinner} pointerEvents="none">
        <View style={{ transform: [{ translateY: verticalScale(64) }] }}>
          <BrandSpinner size={44} />
        </View>
      </View>
    </View>
  );
}

/** Grid tile skeleton — matches PostTile layout (3-col portrait) */
export function GridTileSkeleton() {
  return <ShimmerBlock style={{ width: TILE_WIDTH, height: TILE_HEIGHT, borderRadius: 0 }} />;
}

/** Grid skeleton — 3-column portrait grid of shimmer tiles. */
export function GridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <View style={s.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <GridTileSkeleton key={i} />
      ))}
    </View>
  );
}

/** Inbox row skeleton */
export function InboxRowSkeleton() {
  return (
    <View style={s.inboxRow}>
      <ShimmerBlock style={{ width: 44, height: 44, borderRadius: 22 }} />
      <View style={{ flex: 1, gap: 6 }}>
        <ShimmerBlock style={{ width: '70%', height: 14 }} />
        <ShimmerBlock style={{ width: '40%', height: 10 }} />
      </View>
    </View>
  );
}

/** Inbox skeleton — multiple rows */
export function InboxSkeleton({ count = 8 }: { count?: number }) {
  return (
    <View style={{ gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <InboxRowSkeleton key={i} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  feedCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  feedSpinner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedLogo: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 220pt = a literal match to StartupLogo + the native splash imageWidth, so the
  // wordmark is pixel-identical across the handoff (no pop).
  feedWordmark: {
    width: 220,
    aspectRatio: 1812 / 304,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  inboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
  },
});
