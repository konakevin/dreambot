/**
 * RefreshIndicator — floating feedback at the top of fullscreen feeds.
 *
 * Two modes:
 *   1. Pull-to-refresh hint (tracks pullY shared value, shows "Pull/Release to refresh")
 *   2. Refreshing spinner (shows Spinner while data is loading)
 *
 * FullScreenFeed uses mode 2 (isRefreshing prop).
 */

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Spinner } from '@/components/Spinner';

interface RefreshIndicatorProps {
  visible: boolean;
}

export function RefreshIndicator({ visible }: RefreshIndicatorProps) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={[s.container, { top: insets.top + 12 }]}
      pointerEvents="none"
    >
      <Spinner />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
});
