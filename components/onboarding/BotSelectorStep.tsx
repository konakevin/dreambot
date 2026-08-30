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
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '@/components/AppText';
import * as Haptics from 'expo-haptics';
import { useFeedStore } from '@/store/feed';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { BotCard } from '@/components/BotCard';
import { BotImageViewer } from '@/components/BotImageViewer';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { verticalScale, fontScale, screen } from '@/lib/responsive';
import { OnboardingFooter } from './OnboardingFooter';

const TITLE_TEXT = 'Build your dream team';

// Minimum bots to follow before continuing — one bot made for a dead-feeling
// first feed; three guarantees a decent mix on first launch.
const MIN_BOTS = 3;

interface Props {
  onNext: () => void;
  onBack: () => void;
  /** Footer button label. In onboarding this is the last step before the reveal,
   *  so it defaults to 'See my first dream'. */
  nextLabel?: string;
}

export function BotSelectorStep({ onNext, onBack, nextLabel = 'See my first dream' }: Props) {
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

  // Count ONLY the bots followed — `followingSet` also contains real-user
  // follows, which must not count toward the "pick at least one bot" gate
  // or the footer counter (the user could already follow people and that
  // would wrongly satisfy the requirement / inflate the number).
  const followedBotCount = useMemo(
    () => orderedBots.reduce((n, bot) => (followingSet.has(bot.id) ? n + 1 : n), 0),
    [orderedBots, followingSet]
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
        <GradientTitle
          size={TITLE_SIZE.page}
          weight={700}
          letterSpacing={0.5}
          numberOfLines={2}
          maxWidth={screen.width - 56}
          style={s.title}
        >
          {TITLE_TEXT}
        </GradientTitle>
        <Text style={s.subtitle}>
          Flowers, dragons, deep space, tiny villages. Follow the Bots you like and their dreams
          drift into your feed.
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

      {/* Following ≥MIN_BOTS is required — Next stays disabled until enough
          bots are followed so the user's feed isn't empty on first launch.
          The counter row signposts progress; the disabled button says
          exactly how many are still needed. Gate only applies when the bot
          list actually loaded (the empty state says "skip ahead" — don't
          dead-end it against a disabled button). */}
      <OnboardingFooter
        onNext={handleNext}
        onBack={onBack}
        hideBack
        nextLabel={nextLabel}
        disabled={orderedBots.length > 0 && followedBotCount < MIN_BOTS}
        disabledLabel={`Follow ${MIN_BOTS - followedBotCount} more to continue`}
        nextVariant="gradient"
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
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    alignItems: 'center',
  },
  // Standardized hero title: size 24, sentence case, 2-line wrap fallback —
  // shared across all intro screens (FeedIntroGate / CreateIntroSheet /
  // MediumsIntroSheet). FIXED size (no adjustsFontSizeToFit) — auto-fit races
  // the Modal's SafeAreaProvider layout and collapses the gradient to min size
  // on re-mount. Only spacing lives here; font + gradient come from GradientTitle.
  title: {
    marginBottom: verticalScale(10),
  },
  // Near-white per the onboarding text cadence (gray reads washed-out on black).
  subtitle: {
    color: colors.bodyOnDark,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
  },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Footer is now in-flow (was absolute) — only a small tail buffer needed.
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: verticalScale(16),
    gap: verticalScale(12),
  },
  emptyText: {
    color: colors.subtleOnDark,
    fontSize: fontScale(14),
    textAlign: 'center',
    paddingVertical: verticalScale(30),
  },
});
