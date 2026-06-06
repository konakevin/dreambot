/**
 * BotCard — avatar + tagline + Follow toggle + 3 latest-post thumbnails.
 * Used by both the onboarding BotSelectorStep and the settings/bots
 * management screen. Tap a thumbnail to open the fullscreen viewer.
 */

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { getBotProfile } from '@/lib/botProfiles';
import type { BotUser } from '@/hooks/useBotUsers';

export function BotCard({
  bot,
  isFollowing,
  thumbnailUrls,
  onOpenViewer,
  onPressBot,
}: {
  bot: BotUser;
  isFollowing: boolean;
  thumbnailUrls: string[];
  onOpenViewer: (urls: string[], initialIndex: number) => void;
  /** When provided, the avatar + name area becomes tappable (e.g. navigate
   *  to the bot's profile). Omit to keep it non-interactive (onboarding). */
  onPressBot?: () => void;
}) {
  const profile = getBotProfile(bot.username);
  const { mutate: toggleFollow, isPending } = useToggleFollow();
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

  function handlePressBot() {
    if (!onPressBot) return;
    Haptics.selectionAsync();
    onPressBot();
  }

  const botInfo = (
    <>
      {bot.avatar_url ? (
        <Image source={{ uri: bot.avatar_url }} style={s.avatar} contentFit="cover" />
      ) : (
        <View style={[s.avatar, s.avatarFallback]}>
          <Ionicons name="sparkles" size={20} color={colors.accent} />
        </View>
      )}
      <View style={s.cardText}>
        <Text style={s.username}>{bot.username}</Text>
        {profile?.description ? <Text style={s.tagline}>{profile.description}</Text> : null}
      </View>
    </>
  );

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        {onPressBot ? (
          <TouchableOpacity style={s.botInfoTap} onPress={handlePressBot} activeOpacity={0.7}>
            {botInfo}
          </TouchableOpacity>
        ) : (
          <View style={s.botInfoTap}>{botInfo}</View>
        )}
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
  botInfoTap: {
    flex: 1,
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
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: verticalScale(8),
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
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: colors.textSecondary,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: verticalScale(12),
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
});
