/**
 * ProfileHeader
 *
 * Shared identity-block at the top of both the own-profile screen
 * (`app/(tabs)/profile.tsx`) and the public-profile screen
 * (`app/user/[userId].tsx`). Compact IG/X-style layout (2026-06-30 squash —
 * was a tall fully-centered stack):
 *
 *   ╭──────╮  Display name
 *   │ 84px │  @username
 *   │  📷  │  <posts> Posts · <followers> Followers · <following> Following
 *   ╰──────╯
 *   Bio (optional)  ·  Joined March 2026
 *   [ Edit Profile ]  [ Share ]  [ ✦ 23k ]   (own)
 *   [ Follow ]  [ Message ]  [ ⋯ ]           (other — human)
 *   [ Follow ]                                (other — bot)
 *
 * Avatar sits LEFT with name/handle/stats stacked to its right (reclaims the
 * vertical height the old centered stack wasted). Bio + "Joined" collapse into
 * one full-width line. "Change photo" is gone — tapping the avatar (own) opens
 * the change-photo flow, signalled by a camera badge. Sparkles ride in the
 * action row (passed as `children` by the own-profile screen).
 *
 * Display name falls back to `@username` when null; bio is omitted when
 * null/empty. Stats taps notify the parent — list overlays + tab switching stay
 * owned by the parent so this component is pure layout.
 */

