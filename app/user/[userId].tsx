import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState, useEffect, useCallback, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useFollowersList } from '@/hooks/useFollowersList';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { useBotUsers } from '@/hooks/useBotUsers';
import { useAuthStore } from '@/store/auth';
import { useAlbumStore } from '@/store/album';
import { PostGrid } from '@/components/PostGrid';
import { ProfileHeader } from '@/components/ProfileHeader';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { FollowUserRow } from '@/components/FollowUserRow';
import { useReport } from '@/hooks/useReport';
import { useBlockedIds, useToggleBlock } from '@/hooks/useBlockUser';
import { showAlert } from '@/components/CustomAlert';
import { trackProfileViewed } from '@/lib/analytics';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'followers' | 'following';

export default function PublicProfileScreen() {
  const { userId, viewedPost } = useLocalSearchParams<{ userId: string; viewedPost?: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === userId;
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  // Posts vs Reposts sub-view within the posts grid (icon toggle in the header).
  const [gridView, setGridView] = useState<'posts' | 'reposts'>('posts');

  // URL-param entry (avatar tap from main feed): viewedPost lights up the
  // "Just viewed" badge but should NOT trigger auto-scroll. Clear any
  // stale album-store currentPostId from a prior session so PostGrid's
  // live auto-anchor effect doesn't fire on it.
  useEffect(() => {
    if (viewedPost) {
      useAlbumStore.getState().setCurrentPostId(null);
    }
  }, [viewedPost]);

  // Profile view — fires per screen open (this route is pushed fresh each time).
  useEffect(() => {
    trackProfileViewed({ is_self: isOwnProfile });
  }, [isOwnProfile]);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = usePublicProfile(userId);
  // Local pull-to-refresh spinner — see FullScreenFeed for rationale.
  const [isPulling, setIsPulling] = useState(false);
  const handlePullToRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      await refetchProfile();
    } finally {
      setIsPulling(false);
    }
  }, [refetchProfile]);
  const { data: followers = [], isLoading: loadingFollowers } = useFollowersList(userId);
  const { data: following = [], isLoading: loadingFollowing } = useFollowingList(userId);
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { data: requestIds = new Set<string>() } = useOutgoingFollowRequestIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const { mutate: report } = useReport();
  const { data: blockedIds = new Set<string>() } = useBlockedIds();
  const { mutate: toggleBlock } = useToggleBlock();
  const isBlocked = blockedIds.has(userId);
  // Bot profiles hide the Message + ellipsis controls — users can't DM
  // bots and don't need to block/report them (unfollow is enough).
  const { data: bots = [] } = useBotUsers();
  const isBot = bots.some((b) => b.id === userId);

  // Avatar preview animation hooks — ALL must be before any early returns
  const SCREEN_W = Dimensions.get('window').width;
  const SCREEN_H = Dimensions.get('window').height;
  const AVATAR_SIZE = SCREEN_W * 0.6;
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const avatarProgress = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const animatedAvatarStyle = useAnimatedStyle(() => {
    const size = 32 + (AVATAR_SIZE - 32) * avatarProgress.value;
    const startX = 24;
    const startY = 80;
    const endX = (SCREEN_W - AVATAR_SIZE) / 2;
    const endY = SCREEN_H * 0.3;
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      position: 'absolute' as const,
      left: startX + (endX - startX) * avatarProgress.value,
      top: startY + (endY - startY) * avatarProgress.value,
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: avatarProgress.value,
    transform: [{ translateY: 10 * (1 - avatarProgress.value) }],
  }));

  // ── Collapsing-hero hooks — must live ABOVE the early-return guard
  // for `profileLoading || !profile` so hook order stays stable across
  // renders (rules-of-hooks). They read no profile-dependent data, just
  // a scroll y-position driven by both code paths (PostGrid via
  // onScrollProgress and the followers/following FlatList's onScroll).
  const scrollY = useSharedValue(0);
  const compactAvatarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [60, 130], [0, 1], Extrapolation.CLAMP),
    width: interpolate(scrollY.value, [60, 130], [0, 36], Extrapolation.CLAMP),
  }));
  const compactNameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [80, 150], [0, 1], Extrapolation.CLAMP),
  }));
  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [20, 80], [0, 1], Extrapolation.CLAMP),
  }));
  const handleScrollProgress = (y: number) => {
    scrollY.value = y;
  };

  // ── Top-bar tap-to-top ──
  // Tap the collapsed avatar / name in the top bar to scroll the
  // current sub-view back to the top. Bumps a token consumed by both
  // PostGrid (scrollToTopToken) and the followers/following FlatList
  // ref below — whichever sub-view is mounted gets the scroll.
  const [scrollToTopBump, setScrollToTopBump] = useState(0);
  const userListRef = useRef<FlatList<FollowUser>>(null);
  const handleTopBarTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScrollToTopBump((b) => b + 1);
  }, []);
  useEffect(() => {
    if (scrollToTopBump > 0) {
      userListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopBump]);

  useEffect(() => {
    if (showAvatarPreview) {
      overlayOpacity.value = withTiming(1, { duration: 250 });
      avatarProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    }
  }, [showAvatarPreview, avatarProgress, overlayOpacity]);

  function handleMoreMenu() {
    showAlert('Options', '', [
      {
        text: isBlocked ? 'Unblock User' : 'Block User',
        style: isBlocked ? 'default' : 'destructive',
        onPress: () => {
          if (isBlocked) {
            toggleBlock({ userId, currentlyBlocked: true });
          } else {
            showAlert('Block User?', "They won't be able to see your posts or contact you.", [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Block',
                style: 'destructive',
                onPress: () => {
                  toggleBlock({ userId, currentlyBlocked: false });
                  router.replace('/(tabs)');
                },
              },
            ]);
          }
        },
      },
      {
        text: 'Report User',
        style: 'destructive',
        onPress: () => {
          showAlert('Report User', 'Why are you reporting this user?', [
            {
              text: 'Spam',
              style: 'destructive',
              onPress: () => {
                report({ reason: 'spam', reportedUserId: userId });
                showAlert('Reported', 'Thanks for letting us know.', [
                  { text: 'OK', onPress: () => router.replace('/(tabs)') },
                ]);
              },
            },
            {
              text: 'Harassment',
              style: 'destructive',
              onPress: () => {
                report({ reason: 'harassment', reportedUserId: userId });
                showAlert('Reported', 'Thanks for letting us know.', [
                  { text: 'OK', onPress: () => router.replace('/(tabs)') },
                ]);
              },
            },
            {
              text: 'Inappropriate',
              style: 'destructive',
              onPress: () => {
                report({ reason: 'inappropriate', reportedUserId: userId });
                showAlert('Reported', 'Thanks for letting us know.', [
                  { text: 'OK', onPress: () => router.replace('/(tabs)') },
                ]);
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  const isFollowing = profile?.isFollowing ?? followingIds.has(userId);
  const hasRequest = profile?.hasRequest ?? requestIds.has(userId);
  const isTargetPublic = profile?.is_public ?? true;

  function handleFollow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollow({
      userId,
      currentlyFollowing: isFollowing,
      isPublic: isTargetPublic,
      hasRequest,
    });
  }

  function handleFollowUser(targetId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollow({ userId: targetId, currentlyFollowing: followingIds.has(targetId) });
  }

  // followLabel was used by the old inline follow button; ProfileHeader's
  // 'other' variant now derives the label internally from isFollowing +
  // hasRequest.

  if (profileLoading || !profile) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.root}>
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.center}>
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Public profile uses the same shared ProfileHeader as the own-profile
  // screen, in 'other' variant. The compact top bar is now lifted out as
  // a sticky element (rendered OUTSIDE the FlatList) and collapses on
  // scroll: a small avatar + display name / @handle fades in to the right
  // of the back chevron once the user has scrolled past the hero. Same
  // pattern as (tabs)/profile.tsx; Reanimated here because this file
  // already imports it for the avatar-preview modal. The animated styles
  // + scrollY shared value are declared up above with the other Reanimated
  // hooks so they sit ABOVE the early-return guard.
  const backButton = null;
  const heroNameForBar = profile.display_name?.trim() || `@${profile.username}`;

  const stickyTopBar = (
    <Animated.View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconButton} hitSlop={12}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      {/* Tap-to-top target — covers the collapsed avatar + name slot.
          At scrollY=0 the avatar collapses to width 0 and the name is
          opacity 0; once the user scrolls past the threshold the area
          grows and the gesture becomes meaningfully discoverable. */}
      <TouchableOpacity
        onPress={handleTopBarTap}
        style={styles.topBarIdentitySlot}
        activeOpacity={0.7}
        accessibilityLabel="Scroll to top"
      >
        <Animated.View style={[styles.compactAvatarWrap, compactAvatarStyle]}>
          {profile.avatar_url && (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.compactAvatar}
              contentFit="cover"
            />
          )}
        </Animated.View>
        <Animated.Text style={[styles.compactName, compactNameStyle]} numberOfLines={1}>
          {heroNameForBar}
        </Animated.Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <Animated.View pointerEvents="none" style={[styles.topBarBottomBorder, topBarBorderStyle]} />
    </Animated.View>
  );

  // Visibility gate for this account's posts/reposts (referenced inside header).
  const canSeePosts = profile.is_public || isFollowing || isOwnProfile;

  const header = (
    <>
      <ProfileHeader
        variant="other"
        avatar_url={profile.avatar_url ?? null}
        username={profile.username}
        display_name={profile.display_name ?? null}
        bio={profile.bio ?? null}
        postCount={profile.postCount}
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
        createdAt={profile.created_at ?? null}
        isFollowing={isFollowing}
        hasRequest={hasRequest}
        isPrivate={!isTargetPublic}
        isBot={isBot}
        activeStat={activeTab}
        onStatsPress={(tab) => setActiveTab(tab as Tab)}
        onAvatarPress={() => setShowAvatarPreview(true)}
        onFollowPress={handleFollow}
        onMessagePress={() => {
          /* TODO: DM flow once it ships — silent no-op for now */
        }}
        onMorePress={handleMoreMenu}
      />
      {/* Posts / Reposts icon toggle — only on the posts view, only when
          the viewer is allowed to see this account's posts, and never for
          bots (bots don't repost, so there's only the Posts album). */}
      {activeTab === 'posts' && canSeePosts && !isBot && (
        <View style={styles.gridToggleRow}>
          {(
            [
              { key: 'posts', label: 'Posts', icon: 'grid-outline', activeIcon: 'grid' },
              { key: 'reposts', label: 'Reposts', icon: 'repeat-outline', activeIcon: 'repeat' },
            ] as const
          ).map((t) => {
            const active = gridView === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={styles.gridToggleTab}
                onPress={() => setGridView(t.key)}
                activeOpacity={0.7}
                accessibilityLabel={t.label}
              >
                <Ionicons
                  name={active ? t.activeIcon : t.icon}
                  size={23}
                  color={active ? colors.textPrimary : colors.textSecondary}
                />
                {active && <View style={styles.gridToggleUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {/* One-line explainer under the Posts/Reposts toggle — own profile only.
          On other users' profiles the help text is suppressed. */}
      {activeTab === 'posts' && canSeePosts && isOwnProfile && (
        <Text style={styles.albumSubheader}>
          {gridView === 'reposts'
            ? 'Dreams this user has reposted'
            : 'Public dreams shared to the feed'}
        </Text>
      )}
      {/* Section heading for the followers/following sub-views. Repeats the
          tab label + count above the list so the user can tell which list
          they're looking at — important when followers ≈ following (e.g.
          the bot-on-bot graph) and the two lists are otherwise
          indistinguishable. */}
      {activeTab === 'followers' && (
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>Followers</Text>
          <Text style={styles.listSectionCount}>{profile.followerCount}</Text>
        </View>
      )}
      {activeTab === 'following' && (
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>Following</Text>
          <Text style={styles.listSectionCount}>{profile.followingCount}</Text>
        </View>
      )}
    </>
  );

  const initial = (profile.username || '?')[0].toUpperCase();

  function closeAvatarPreview() {
    overlayOpacity.value = withTiming(0, { duration: 200 });
    avatarProgress.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
    setTimeout(() => setShowAvatarPreview(false), 300);
  }

  const avatarModal = showAvatarPreview ? (
    <Modal visible transparent animationType="none">
      <TouchableOpacity style={styles.avatarOverlay} onPress={closeAvatarPreview} activeOpacity={1}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.9)' },
            animatedOverlayStyle,
          ]}
        />
        <Animated.View style={animatedAvatarStyle}>
          {profile.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={{ width: '100%', height: '100%', borderRadius: 9999 }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 9999,
                backgroundColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: AVATAR_SIZE * 0.4, fontWeight: '700' }}>
                {initial}
              </Text>
            </View>
          )}
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: Dimensions.get('window').height * 0.3 + AVATAR_SIZE + 16,
              alignSelf: 'center',
            },
            animatedTextStyle,
          ]}
        >
          <Text style={styles.avatarUsername}>{profile.username}</Text>
        </Animated.View>
        <TouchableOpacity style={styles.avatarClose} onPress={closeAvatarPreview}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  ) : null;

  if (activeTab === 'posts') {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.root}>
          {backButton}
          {avatarModal}
          {stickyTopBar}
          {canSeePosts ? (
            <PostGrid
              source={
                gridView === 'reposts' && !isBot
                  ? { type: 'reposts', userId }
                  : { type: 'user', userId }
              }
              emptyText={gridView === 'reposts' && !isBot ? 'No reposts yet' : 'No posts yet'}
              ListHeaderComponent={header}
              highlightPostId={viewedPost}
              onScrollProgress={handleScrollProgress}
              scrollToTopToken={scrollToTopBump}
            />
          ) : (
            <ScrollView
              onScroll={(e) => handleScrollProgress(e.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
            >
              {header}
              <View style={styles.lockedState}>
                <Ionicons name="lock-closed" size={48} color={colors.textSecondary} />
                <Text style={styles.lockedTitle}>This account is private</Text>
                <Text style={styles.lockedSub}>Follow them to see their dreams</Text>
                <TouchableOpacity
                  style={[styles.followButton, hasRequest && styles.followingButton]}
                  onPress={handleFollow}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.followButtonText, hasRequest && styles.followingButtonText]}>
                    {hasRequest ? 'Requested' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    );
  }

  const listData = activeTab === 'followers' ? followers : following;
  const isLoadingList = activeTab === 'followers' ? loadingFollowers : loadingFollowing;
  const emptyLabel = activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet';

  // Swipe-right-to-back handled by React Navigation's native gesture
  // (fullScreenGestureEnabled: true in SCREEN_PRESETS.MODAL_SWIPEABLE).
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.root}>
        {backButton}
        {avatarModal}
        {stickyTopBar}
        <FlatList<FollowUser>
          key="users"
          ref={userListRef}
          data={listData}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isPulling}
              onRefresh={handlePullToRefresh}
              tintColor={colors.accent}
            />
          }
          ListHeaderComponent={header}
          onScroll={(e) => handleScrollProgress(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.center}>
              {isLoadingList ? (
                <ActivityIndicator color={colors.textSecondary} />
              ) : (
                <Text style={styles.emptyText}>{emptyLabel}</Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <FollowUserRow
              item={item}
              isFollowing={followingIds.has(item.id)}
              onFollow={handleFollowUser}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: verticalScale(60) },
  // Posts / Reposts icon toggle above the grid (mirrors the own-profile tab row).
  gridToggleRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginTop: verticalScale(4),
  },
  gridToggleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    position: 'relative',
  },
  gridToggleUnderline: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  albumSubheader: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(8),
  },
  // Section header above the followers / following user list. Mirrors the
  // hairline-separated row Instagram uses above its user list — gives the
  // user a clear "this is the X list" cue when the followers and following
  // sets are nearly identical (the bot graph hits this case).
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: verticalScale(12),
  },
  listSectionTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  listSectionCount: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  // backRow / backButton kept for the loading-state JSX above (line ~197).
  backRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(12),
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  // Sticky compact top bar — always visible at the top of the screen,
  // collapses on scroll to reveal a small avatar + display name beside
  // the back chevron. Opaque background so the FlatList content slides
  // beneath cleanly; hairline bottom border fades in on scroll to mark
  // the boundary.
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(6),
    backgroundColor: colors.background,
    zIndex: 10,
  },
  // Wraps the collapsed avatar + name as a single tap-to-top target.
  // No flex:1 — the slot's width grows with the animated avatar/name so
  // the tap area mirrors the visible content (tiny at scrollY=0, fills
  // out as the user scrolls past the threshold).
  topBarIdentitySlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarBottomBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  compactAvatarWrap: {
    height: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  compactAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  compactName: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
    flexShrink: 1,
  },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  // followButton/followingButton/etc. kept for the private-account locked
  // state below (line ~378), where the page can't render the full
  // ProfileHeader.
  followButton: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(5),
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  followButtonText: {
    color: '#000000',
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  followingButtonText: { color: 'rgba(255,255,255,0.7)' },
  emptyText: { color: colors.textSecondary, fontSize: fontScale(15) },
  avatarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  avatarUsername: {
    color: '#FFFFFF',
    fontSize: fontScale(20),
    fontWeight: '700',
    marginTop: verticalScale(8),
  },
  avatarClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(60),
    paddingHorizontal: 40,
    gap: 12,
  },
  lockedTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
  },
  lockedSub: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
});
