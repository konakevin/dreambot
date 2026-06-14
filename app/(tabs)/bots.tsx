/**
 * Bots tab — standalone horizontal-pager view of every bot's feed.
 *
 * Lifted from the prior home-screen bots-mode. Lives at its own tab so
 * the bot-pill horizontal slider is the dominant nav and Home stays
 * focused on Following / Explore.
 *
 * Layout:
 *   • Top overlay: BotPillRow only (no FeedTabs — this whole tab IS bots)
 *   • Body: BotsHorizontalPager (stories-style swipeable per-bot feed)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';

import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { colors, ANIM } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useBotUsers } from '@/hooks/useBotUsers';
import { trackBotViewed } from '@/lib/analytics';
import { BotsHorizontalPager } from '@/components/BotsHorizontalPager';
import { BotPillRow } from '@/components/BotPillRow';
import { prefetchDreamFeed } from '@/hooks/useDreamFeed';

function EmptyBots() {
  return (
    <View style={s.emptyWrap}>
      <Ionicons name="sparkles-outline" size={48} color={colors.textSecondary} />
      <Text style={s.emptyTitle}>Pick a bot above</Text>
      <Text style={s.emptySub}>Each bot has its own style. Tap one to see what it dreams.</Text>
    </View>
  );
}

export default function BotsScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const { data: botUsers } = useBotUsers();

  // Default: "All" view (null botId — mixed bot feed).
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  // Re-tap active Bots tab → reset selection back to "All" + clear per-bot
  // scroll memory so every bot starts at its latest card. The actual feed
  // refresh rides on feedSeed (regenerateSeed in the tab listener) — that
  // changes every bots query key, so the prefetch effect below re-warms each
  // bot feed and each page refetches the latest. Setting selectedBotId=null
  // makes the pager snap back to the "All" page (its external-sync effect).
  const botsResetToken = useFeedStore((s) => s.botsResetToken);
  const skipFirstBotsReset = useRef(true);

  // Per-bot scroll-memory Map — within a single tab visit, scrolling
  // around between bots preserves each one's last visible card index.
  // On tab blur, the cleanup below clears the Map so leaving + coming
  // back to the Bots tab resets every bot to index 0. Lives in a ref
  // (not state) so updates don't trigger re-renders of this screen.
  const indexMapRef = useRef<Map<string, number>>(new Map());
  useFocusEffect(
    useCallback(() => {
      return () => {
        indexMapRef.current.clear();
      };
    }, [])
  );

  useEffect(() => {
    if (skipFirstBotsReset.current) {
      skipFirstBotsReset.current = false;
      return;
    }
    setSelectedBotId(null);
    indexMapRef.current.clear();
  }, [botsResetToken]);

  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value < 0.5 ? 'none' : 'auto',
  }));
  const setHudVisible = useFeedStore((s) => s.setHudVisible);
  const handleHudToggle = useCallback(
    (visible: boolean) => {
      overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: ANIM.HUD_FADE_MS });
      setHudVisible(visible);
    },
    [overlayOpacity, setHudVisible]
  );

  // Prebuffer per-bot feeds + first 5 images so the horizontal swipe
  // between bots feels instant. prefetchDreamFeed warms BOTH the
  // TanStack query cache AND the expo-image cache, so adjacent-bot
  // pages render with no shimmer.
  //
  // This runs again on tab mount alongside the app-load prefetch in
  // home/index.tsx — they share the same query cache so the second
  // call is a cheap no-op when the cache is already warm.
  useEffect(() => {
    if (!botUsers?.length || !user) return;
    prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, null);
    for (const bot of botUsers) {
      prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, bot.id);
    }
  }, [botUsers, user, feedSeed, queryClient]);

  return (
    <View style={s.root}>
      {botUsers && botUsers.length > 0 ? (
        <BotsHorizontalPager
          bots={botUsers}
          selectedBotId={selectedBotId}
          onSelectedBotChange={(id) => {
            setSelectedBotId(id);
            if (id)
              trackBotViewed({
                bot_id: id,
                bot_name: botUsers?.find((b) => b.id === id)?.username,
              });
          }}
          onHudToggle={handleHudToggle}
          emptyComponent={<EmptyBots />}
          indexMapRef={indexMapRef}
        />
      ) : (
        <EmptyBots />
      )}

      <Animated.View style={[s.topOverlayWrap, overlayStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
          style={[s.topOverlay, { paddingTop: insets.top, paddingBottom: verticalScale(28) }]}
          pointerEvents="box-none"
        >
          {botUsers && botUsers.length > 0 && (
            <BotPillRow
              bots={botUsers}
              selectedBotId={selectedBotId}
              onSelect={(id) => {
                setSelectedBotId(id);
                if (id)
                  trackBotViewed({
                    bot_id: id,
                    bot_name: botUsers?.find((b) => b.id === id)?.username,
                  });
              }}
            />
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: fontScale(20), fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: fontScale(15), textAlign: 'center' },
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: {},
});