import type { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { avatarUrl } from '@/lib/imageUrl';
import type { StatsTab } from '@/components/ProfileStatsRow';

const AVATAR_SIZE = 84;

interface BaseProps {
  avatar_url: string | null;
  username: string;
  display_name: string | null;
  bio: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  /** ISO timestamp of account creation — drives the 'Joined …' text. */
  createdAt?: string | null;
  /** Notify when one of the three stat slots is tapped. */
  onStatsPress: (tab: StatsTab) => void;
  /** Which stat is currently the active sub-view (drives the inline label
   *  highlight on the stats line). */
  activeStat?: StatsTab;
  /** Tap on the avatar (preview / change). Optional. */
  onAvatarPress?: () => void;
  /** Show a spinner overlaid on the avatar while a new photo is uploading. */
  avatarUploading?: boolean;
  /** Inline slot rendered at the end of the action row (own profile: the
   *  sparkle-balance chip). */
  children?: ReactNode;
}

interface OwnVariant extends BaseProps {
  variant: 'own';
  onEditPress: () => void;
  onSharePress: () => void;
  /** Change-photo flow — fired by tapping the avatar (own profile). */
  onChangePhoto?: () => void;
}

interface OtherVariant extends BaseProps {
  variant: 'other';
  isFollowing: boolean;
  hasRequest: boolean;
  isPrivate: boolean;
  /** Hide Message + ellipsis controls for bot profiles. */
  isBot?: boolean;
  /** Hide Message + ellipsis on your OWN profile reached via /user/[me]. */
  isSelf?: boolean;
  onFollowPress: () => void;
  onMessagePress: () => void;
  onMorePress: () => void;
}

type Props = OwnVariant | OtherVariant;

function AvatarBlock({
  avatar_url,
  username,
  onPress,
  uploading,
  showCameraBadge,
}: {
  avatar_url: string | null;
  username: string;
  onPress?: () => void;
  uploading?: boolean;
  showCameraBadge?: boolean;
}) {
  const initial = (username || '?')[0]?.toUpperCase() ?? '?';
  const image = avatar_url ? (
    <Image
      source={{ uri: avatarUrl(avatar_url) }}
      style={styles.avatar}
      contentFit="cover"
      cachePolicy="memory-disk"
    />
  ) : (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
  const inner = (
    <View>
      {image}
      {uploading ? (
        <View style={styles.avatarSpinner}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : showCameraBadge ? (
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={13} color="#FFFFFF" />
        </View>
      ) : null}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {inner}
    </Pressable>
  );
}

/** One stat "box": number on top, label left-aligned beneath it. Boxes are
 *  spaced apart (gap on the row) for clean separation — no outline.
 *  TouchableOpacity + plain style, NOT a function-form Pressable style: with
 *  reactCompiler enabled the function style never gets applied (verified via
 *  bg-color probe 2026-07-01) and the box rendered unstyled. */
function Stat({
  count,
  label,
  active,
  onPress,
}: {
  count: number;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} style={styles.statBox} activeOpacity={0.6}>
      <Text style={styles.statNum}>{count}</Text>
      <Text style={[styles.statLbl, active && styles.statLblActive]}>{label}</Text>
    </TouchableOpacity>
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
    avatarUploading,
  } = props;

  const heroName = display_name?.trim() ? display_name : `@${username}`;
  const showHandleLine = !!display_name?.trim();
  const hasBio = !!bio?.trim();
  // Own profile: tapping the avatar opens the change-photo flow (the old
  // standalone "Change photo" link is gone). Other profiles: preview.
  const avatarPress =
    props.variant === 'own' ? (props.onChangePhoto ?? onAvatarPress) : onAvatarPress;

  return (
    <View style={styles.root}>
      {/* Row 1 — avatar LEFT, identity + stats stacked to its RIGHT */}
      <View style={styles.topRow}>
        <AvatarBlock
          avatar_url={avatar_url}
          username={username}
          onPress={avatarPress}
          uploading={avatarUploading}
          showCameraBadge={props.variant === 'own'}
        />
        <View style={styles.identityCol}>
          <Text style={styles.heroName} numberOfLines={1}>
            {heroName}
          </Text>
          {showHandleLine && (
            <Text style={styles.handle} numberOfLines={1}>
              @{username}
            </Text>
          )}
          <View style={styles.statsRow}>
            <Stat
              count={postCount}
              label={postCount === 1 ? 'Post' : 'Posts'}
              active={props.activeStat === 'posts'}
              onPress={() => onStatsPress('posts')}
            />
            <Stat
              count={followerCount}
              label={followerCount === 1 ? 'Follower' : 'Followers'}
              active={props.activeStat === 'followers'}
              onPress={() => onStatsPress('followers')}
            />
            <Stat
              count={followingCount}
              label="Following"
              active={props.activeStat === 'following'}
              onPress={() => onStatsPress('following')}
            />
          </View>
        </View>
      </View>

      {/* Row 2 — bio, full-width under the avatar row */}
      {hasBio && <Text style={styles.bio}>{bio}</Text>}

      {/* Row 3 — action pills (+ sparkle chip via children on own) */}
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
          {props.children}
        </View>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionPill,
              styles.actionPillFollow,
              (props.isFollowing || props.hasRequest) && styles.actionPillFollowing,
            ]}
            onPress={props.onFollowPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.actionText,
                props.isFollowing || props.hasRequest
                  ? styles.actionTextFollowing
                  : styles.actionTextFollow,
              ]}
            >
              {props.hasRequest ? 'Requested' : props.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          {!props.isBot && !props.isSelf && (
            <>
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
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  identityCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.surface,
  },
  avatarSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Camera badge — bottom-right of the avatar, signals "tap to change photo"
  // (own profile). Punched out from the page bg with a dark ring.
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
  },
  handle: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  // Stats — number-over-label boxes, left-aligned, spaced apart (no outline).
  // Label rides at 14 (close to the 15 number) so the pair reads as one unit
  // (Kevin 2026-07-01 — the old 12 label read detached from its number).
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 28,
    marginTop: verticalScale(6),
  },
  statBox: {
    alignItems: 'flex-start',
  },
  statNum: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  statLbl: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    marginTop: verticalScale(1),
  },
  statLblActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  // Bio — full-width line under the avatar row.
  bio: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    lineHeight: fontScale(19),
    marginTop: verticalScale(12),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: verticalScale(14),
  },
  actionPill: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillSecondary: {
    backgroundColor: 'transparent',
  },
  // Follow (not yet following) — TONAL purple: faint fill + purple outline + purple
  // text (the quiet CTA, matches the onboarding bot-card follow buttons).
  actionPillFollow: {
    backgroundColor: 'rgba(167,139,250,0.15)',
    borderColor: 'rgba(167,139,250,0.55)',
  },
  // Following / Requested — quiet monotone matching the dream-card follow pill:
  // whitish outline + white-80% text (legible "done — tap to undo", not too dim).
  actionPillFollowing: {
    backgroundColor: colors.card,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  actionTextFollow: {
    color: colors.accent,
  },
  actionTextFollowing: {
    color: 'rgba(255,255,255,0.8)',
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
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
