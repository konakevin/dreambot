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
  /** ISO timestamp of account creation — drives the 'Joined …' chip. */
  createdAt?: string | null;
  /** Notify when one of the three stat slots is tapped. */
  onStatsPress: (tab: StatsTab) => void;
  /** Tap on the avatar (preview / change). Optional. */
  onAvatarPress?: () => void;
  /**
   * Optional slot rendered between the meta line (joined chip + plain-
   * text stats) and the action pill row. Reserved for future
   * DreamBot-signature inline elements.
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

function formatJoinedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
    createdAt,
    onStatsPress,
    onAvatarPress,
  } = props;

  // Compose the hero text. Display name preferred when present; else fall
  // back to '@username' so the slot is never empty.
  const heroName = display_name?.trim() ? display_name : `@${username}`;
  const showHandleLine = !!display_name?.trim(); // only show @handle when display name occupied the hero line
  const hasBio = !!bio?.trim();
  const joinedDate = createdAt ? formatJoinedDate(createdAt) : '';

  return (
    <View style={styles.root}>
      {/* Row 1 — avatar (left-aligned, on its own). The 3-column stats
          block that used to sit beside the avatar moved to a plain-text
          line below the bio (X-influenced design call 2026-05-29). */}
      <View style={styles.topRow}>
        <AvatarBlock avatar_url={avatar_url} username={username} onPress={onAvatarPress} />
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

      {/* Row 2.25 — joined chip (X-style). Tiny calendar + month-year.
          Only renders when we have an account creation date. */}
      {joinedDate.length > 0 && (
        <View style={styles.joinedChip}>
          <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.joinedText}>Joined {joinedDate}</Text>
        </View>
      )}

      {/* Row 2.5 — plain-text stats line. All three items are tappable
          and notify the parent via onStatsPress. The parent decides
          what each does — own + public profile use 'posts' to switch
          BACK to the posts grid (from the followers/following list
          sub-views), and 'followers'/'following' to switch INTO those
          lists. Each item gets its own Pressable + paddingVertical
          for a comfortable tap target. */}
      <View style={styles.statsRow}>
        <Pressable
          onPress={() => onStatsPress('posts')}
          hitSlop={8}
          style={({ pressed }) => [styles.statsTap, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.statsItem}>
            <Text style={styles.statsCount}>{postCount}</Text>{' '}
            <Text style={styles.statsLabel}>{postCount === 1 ? 'Post' : 'Posts'}</Text>
          </Text>
        </Pressable>
        <Text style={styles.statsDivider}>·</Text>
        <Pressable
          onPress={() => onStatsPress('followers')}
          hitSlop={8}
          style={({ pressed }) => [styles.statsTap, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.statsItem}>
            <Text style={styles.statsCount}>{followerCount}</Text>{' '}
            <Text style={styles.statsLabel}>{followerCount === 1 ? 'Follower' : 'Followers'}</Text>
          </Text>
        </Pressable>
        <Text style={styles.statsDivider}>·</Text>
        <Pressable
          onPress={() => onStatsPress('following')}
          hitSlop={8}
          style={({ pressed }) => [styles.statsTap, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.statsItem}>
            <Text style={styles.statsCount}>{followingCount}</Text>{' '}
            <Text style={styles.statsLabel}>Following</Text>
          </Text>
        </Pressable>
      </View>

      {/* Row 2.75 — optional inline slot for future DreamBot-signature
          elements. Currently unused. */}
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
  // Joined chip — calendar icon + "Joined May 2026" beneath the bio.
  // Sits left-aligned, dim, low visual weight; reads as a quiet
  // metadata line, not a primary element. X-style.
  joinedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  joinedText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  // Plain-text stats row — replaces the 3-column block that used to
  // live beside the avatar. All three items wrap in Pressables so the
  // parent can hook each one (Posts → switch to grid sub-view,
  // Followers/Following → switch to their list views).
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  // Each pressable gets a bit of vertical padding so the tap target is
  // comfortably finger-sized (was previously the text's natural ~15px
  // height — too small to land reliably).
  statsTap: {
    paddingVertical: 4,
  },
  statsItem: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  statsCount: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statsLabel: {
    color: colors.textSecondary,
  },
  statsDivider: {
    color: colors.textSecondary,
    fontSize: 15,
    marginHorizontal: 8,
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
