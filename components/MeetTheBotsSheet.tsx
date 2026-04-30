/**
 * MeetTheBotsSheet — one-time onboarding moment shown after the user posts
 * (or skips) their first dream and lands on home. Introduces 4-6 bots
 * curated to their aesthetic selections, with one-tap follow buttons.
 *
 * Transparency strategy: the sheet header explicitly says "real humans + AI
 * bots" — Kevin wants users to know the app is intentionally seeded with
 * bots from day 1.
 *
 * Persistence: the "has seen" flag lives in AsyncStorage (not the database).
 * The sheet renders once per device per install. Re-installs see it again,
 * which is fine.
 *
 * Bot list source: live `useBotUsers` hook hits `get_bot_users` RPC. If a
 * curated username isn't in the live list (renamed, retired), it silently
 * drops out — we never hardcode bot names in UI.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { useBotUsers, type BotUser } from '@/hooks/useBotUsers';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { curateBotsForAesthetics } from '@/lib/curatedBots';

interface Props {
  visible: boolean;
  /** User's selected aesthetics — drives which bots are featured. */
  aesthetics: readonly string[];
  onDismiss: () => void;
}

export function MeetTheBotsSheet({ visible, aesthetics, onDismiss }: Props) {
  const { data: allBots = [], isLoading } = useBotUsers();
  const { data: followingIds = [] } = useFollowingIds();
  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  // Compute curated featured bots once per visible-cycle. We don't memoize
  // across re-mounts because aesthetics could change between sessions.
  const featured = useMemo(() => {
    if (allBots.length === 0) return [];
    const usernames = curateBotsForAesthetics(aesthetics);
    const byUsername = new Map(allBots.map((b) => [b.username.toLowerCase(), b]));
    const matches: BotUser[] = [];
    for (const u of usernames) {
      const b = byUsername.get(u.toLowerCase());
      if (b) matches.push(b);
    }
    // If curation produces <3 matches, top up from any available bots
    if (matches.length < 3) {
      for (const b of allBots) {
        if (matches.length >= 4) break;
        if (!matches.some((m) => m.id === b.id)) matches.push(b);
      }
    }
    return matches.slice(0, 6);
  }, [allBots, aesthetics]);

  function handleDismiss() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleDismiss}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.handleBar} />
          <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={s.header}>
              <Ionicons name="people-circle" size={36} color={colors.accent} />
              <Text style={s.title}>Meet some friendly faces</Text>
              <Text style={s.body}>
                DreamBot is a creative playground. Real humans dream here, and so do a roster of AI
                bots — each with their own taste. Follow whichever ones speak to you.
              </Text>
            </View>

            {isLoading ? (
              <View style={s.loading}>
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : featured.length === 0 ? (
              <Text style={s.emptyText}>No bots available right now. Skip ahead!</Text>
            ) : (
              <View style={s.list}>
                {featured.map((bot) => (
                  <BotRow key={bot.id} bot={bot} isFollowing={followingSet.has(bot.id)} />
                ))}
              </View>
            )}
          </ScrollView>

          <View style={s.footer}>
            <TouchableOpacity style={s.doneBtn} onPress={handleDismiss} activeOpacity={0.7}>
              <Text style={s.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function BotRow({ bot, isFollowing }: { bot: BotUser; isFollowing: boolean }) {
  const { mutate: toggleFollow, isPending } = useToggleFollow();
  // Optimistic local follow state — flips immediately on tap so the
  // user sees feedback even if the network round-trip is slow.
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const showFollowing = optimistic ?? isFollowing;

  // Reset optimistic state if the underlying followingIds changes
  useEffect(() => {
    setOptimistic(null);
  }, [isFollowing]);

  function handleTap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOptimistic(!showFollowing);
    toggleFollow(
      { userId: bot.id, currentlyFollowing: showFollowing, isPublic: true },
      {
        onError: () => setOptimistic(null),
      }
    );
  }

  return (
    <View style={s.row}>
      {bot.avatar_url ? (
        <Image source={{ uri: bot.avatar_url }} style={s.avatar} contentFit="cover" />
      ) : (
        <View style={[s.avatar, s.avatarFallback]}>
          <Ionicons name="sparkles" size={20} color={colors.accent} />
        </View>
      )}
      <View style={s.rowText}>
        <Text style={s.username}>{bot.username}</Text>
        <Text style={s.botTag}>AI bot</Text>
      </View>
      <TouchableOpacity
        style={[s.followBtn, showFollowing && s.followBtnActive]}
        onPress={handleTap}
        disabled={isPending}
        activeOpacity={0.7}
      >
        <Text style={[s.followBtnText, showFollowing && s.followBtnTextActive]}>
          {showFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 30,
  },
  handleBar: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  loading: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 30,
  },
  list: {
    gap: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
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
  rowText: {
    flex: 1,
    gap: 2,
  },
  username: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  botTag: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  doneBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
