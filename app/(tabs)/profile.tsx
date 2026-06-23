import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from '@/store/feed';
import { useAlbumStore } from '@/store/album';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
  Animated,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import * as nav from '@/lib/navigate';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useFollowersList } from '@/hooks/useFollowersList';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useNewNotificationCount } from '@/hooks/useNewNotificationCount';
import { PostGrid } from '@/components/PostGrid';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { useChangeAvatar } from '@/hooks/useChangeAvatar';
import { Toast } from '@/components/Toast';
import { AvatarPreviewModal } from '@/components/AvatarPreviewModal';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useFocusEffect } from '@react-navigation/native';
import { trackProfileViewed } from '@/lib/analytics';
import { type StatsTab } from '@/components/ProfileStatsRow';
import { FollowUserRow } from '@/components/FollowUserRow';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'saved' | 'dreams' | 'reposts' | 'followers' | 'following';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  // Dreams album "Private only" filter (toggle on the right of the subheader).
  const [privateOnly, setPrivateOnly] = useState(false);
  const profileResetToken = useFeedStore((s) => s.profileResetToken);
  const currentPostId = useAlbumStore((s) => s.currentPostId);
  const queryClient = useQueryClient();
  // New-since-last-view count (mig 223) — same source as the tab badge.
  // The inbox screen itself fires useMarkInboxViewed on focus, so by the
  // time the user is back here this count has already reset to 0.
  const { data: unreadCount = 0 } = useNewNotificationCount();

  // Fire on each focus (tab revisit), not just first mount, so we count visits.
  useFocusEffect(
    useCallback(() => {
      trackProfileViewed({ is_self: true });
    }, [])
  );

  // Tapping the inbox bubble just navigates — the inbox screen owns its
  // own mark-viewed firing on focus (mig 223 viewed=read model). No more
  // duplicate "mark seen" call site here; the badge clears via the
  // optimistic update inside useMarkInboxViewed once the inbox mounts.
  const handleInboxPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.push('/inbox');
  }, []);

  // Load the persisted "Private only" Dreams filter (users.dreams_private_only).
  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('dreams_private_only')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setPrivateOnly(data.dreams_private_only ?? false);
      });
  }, [user]);

  // Flip the Dreams All/Private filter — optimistic, then persist.
  const applyPrivateOnly = useCallback(
    (next: boolean) => {
      if (next === privateOnly) return;
      Haptics.selectionAsync();
      setPrivateOnly(next);
      if (user) {
        supabase
          .from('users')
          .update({ dreams_private_only: next })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error && __DEV__) console.warn('persist dreams_private_only failed', error);
          });
      }
    },
    [privateOnly, user]
  );

  // Reset to posts tab only when profile tab icon is re-tapped
  useEffect(() => {
    if (profileResetToken > 0) {
      setActiveTab('posts');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    }
  }, [profileResetToken, queryClient]);

  // Only fetch what's needed for the active tab — avoids 6+ parallel queries on mount
  const isSocialTab = activeTab === 'followers' || activeTab === 'following';
  const { data: profile, refetch: refetchProfile } = usePublicProfile(user?.id ?? '');
  // Change-avatar action sheet (under the avatar) — moved here from Settings.
  const { changePhoto } = useChangeAvatar(profile?.avatar_url);
  const { data: followers = [], isLoading: loadingFollowers } = useFollowersList(
    isSocialTab ? (user?.id ?? '') : ''
  );
  const { data: following = [], isLoading: loadingFollowing } = useFollowingList(
    isSocialTab ? (user?.id ?? '') : ''
  );
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { mutate: toggleFollow } = useToggleFollow();
  // Spinner state owned locally so it only shows during a user-initiated pull.
  // Programmatic refetches (AppState resume invalidation) won't trigger the
  // spinner — fixes the post-background "scrolled down ~60px until tap" bug.
  const [isPulling, setIsPulling] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      await Promise.all([
        refetchProfile(),
        queryClient.invalidateQueries({ queryKey: ['userPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['publicProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['my-dreams'] }),
      ]);
    } finally {
      setIsPulling(false);
    }
  }, [refetchProfile, queryClient]);

  function handleFollowUser(targetId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollow({ userId: targetId, currentlyFollowing: followingIds.has(targetId) });
  }

  function handleStatsTabChange(tab: StatsTab) {
    setActiveTab(tab as Tab);
  }

  // System share-sheet handler for the [Share] button. Universal link
  // (`/user/<id>`) opens directly in the app for users with it installed
  // (AASA-registered) and lands on the public web profile for everyone
  // else — that web page itself has an "Open in DreamBot" CTA.
  const handleShareProfile = useCallback(async () => {
    if (!user) return;
    const handle = user.user_metadata?.username ?? 'someone';
    try {
      const result = await Share.share({
        message: `Check out @${handle} on DreamBot ✨ https://dreambotapp.com/user/${user.id}`,
      });
      // The iOS share sheet's "Copy" is silent — surface our own confirmation
      // so the user knows the link made it to the clipboard.
      if (
        result.action === Share.sharedAction &&
        result.activityType === 'com.apple.UIKit.activity.CopyToPasteboard'
      ) {
        Toast.show('Link copied', 'checkmark-circle');
      }
    } catch {
      /* user cancelled — no-op */
    }
  }, [user]);

  const handleEditProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nav.push('/settings/edit-profile');
  }, []);

  // ── Top-bar tap-to-top ──
  // Tapping the avatar / @handle in the sticky top bar scrolls the
  // current sub-view back to the top. Works in both code paths:
  //   • Posts/Dreams/Saved → bumps PostGrid's scrollToTopToken
  //   • Followers/Following → the userListRef + the effect below
  // We bump a local counter rather than reusing profileResetToken
  // (which ALSO resets the active tab + invalidates queries — too
  // heavy for a simple scroll-to-top intent).
  const [scrollToTopBump, setScrollToTopBump] = useState(0);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const avatarPreview = (
    <AvatarPreviewModal
      visible={showAvatarPreview}
      avatarUrl={profile?.avatar_url ?? null}
      username={user?.user_metadata?.username ?? null}
      onClose={() => setShowAvatarPreview(false)}
    />
  );
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
  // Combined token for PostGrid — fires for either the tab-bar re-tap
  // (profileResetToken) OR a top-bar tap (scrollToTopBump).
  const combinedScrollToTopToken = profileResetToken + scrollToTopBump;

  // ── Collapsing hero on scroll ──
  // scrollY is fed by both code paths (PostGrid via onScrollProgress, the
  // followers/following FlatList via its own onScroll) so the sticky top
  // bar collapses identically on every sub-view.
  const scrollY = useRef(new Animated.Value(0)).current;
  const handleScrollProgress = useCallback(
    (y: number) => {
      // Animated.Value.setValue runs on the JS thread, but the
      // interpolations driving topBar styles run on the native driver
      // where possible — clamped output ranges keep visuals stable when
      // scrollY moves slightly past the threshold.
      scrollY.setValue(y);
    },
    [scrollY]
  );
  // Compact avatar appears beside the @handle once the user has scrolled
  // past the big hero avatar (96px) + a little overshoot. Interpolations
  // share a single shared value so they stay in lockstep.
  const compactAvatarOpacity = scrollY.interpolate({
    inputRange: [60, 130],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const compactAvatarWidth = scrollY.interpolate({
    inputRange: [60, 130],
    outputRange: [0, 36], // 28px avatar + 8px margin
    extrapolate: 'clamp',
  });
  // The @handle text fades in alongside the avatar — at scrollY=0 the
  // big hero already shows the user's identity prominently, so showing
  // @kevin in the top bar too would be redundant. Only reveals once the
  // hero has scrolled away.
  const compactHandleOpacity = scrollY.interpolate({
    inputRange: [80, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const topBarBorderOpacity = scrollY.interpolate({
    inputRange: [20, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Sticky top bar — always pinned at the top of the screen, OUTSIDE the
  // FlatList. Background is solid so the scrolling grid content slides
  // beneath cleanly; the hairline bottom border fades in on scroll to
  // mark the boundary visually.
  const stickyTopBar = (
    <Animated.View style={styles.topBar}>
      {/* TouchableOpacity hosts the tap-to-top gesture. Its hit area
          tracks the visible content — at scrollY=0 the avatar collapses
          to width 0 and the handle is opacity 0 (text still has layout
          width but is invisible), so the tap target is effectively
          empty. Once scrolled past the threshold the area grows and
          the gesture becomes meaningfully discoverable. */}
      <TouchableOpacity
        onPress={handleTopBarTap}
        style={styles.topBarLeft}
        activeOpacity={0.7}
        accessibilityLabel="Scroll to top"
      >
        <Animated.View
          style={[
            styles.compactAvatarWrap,
            { width: compactAvatarWidth, opacity: compactAvatarOpacity },
          ]}
        >
          {profile?.avatar_url && (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.compactAvatar}
              contentFit="cover"
            />
          )}
        </Animated.View>
        <Animated.Text
          style={[styles.topBarHandle, { opacity: compactHandleOpacity }]}
          numberOfLines={1}
        >
          @{user?.user_metadata?.username ?? 'you'}
        </Animated.Text>
      </TouchableOpacity>
      <View style={styles.topBarActions}>
        <TouchableOpacity onPress={handleInboxPress} hitSlop={12}>
          <View style={styles.inboxBubbleWrap}>
            <Ionicons
              name={unreadCount > 0 ? 'chatbubble' : 'chatbubble-outline'}
              size={26}
              color={unreadCount > 0 ? colors.accent : colors.textSecondary}
            />
            {unreadCount > 0 && (
              <View style={styles.inboxBadge} pointerEvents="none">
                <Text style={styles.inboxBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.push('/settings')} hitSlop={12}>
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {/* Bottom-border hairline fades in on scroll so the bar reads as
          a separate surface from the grid scrolling beneath it. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.topBarBottomBorder, { opacity: topBarBorderOpacity }]}
      />
    </Animated.View>
  );

  const { data: sparkleBalance = 0 } = useSparkleBalance();

  const header = (
    <>
      <ProfileHeader
        variant="own"
        avatar_url={profile?.avatar_url ?? null}
        onAvatarPress={() => setShowAvatarPreview(true)}
        username={user?.user_metadata?.username ?? 'you'}
        display_name={profile?.display_name ?? null}
        bio={profile?.bio ?? null}
        postCount={profile?.postCount ?? 0}
        followerCount={profile?.followerCount ?? 0}
        followingCount={profile?.followingCount ?? 0}
        createdAt={profile?.created_at ?? null}
        // Only the social stats (Followers / Following) highlight in the stats
        // row. The album tabs — Posts, Dreams, Saved, Reposts — live on the
        // icon row below and don't light up any stat slot (Posts is an album
        // tab like the others, so it shouldn't be the odd one out).
        activeStat={activeTab === 'followers' || activeTab === 'following' ? activeTab : undefined}
        onStatsPress={handleStatsTabChange}
        onEditPress={handleEditProfile}
        onSharePress={handleShareProfile}
        onChangePhoto={changePhoto}
      >
        {/* Sparkle balance + a doorway to the store (own profile only) */}
        <TouchableOpacity
          onPress={() => nav.push('/sparkleStore')}
          activeOpacity={0.8}
          style={styles.sparkleChip}
        >
          <Ionicons name="sparkles" size={15} color={colors.accent} />
          <Text style={styles.sparkleChipText}>{formatCompact(sparkleBalance)} sparkles</Text>
        </TouchableOpacity>
      </ProfileHeader>

      {/* Album tabs — icon-only (IG-style). Visible only on grid sub-views;
          hidden when the user has tapped Followers/Following on the stats
          row and is looking at the user-list view. */}
      {(activeTab === 'posts' ||
        activeTab === 'saved' ||
        activeTab === 'dreams' ||
        activeTab === 'reposts') && (
        <View style={styles.tabRow}>
          {(
            [
              { key: 'posts', label: 'Posts', icon: 'grid-outline', activeIcon: 'grid' },
              { key: 'dreams', label: 'Dreams', icon: 'moon-outline', activeIcon: 'moon' },
              { key: 'saved', label: 'Saved', icon: 'bookmark-outline', activeIcon: 'bookmark' },
              { key: 'reposts', label: 'Reposts', icon: 'sync-outline', activeIcon: 'sync' },
            ] as const
          ).map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={styles.tab}
                onPress={() => {
                  // Switching album tabs enters a NEW grid context — clear the
                  // "just viewed" highlight so the new tab doesn't bounce-scroll
                  // to a post the user didn't view here.
                  if (t.key !== activeTab) useAlbumStore.getState().setCurrentPostId(null);
                  setActiveTab(t.key);
                }}
                activeOpacity={0.7}
                accessibilityLabel={t.label}
              >
                <Ionicons
                  name={active ? t.activeIcon : t.icon}
                  size={23}
                  color={active ? colors.textPrimary : colors.textSecondary}
                />
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Dreams album: a slim right-aligned All / Private segmented filter.
          The other albums show no subheader — the icons speak for themselves. */}
      {activeTab === 'dreams' && (
        <View style={styles.dreamsFilterRow}>
          <View style={styles.segmented}>
            <TouchableOpacity
              style={[styles.segment, !privateOnly && styles.segmentActive]}
              onPress={() => applyPrivateOnly(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, !privateOnly && styles.segmentTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, privateOnly && styles.segmentActive]}
              onPress={() => applyPrivateOnly(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, privateOnly && styles.segmentTextActive]}>
                Private
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Section heading for the followers/following sub-views — repeats
          the active tab + count so you can tell which list you're looking
          at when the two sets are nearly identical. */}
      {activeTab === 'followers' && (
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>Followers</Text>
          <Text style={styles.listSectionCount}>{profile?.followerCount ?? 0}</Text>
        </View>
      )}
      {activeTab === 'following' && (
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>Following</Text>
          <Text style={styles.listSectionCount}>{profile?.followingCount ?? 0}</Text>
        </View>
      )}
    </>
  );

  if (
    activeTab === 'posts' ||
    activeTab === 'saved' ||
    activeTab === 'dreams' ||
    activeTab === 'reposts'
  ) {
    const sourceMap = {
      posts: { type: 'own' as const },
      saved: { type: 'saved' as const },
      dreams: { type: 'dreams' as const, privateOnly },
      reposts: { type: 'reposts' as const, userId: user?.id ?? '' },
    };
    const emptyMap = {
      posts: 'No posts yet.\nDreams you post as public will show up here',
      saved: 'Bookmark dreams you love. They live here.',
      dreams: 'No dreams yet',
      reposts: 'Dreams you repost will show up here.',
    };
    return (
      <SafeAreaView style={styles.root}>
        {avatarPreview}
        {stickyTopBar}
        <PostGrid
          source={sourceMap[activeTab]}
          isOwn={activeTab === 'posts' || activeTab === 'dreams'}
          emptyText={emptyMap[activeTab]}
          ListHeaderComponent={header}
          scrollToTopToken={combinedScrollToTopToken}
          showPrivateBadge={activeTab === 'dreams'}
          highlightPostId={currentPostId ?? undefined}
          onScrollProgress={handleScrollProgress}
        />
      </SafeAreaView>
    );
  }

  const listData = activeTab === 'followers' ? followers : following;
  const isLoadingList = activeTab === 'followers' ? loadingFollowers : loadingFollowing;
  const emptyLabel = activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet';

  return (
    <SafeAreaView style={styles.root}>
      {avatarPreview}
      {stickyTopBar}
      <FlatList<FollowUser>
        key="users"
        ref={userListRef}
        data={listData}
        refreshControl={
          <RefreshControl
            refreshing={isPulling}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        // Mirror the PostGrid path's scroll-progress wiring so the same
        // sticky top bar collapses identically on this sub-view.
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
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  // Sparkle balance chip in the own-profile header — shows the balance and
  // taps through to the Sparkle Store (a passive IAP discovery point).
  sparkleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: verticalScale(12),
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.55)',
  },
  sparkleChipText: {
    color: colors.accent,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  // Section header above the followers / following user list. Same shape
  // as the public-profile screen's version so the two surfaces stay
  // visually consistent.
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
  // Dreams tab: slim row holding the right-aligned All / Private segmented
  // filter. The other albums carry no subheader now.
  dreamsFilterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(8),
  },
  // Segmented All | Private control — a pill-shaped track with two segments;
  // the active one fills with the accent.
  // Mirrors the Create-screen Mode tabs (DreamBot / Direct): a `surface`
  // track with rounded-lg segments; the active one fills with tonal moon-
  // purple + a purple border + purple text (not a solid accent pill).
  segmented: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(6),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderColor: 'rgba(167,139,250,0.55)',
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  segmentTextActive: { color: '#A78BFA' },
  listSectionCount: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(6),
    backgroundColor: colors.background, // opaque so the grid scrolls beneath cleanly
    zIndex: 10,
  },
  topBarLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarHandle: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    // Bumped 14 → 22 so the inbox badge's right-edge (sticking ~6px
    // past the icon) has clear breathing room from the gear next door.
    gap: 22,
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
    // width is animated 0 → 36 (28px avatar + 8px right-margin) so the
    // hero name slides right rather than the avatar popping in beside
    // already-placed text.
    height: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  // Wrap is just a positioning anchor for the corner badge — the bubble
  // icon centers naturally inside it. No more in-bubble text overlay
  // (that approach gave the off-centered look Kevin flagged because the
  // chatbubble glyph isn't symmetric — the tail throws "center" off).
  inboxBubbleWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Standard activity-counter pip at the top-right of the bubble.
  // Sized so a single digit is comfortably legible — fontSize 9 read
  // as a smear on retina at this screen scale; 11 reads cleanly.
  inboxBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.like,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  inboxBadgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(11),
    fontWeight: '800',
    lineHeight: fontScale(13),
    includeFontPadding: false,
  },
  // Album tabs — X-style text + accent-colored underline beneath the
  // active tab. The underline is a separate absolutely-positioned View
  // (not borderBottom) so we can match the text's natural width with
  // tiny padding rather than the full tab cell.
  tabRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginTop: verticalScale(4),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    position: 'relative',
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.textPrimary,
  },
  tabUnderline: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: verticalScale(60) },
  emptyText: { color: colors.textSecondary, fontSize: fontScale(15) },
});
