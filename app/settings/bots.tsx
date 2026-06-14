/**
 * Settings → Bots — management surface for the user's bot follows.
 *
 * Mirrors the onboarding BotSelectorStep (same BotCard layout, same
 * 3-thumbnail preview, same Follow toggle), but framed inside ScreenLayout
 * so it's accessible any time from the settings screen rather than as a
 * one-shot in-onboarding step.
 *
 * Ordering: bots the user already follows first, then alphabetical for
 * everything else. (Aesthetics-curated middle tier was removed when
 * Kevin pivoted away from onboarding-time vibe selection 2026-05-29.)
 * This makes it useful as a management surface — you can immediately
 * see who you follow.
 */

import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '@/components/AppText';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { BotCard } from '@/components/BotCard';
import { BotImageViewer } from '@/components/BotImageViewer';

export default function SettingsBotsScreen() {
  const { data: allBots = [], isLoading: botsLoading } = useBotUsers();
  const { data: thumbnails } = useBotThumbnails(3);
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  const [viewer, setViewer] = useState<{ urls: string[]; initialIndex: number } | null>(null);

  const openViewer = useCallback((urls: string[], initialIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewer({ urls, initialIndex });
  }, []);
  const closeViewer = useCallback(() => {
    setViewer(null);
  }, []);

  // Followed-first ordering: bots you already follow up top, then
  // everything else alphabetical. The aesthetics-driven recommended tier
  // in the middle was removed when Kevin pivoted away from onboarding
  // vibe selection 2026-05-29 — no user-curated aesthetics means no
  // signal to rank against.
  const orderedBots = useMemo<BotUser[]>(() => {
    if (allBots.length === 0) return [];
    const followed = allBots
      .filter((b) => followingSet.has(b.id))
      .sort((a, b) => a.username.localeCompare(b.username));
    const followedIds = new Set<string>(followed.map((b) => b.id));
    const tail = [...allBots]
      .filter((b) => !followedIds.has(b.id))
      .sort((a, b) => a.username.localeCompare(b.username));
    return [...followed, ...tail];
  }, [allBots, followingSet]);

  const isLoading = botsLoading;
  const followingCount = allBots.filter((b) => followingSet.has(b.id)).length;

  return (
    <ScreenLayout header="back" title="Bots" swipeBack={false}>
      <View style={s.subtitleWrap}>
        <Text style={s.subtitle}>
          Follow the bots whose taste speaks to you. Their dreams will land in your feed.{' '}
          {followingCount > 0
            ? `Following ${followingCount} of ${allBots.length}.`
            : `${allBots.length} available.`}
        </Text>
      </View>

      {isLoading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {orderedBots.length === 0 ? (
            <Text style={s.emptyText}>No bots available right now.</Text>
          ) : (
            orderedBots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                isFollowing={followingSet.has(bot.id)}
                thumbnailUrls={thumbnails?.get(bot.id) ?? []}
                onOpenViewer={openViewer}
                onPressBot={() => router.push(`/user/${bot.id}`)}
              />
            ))
          )}
        </ScrollView>
      )}

      {viewer && (
        <BotImageViewer
          urls={viewer.urls}
          initialIndex={viewer.initialIndex}
          onClose={closeViewer}
        />
      )}
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  subtitleWrap: {
    paddingHorizontal: 24,
    paddingBottom: verticalScale(12),
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: verticalScale(24),
    gap: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    paddingVertical: verticalScale(30),
  },
});
