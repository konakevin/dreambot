/**
 * Meet the Bots — onboarding screen shown ONCE after the user posts their
 * first dream. Replaces the small bottom-sheet preview with a full
 * showcase of every bot: avatar, tagline, 3 sample post thumbnails,
 * Follow button.
 *
 * Order: bots curated to the user's selected aesthetics first (using the
 * existing `curateBotsForAesthetics` scoring), then alphabetical for the
 * rest. Tapping a thumbnail opens that bot's profile.
 *
 * One-time gating: same AsyncStorage flag as the legacy sheet
 * (`dreambot.seenBotIntro.v1`). The flag is set the moment the user
 * lands on this screen so they can't get re-trapped if they kill the
 * app mid-flow.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { isVibeProfile } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { curateBotsForAesthetics } from '@/lib/curatedBots';
import { BotCard } from '@/components/BotCard';
import { BotImageViewer } from '@/components/BotImageViewer';

const SEEN_BOT_INTRO_KEY = 'dreambot.seenBotIntro.v1';

export default function MeetTheBotsScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: allBots = [], isLoading: botsLoading } = useBotUsers();
  const { data: thumbnails } = useBotThumbnails(3);
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // Fullscreen image viewer state — null when closed, otherwise the urls + which one was tapped
  const [viewer, setViewer] = useState<{ urls: string[]; initialIndex: number } | null>(null);

  const openViewer = useCallback((urls: string[], initialIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewer({ urls, initialIndex });
  }, []);
  const closeViewer = useCallback(() => {
    setViewer(null);
  }, []);

  // Mark the screen as seen the moment we render — this is the user's
  // explicit visit, even if they bounce out without following anyone.
  useEffect(() => {
    AsyncStorage.setItem(SEEN_BOT_INTRO_KEY, '1').catch((e) => {
      if (__DEV__) console.warn('[meet-the-bots] seen-flag persist failed', e);
    });
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

  // Curated-first ordering: top recommendations from the user's aesthetics,
  // then everything else alphabetical for stable layout. Dedupe by id.
  const orderedBots = useMemo<BotUser[]>(() => {
    if (allBots.length === 0) return [];
    const recommended = curateBotsForAesthetics(aesthetics);
    const byUsername = new Map(allBots.map((b) => [b.username.toLowerCase(), b]));

    const seen = new Set<string>();
    const head: BotUser[] = [];
    for (const u of recommended) {
      const b = byUsername.get(u.toLowerCase());
      if (b && !seen.has(b.id)) {
        head.push(b);
        seen.add(b.id);
      }
    }
    const tail = [...allBots]
      .filter((b) => !seen.has(b.id))
      .sort((a, b) => a.username.localeCompare(b.username));
    return [...head, ...tail];
  }, [allBots, aesthetics]);

  function handleDone() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // The user just followed bots on this screen. Regenerate the feed seed so
    // the home screen's FIRST feed fetch uses a fresh query key — otherwise the
    // Explore (forYou) tab can serve a stale/following-only cache warmed earlier
    // in the session, and the all-public mix only appears after a manual app
    // refresh (which regenerates the seed the same way). This makes Explore
    // correct on first entry; Following stays correctly scoped to follows.
    useFeedStore.getState().regenerateSeed();
    router.replace('/(tabs)');
  }

  const isLoading = botsLoading || !profileLoaded;

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Meet the bots</Text>
        <Text style={s.subtitle}>
          Each bot has its own taste. Follow the ones whose style speaks to you — their dreams will
          land in your feed alongside everyone else&apos;s.
        </Text>
      </View>

      {isLoading ? (
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

      <View style={s.footer}>
        <TouchableOpacity style={s.doneBtn} onPress={handleDone} activeOpacity={0.7}>
          <Text style={s.doneBtnText}>Take me to my feed</Text>
        </TouchableOpacity>
      </View>

      {viewer && (
        <BotImageViewer
          urls={viewer.urls}
          initialIndex={viewer.initialIndex}
          onClose={closeViewer}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  doneBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
