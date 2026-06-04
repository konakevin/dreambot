/**
 * Bot selector — onboarding step where the user picks which bots to
 * follow before their first dream is generated. Was a standalone
 * post-reveal screen (`app/onboarding/meet-the-bots.tsx`); pulled in-flow
 * 2026-06-03 so it gets the same pager Back/Next chrome as the rest of
 * onboarding. The standalone route was removed in the same commit.
 *
 * Order: alphabetical by username — same neutral order the standalone
 * screen used. Tapping a thumbnail opens that bot's profile.
 */

import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFeedStore } from '@/store/feed';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { BotCard } from '@/components/BotCard';
import { BotImageViewer } from '@/components/BotImageViewer';
import { OnboardingFooter } from './OnboardingFooter';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function BotSelectorStep({ onNext, onBack }: Props) {
  const { data: allBots = [], isLoading: botsLoading } = useBotUsers();
  const { data: thumbnails } = useBotThumbnails(3);
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  // Fullscreen image viewer — null when closed.
  const [viewer, setViewer] = useState<{ urls: string[]; initialIndex: number } | null>(null);

  const openViewer = useCallback((urls: string[], initialIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewer({ urls, initialIndex });
  }, []);
  const closeViewer = useCallback(() => setViewer(null), []);

  const orderedBots = useMemo<BotUser[]>(
    () => [...allBots].sort((a, b) => a.username.localeCompare(b.username)),
    [allBots]
  );

  function handleNext() {
    // The user just (possibly) followed bots. Regen the feed seed so the
    // Explore tab's first fetch uses a fresh query key — otherwise it can
    // serve a stale following-only cache warmed earlier in the session and
    // the all-public mix only appears after a manual app refresh. Same
    // regen that the legacy standalone screen did on "Take me to my feed."
    useFeedStore.getState().regenerateSeed();
    onNext();
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>What do you want to see?</Text>
        <Text style={s.subtitle}>
          Pick at least one bot for your Following tab. The home feed always shows a popular mix
          from everyone, and you can change who you follow anytime in settings.
        </Text>
      </View>

      {botsLoading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {orderedBots.length === 0 ? (
            <Text style={s.emptyText}>No bots available right now. Skip ahead.</Text>
          ) : (
            orderedBots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                isFollowing={followingSet.has(bot.id)}
                thumbnailUrls={thumbnails?.get(bot.id) ?? []}
                onOpenViewer={openViewer}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Following ≥1 bot is required — Next stays disabled until at
          least one bot is followed so the user's feed isn't empty on
          first launch. */}
      <OnboardingFooter
        onNext={handleNext}
        onBack={onBack}
        disabled={followingSet.size === 0}
        counter={
          followingSet.size === 0 ? 'Pick at least one bot' : `${followingSet.size} following`
        }
        counterMet={followingSet.size > 0}
      />

      {viewer && (
        <BotImageViewer
          urls={viewer.urls}
          initialIndex={viewer.initialIndex}
          onClose={closeViewer}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // The shared OnboardingFooter is `position: absolute` (bottom-anchored)
  // and ~120px tall (button + safe-area). Padding the scroll content past
  // it so the last bot (YumBot) can fully scroll above the floating chrome
  // instead of being clipped underneath.
  scrollContent: { paddingHorizontal: 16, paddingBottom: 140, gap: 12 },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 30,
  },
});
