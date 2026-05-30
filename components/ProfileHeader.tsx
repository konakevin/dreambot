/**
 * ProfileHeader
 *
 * Shared identity-block at the top of both the own-profile screen
 * (`app/(tabs)/profile.tsx`) and the public-profile screen
 * (`app/user/[userId].tsx`). Replaces the older inline 32px-avatar +
 * stats-only layout with the IG-style hybrid Kevin signed off on:
 *
 *   ╭──────╮     <postCount>   <followers>   <following>
 *   │      │     POSTS         FOLLOWERS     FOLLOWING
 *   │ 96px │
 *   ╰──────╯
 *   Display name
 *   @username
 *   Bio (optional, 1–2 lines)
 *   [ Edit Profile ]   [ Share ]   (own)
 *   [ Follow ]  [ Message ]  [ ⋯ ]  (other)
 *
 * Borrows IG's left-aligned avatar + inline stats and IG's equal-width
 * pill action row; TikTok-bumps the avatar to 96px so the identity
 * moment reads larger than IG's default 80px.
 *
 * Display name falls back to `@username` when null; bio is omitted when
 * null/empty. Stats taps notify the parent — list overlays + tab
 * switching stay owned by the parent so this component is pure layout.
 */

import type { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import type { StatsTab } from '@/components/ProfileStatsRow';

const AVATAR_SIZE = 96;

interface BaseProps {
  avatar_url: string | null;
  username: string;
  display_name: string | null;
  bio: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  /** Notify when one of the three stat columns is tapped. */
  onStatsPress: (tab: StatsTab) => void;
  /** Tap on the avatar (preview / change). Optional. */
  onAvatarPress?: () => void;
  /**
   * Slot rendered between the identity text and the action pill row. Use
   * for DreamBot-signature inline elements like VibeProfilePeek and
   * CastPeek. Optional — when null/undefined, the action pills sit
   * directly under the bio.
   */
  children?: ReactNode;
}

interface OwnVariant extends BaseProps {
  variant: 'own';
  onEditPress: () => void;
  onSharePress: () => void;
}

interface OtherVariant extends BaseProps {
  variant: 'other';
  isFollowing: boolean;
  hasRequest: boolean;
  isPrivate: boolean;
  onFollowPress: () => void;
  onMessagePress: () => void;
  onMorePress: () => void;
}

type Props = OwnVariant | OtherVariant;

function StatColumn({
  count,
  label,
  onPress,
}: {
  count: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.statColumn, pressed && { opacity: 0.6 }]}
      hitSlop={8}
    >
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

function AvatarBlock({
  avatar_url,
  username,
  onPress,
}: {
  avatar_url: string | null;
  username: string;
  onPress?: () => void;
}) {
  const initial = (username || '?')[0]?.toUpperCase() ?? '?';
  const inner = avatar_url ? (
    <Image source={{ uri: avatar_url }} style={styles.avatar} contentFit="cover" />
  ) : (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {inner}
    </Pressable>
  );
}

export function ProfileHeader(props: Props) {
  const {
    avatar_url,
    username,
    display_name,
    bio,
    postCount,
    followerCount,
    followingCount,
    onStatsPress,
    onAvatarPress,
  } = props;

  // Compose the hero text. Display name preferred when present; else fall
  // back to '@username' so the slot is never empty.
  const heroName = display_name?.trim() ? display_name : `@${username}`;
  const showHandleLine = !!display_name?.trim(); // only show @handle when display name occupied the hero line
  const hasBio = !!bio?.trim();

  return (
    <View style={styles.root}>
      {/* Row 1 — avatar (left) + stats (right, three columns) */}
      <View style={styles.topRow}>
        <AvatarBlock avatar_url={avatar_url} username={username} onPress={onAvatarPress} />
        <View style={styles.statsBlock}>
          <StatColumn count={postCount} label="POSTS" onPress={() => onStatsPress('posts')} />
          <StatColumn
            count={followerCount}
            label="FOLLOWERS"
            onPress={() => onStatsPress('followers')}
          />
          <StatColumn
            count={followingCount}
            label="FOLLOWING"
            onPress={() => onStatsPress('following')}
          />
        </View>
      </View>

      {/* Row 2 — display name / handle / bio (left-aligned, beneath avatar) */}
      <View style={styles.identityBlock}>
        <Text style={styles.heroName} numberOfLines={1}>
          {heroName}
        </Text>
        {showHandleLine && (
          <Text style={styles.handle} numberOfLines={1}>
            @{username}
          </Text>
        )}
        {hasBio && <Text style={styles.bio}>{bio}</Text>}
      </View>

      {/* Row 2.5 — optional DreamBot-signature peek slots (vibe + cast).
          Renders as children passed by the parent so this component
          doesn't take a dependency on the recipe shape. */}
      {props.children}

      {/* Row 3 — action pills */}
      {props.variant === 'own' ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={props.onEditPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={props.onSharePress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionPill, props.isFollowing && styles.actionPillSecondary]}
            onPress={props.onFollowPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, props.isFollowing && styles.actionTextSecondary]}>
              {props.hasRequest ? 'Requested' : props.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionPill, styles.actionPillSecondary]}
            onPress={props.onMessagePress}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, styles.actionTextSecondary]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconPill}
            onPress={props.onMorePress}
            activeOpacity={0.7}
            hitSlop={6}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.surface,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.textPrimary,
    fontSize: AVATAR_SIZE * 0.4,
    fontWeight: '700',
  },
  statsBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statColumn: {
    alignItems: 'center',
    minWidth: 64,
  },
  statNumber: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  identityBlock: {
    marginTop: 10,
    gap: 2,
  },
  heroName: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  handle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  bio: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  actionPill: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillSecondary: {
    backgroundColor: 'transparent',
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionTextSecondary: {
    color: colors.textPrimary,
  },
  iconPill: {
    width: 38,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
