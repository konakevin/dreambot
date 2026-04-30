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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

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
                onOpenViewer={openViewer}
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

      {viewer && (
        <ImageViewer urls={viewer.urls} initialIndex={viewer.initialIndex} onClose={closeViewer} />
      )}
    </SafeAreaView>
  );
}

/**
 * Fullscreen swipeable image viewer. No overlays except the X close badge.
 * Horizontal pager-style FlatList scrolls between the bot's 3 thumbnails.
 * Initial scroll position respects which thumbnail the user tapped.
 */
function ImageViewer({
  urls,
  initialIndex,
  onClose,
}: {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const listRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      Haptics.selectionAsync();
    }
  }

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  return (
    <Modal visible animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={vs.root}>
        <FlatList
          ref={listRef}
          data={urls}
          keyExtractor={(url, idx) => `${idx}-${url}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_W,
            offset: SCREEN_W * index,
            index,
          })}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={vs.page}>
              <Image source={{ uri: item }} style={vs.image} contentFit="contain" />
            </View>
          )}
        />

        <SafeAreaView style={vs.closeWrap} pointerEvents="box-none">
          <TouchableOpacity
            style={vs.closeBtn}
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function BotCard({
  bot,
  isFollowing,
  thumbnailUrls,
  onOpenViewer,
}: {
  bot: BotUser;
  isFollowing: boolean;
  thumbnailUrls: string[];
  onOpenViewer: (urls: string[], initialIndex: number) => void;
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

  // Avatar is non-interactive (no tapping out during onboarding). Thumbnails
  // open a fullscreen swipeable viewer so users can preview content before
  // following — the viewer itself doesn't navigate to the bot's profile.
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        {bot.avatar_url ? (
          <Image source={{ uri: bot.avatar_url }} style={s.avatar} contentFit="cover" />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
          </View>
        )}
        <View style={s.cardText}>
          <Text style={s.username}>{bot.username}</Text>
          {profile?.description && <Text style={s.tagline}>{profile.description}</Text>}
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

      <View style={s.thumbnailRow}>
        {[0, 1, 2].map((idx) => {
          const url = thumbnailUrls[idx];
          if (!url) {
            return (
              <View key={idx} style={s.thumbnail}>
                <View style={s.thumbnailEmpty}>
                  <Ionicons name="moon-outline" size={20} color={colors.border} />
                </View>
              </View>
            );
          }
          return (
            <TouchableOpacity
              key={idx}
              style={s.thumbnail}
              onPress={() => onOpenViewer(thumbnailUrls, idx)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: url }} style={s.thumbnailImage} contentFit="cover" />
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

const vs = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  page: {
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  closeWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeBtn: {
    margin: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
