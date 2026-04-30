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

import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { isVibeProfile } from '@/lib/migrateRecipe';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useBotThumbnails } from '@/hooks/useBotThumbnails';
import { curateBotsForAesthetics } from '@/lib/curatedBots';
import { getBotProfile } from '@/lib/botProfiles';
import * as nav from '@/lib/navigate';

const SEEN_BOT_INTRO_KEY = 'dreambot.seenBotIntro.v1';

export default function MeetTheBotsScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: allBots = [], isLoading: botsLoading } = useBotUsers();
  const { data: thumbnails } = useBotThumbnails(3);
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  const [aesthetics, setAesthetics] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Mark the screen as seen the moment we render — this is the user's
  // explicit visit, even if they bounce out without following anyone.
  useEffect(() => {
    AsyncStorage.setItem(SEEN_BOT_INTRO_KEY, '1').catch(() => {});
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
              />
            ))
          )}
        </ScrollView>
      )}

      <View style={s.footer}>
        <TouchableOpacity style={s.doneBtn} onPress={handleDone} activeOpacity={0.7}>
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BotCard({
  bot,
  isFollowing,
  thumbnailUrls,
}: {
  bot: BotUser;
  isFollowing: boolean;
  thumbnailUrls: string[];
}) {
  const profile = getBotProfile(bot.username);
  const { mutate: toggleFollow, isPending } = useToggleFollow();
  // Optimistic flip so the UI feels instant on tap
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const showFollowing = optimistic ?? isFollowing;

  useEffect(() => {
    setOptimistic(null);
  }, [isFollowing]);

  function handleFollow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOptimistic(!showFollowing);
    toggleFollow(
      { userId: bot.id, currentlyFollowing: showFollowing, isPublic: true },
      { onError: () => setOptimistic(null) }
    );
  }

  function handleAvatarTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.push(`/user/${bot.id}`);
  }

  function handleThumbnailTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.push(`/user/${bot.id}`);
  }

  const tagline = profile?.tagline ?? 'AI bot';
  const tags = profile?.tags ?? [];

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <TouchableOpacity onPress={handleAvatarTap} activeOpacity={0.7}>
          {bot.avatar_url ? (
            <Image source={{ uri: bot.avatar_url }} style={s.avatar} contentFit="cover" />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
            </View>
          )}
        </TouchableOpacity>
        <View style={s.cardText}>
          <TouchableOpacity onPress={handleAvatarTap} activeOpacity={0.7}>
            <Text style={s.username}>{bot.username}</Text>
          </TouchableOpacity>
          <Text style={s.tagline}>{tagline}</Text>
          {tags.length > 0 && <Text style={s.tagsLine}>{tags.join(' · ')}</Text>}
        </View>
        <TouchableOpacity
          style={[s.followBtn, showFollowing && s.followBtnActive]}
          onPress={handleFollow}
          disabled={isPending}
          activeOpacity={0.7}
        >
          <Text style={[s.followBtnText, showFollowing && s.followBtnTextActive]}>
            {showFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>

      {profile?.description && <Text style={s.description}>{profile.description}</Text>}

      <View style={s.thumbnailRow}>
        {[0, 1, 2].map((idx) => {
          const url = thumbnailUrls[idx];
          return (
            <TouchableOpacity
              key={idx}
              style={s.thumbnail}
              onPress={url ? handleThumbnailTap : undefined}
              activeOpacity={0.7}
              disabled={!url}
            >
              {url ? (
                <Image source={{ uri: url }} style={s.thumbnailImage} contentFit="cover" />
              ) : (
                <View style={s.thumbnailEmpty}>
                  <Ionicons name="moon-outline" size={20} color={colors.border} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  tagsLine: {
    color: colors.textSecondary,
    fontSize: 11,
    opacity: 0.7,
    marginTop: 2,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.accent,
  },
  followBtnActive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: colors.textSecondary,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  thumbnail: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
