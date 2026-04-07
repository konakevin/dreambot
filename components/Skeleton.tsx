/**
 * Skeleton — shimmer placeholder for loading states.
 * Renders a pulsing gradient block that indicates content is loading.
 * Much better perceived performance than a spinner.
 */

import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ShimmerBlock({ style }: { style?: Record<string, unknown> }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.surface, borderRadius: 8 }, style, animStyle]}
    />
  );
}

/** Full-screen card skeleton — matches DreamCard layout */
export function FeedCardSkeleton() {
  return (
    <View style={s.feedCard}>
      <ShimmerBlock style={{ ...StyleSheet.absoluteFillObject, borderRadius: 0 }} />
      <View style={s.feedBottom}>
        <View style={s.feedUserRow}>
          <ShimmerBlock style={{ width: 32, height: 32, borderRadius: 16 }} />
          <View style={{ gap: 4 }}>
            <ShimmerBlock style={{ width: 100, height: 14 }} />
            <ShimmerBlock style={{ width: 60, height: 10 }} />
          </View>
        </View>
      </View>
      <View style={s.feedSide}>
        <ShimmerBlock style={{ width: 28, height: 28, borderRadius: 14 }} />
        <ShimmerBlock style={{ width: 28, height: 28, borderRadius: 14 }} />
        <ShimmerBlock style={{ width: 28, height: 28, borderRadius: 14 }} />
      </View>
    </View>
  );
}

/** Grid tile skeleton — matches PostTile layout */
export function GridTileSkeleton() {
  const size = (SCREEN_WIDTH - 2) / 2;
  return <ShimmerBlock style={{ width: size, height: size, borderRadius: 0 }} />;
}

/** Grid skeleton — 2-column grid of shimmer tiles */
export function GridSkeleton({ count = 6 }: { count?: number }) {
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
    justifyContent: 'flex-end',
  },
  feedBottom: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  feedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedSide: {
    position: 'absolute',
    right: 12,
    bottom: 110,
    gap: 20,
    alignItems: 'center',
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
    paddingVertical: 12,
  },
});
