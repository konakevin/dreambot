/**
 * Settings → Bots — management surface for the user's bot follows.
 *
 * Mirrors the onboarding meet-the-bots screen (same BotCard layout, same
 * 3-thumbnail preview, same Follow toggle), but framed inside ScreenLayout
 * so it's accessible any time from the settings screen rather than as a
 * one-shot post-onboarding showcase.
 *
 * Ordering: bots the user already follows first, then aesthetics-curated
 * recommendations, then alphabetical for everything else. This makes it
 * useful as a management surface — you can immediately see who you follow.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenLayout } from '@/components/ScreenLayout';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { isVibeProfile } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { curateBotsForAesthetics } from '@/lib/curatedBots';
import { BotCard } from '@/components/BotCard';
import { BotImageViewer } from '@/components/BotImageViewer';

export default function SettingsBotsScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: allBots = [], isLoading: botsLoading } = useBotUsers();
  const { data: thumbnails } = useBotThumbnails(3);
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [viewer, setViewer] = useState<{ urls: string[]; initialIndex: number } | null>(null);

  const openViewer = useCallback((urls: string[], initialIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewer({ urls, initialIndex });
  }, []);
  const closeViewer = useCallback(() => {
    setViewer(null);
  }, []);

  // Pull the user's aesthetics so we can sort the bot list by relevance.
  useEffect(() => {
    if (!user) {
      setProfileLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data: recipe } = await supabase
          .from('user_recipes')
          .select('recipe')
          .eq('user_id', user.id)
          .single();
        const raw = recipe?.recipe as unknown;
        const list = isVibeProfile(raw)
          ? raw.aesthetics
          : (((raw as { aesthetics?: string[] } | null)?.aesthetics ?? []) as string[]);
        if (!cancelled) setAesthetics(list);
      } catch {
        // No recipe yet — fall through with empty aesthetics → fallback ordering
      } finally {
        if (!cancelled) setProfileLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Followed-first ordering: bots you already follow up top, then aesthetics-
  // curated recommendations, then everything else alphabetical. Dedupe by id.
  // Different from meet-the-bots (which leads with curated) — here you usually
  // want to see who you're already following first so you can manage.
  const orderedBots = useMemo<BotUser[]>(() => {
    if (allBots.length === 0) return [];
    const followed = allBots
      .filter((b) => followingSet.has(b.id))
      .sort((a, b) => a.username.localeCompare(b.username));

    const recommended = curateBotsForAesthetics(aesthetics);
    const byUsername = new Map(allBots.map((b) => [b.username.toLowerCase(), b]));

    const seen = new Set<string>(followed.map((b) => b.id));
    const recommendedTier: BotUser[] = [];
    for (const u of recommended) {
      const b = byUsername.get(u.toLowerCase());
      if (b && !seen.has(b.id)) {
        recommendedTier.push(b);
        seen.add(b.id);
      }
    }
    const tail = [...allBots]
      .filter((b) => !seen.has(b.id))
      .sort((a, b) => a.username.localeCompare(b.username));
    return [...followed, ...recommendedTier, ...tail];
  }, [allBots, aesthetics, followingSet]);

  const isLoading = botsLoading || !profileLoaded;
  const followingCount = allBots.filter((b) => followingSet.has(b.id)).length;

  return (
    <ScreenLayout header="back" title="Bots">
      <View style={s.subtitleWrap}>
        <Text style={s.subtitle}>
          Follow the bots whose taste speaks to you — their dreams will land in your feed.{' '}
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
    paddingBottom: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 30,
  },
});
