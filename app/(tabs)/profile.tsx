import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from '@/store/feed';
import { useAlbumStore } from '@/store/album';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/auth';
import * as nav from '@/lib/navigate';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useFollowersList } from '@/hooks/useFollowersList';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useUnreadGroupCount } from '@/hooks/useUnreadGroupCount';
import { useMarkAllSeen } from '@/hooks/useMarkAllSeen';
import { PostGrid } from '@/components/PostGrid';
import { ProfileHeader } from '@/components/ProfileHeader';
import { colors } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { trackProfileViewed } from '@/lib/analytics';
import { type StatsTab } from '@/components/ProfileStatsRow';
import { FollowUserRow } from '@/components/FollowUserRow';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'saved' | 'dreams' | 'followers' | 'following';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const profileResetToken = useFeedStore((s) => s.profileResetToken);
  const currentPostId = useAlbumStore((s) => s.currentPostId);
  const queryClient = useQueryClient();
  // Distinct-group unread count (Phase 1, D6) — same source as the tab badge.
  const { data: unreadCount = 0 } = useUnreadGroupCount();
  const markAllSeen = useMarkAllSeen();

  // Fire on each focus (tab revisit), not just first mount, so we count visits.
  useFocusEffect(
    useCallback(() => {
      trackProfileViewed({ is_self: true });
    }, [])
  );

  // Tapping the inbox bubble pushes to /inbox AND optimistically marks
  // every notification as seen — the badge clears instantly. The
  // useMarkAllSeen mutation also clears the in-cache inbox query data
  // so re-entering inbox shows everything as already-seen.
  const handleInboxPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (unreadCount > 0) markAllSeen.mutate();
    nav.push('/inbox');
  }, [unreadCount, markAllSeen]);

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
      await Share.share({
        message: `Check out @${handle} on DreamBot ✨ https://dreambotapp.com/user/${user.id}`,
      });
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
              <View style={styles.inboxBubbleCountWrap} pointerEvents="none">
                <Text style={styles.inboxBubbleCount}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
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

  const header = (
    <>
      <ProfileHeader
        variant="own"
        avatar_url={profile?.avatar_url ?? null}
        username={user?.user_metadata?.username ?? 'you'}
        display_name={profile?.display_name ?? null}
        bio={profile?.bio ?? null}
        postCount={profile?.postCount ?? 0}
        followerCount={profile?.followerCount ?? 0}
        followingCount={profile?.followingCount ?? 0}
        createdAt={profile?.created_at ?? null}
        onStatsPress={handleStatsTabChange}
        onEditPress={handleEditProfile}
        onSharePress={handleShareProfile}
      />

      {/* Album tabs — icon-only (IG-style). Visible only on grid sub-views;
          hidden when the user has tapped Followers/Following on the stats
          row and is looking at the user-list view. */}
      {(activeTab === 'posts' || activeTab === 'saved' || activeTab === 'dreams') && (
        <View style={styles.tabRow}>
          {(
            [
              { key: 'posts', label: 'Posts' },
              { key: 'dreams', label: 'Dreams' },
              { key: 'saved', label: 'Saved' },
            ] as const
          ).map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={styles.tab}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.7}
                accessibilityLabel={t.label}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );

  if (activeTab === 'posts' || activeTab === 'saved' || activeTab === 'dreams') {
    const sourceMap = {
      posts: { type: 'own' as const },
      saved: { type: 'saved' as const },
      dreams: { type: 'dreams' as const },
    };
    const emptyMap = {
      posts:
        'Nothing posted yet. Anything you create or that your DreamBot dreams up can land here.',
      saved: 'Bookmark dreams you love. They live here.',
      dreams: 'No dreams yet. Create your first dream!',
    };
    return (
      <SafeAreaView style={styles.root}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
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
    fontSize: 18,
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  // Outer wrap matches the icon size so the count overlay can use
  // flexbox-center over the bubble. The Ionicons chatbubble icon has a
  // tail extending down + slightly out of the lower-left, so we shift
  // the count up + right of geometric center to land on the bubble's
  // visual body. Fits "1" through "9+" comfortably.
  inboxBubbleWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxBubbleCountWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // Push the count up + slightly right to compensate for the tail
    paddingBottom: 5,
    paddingLeft: 1,
  },
  inboxBubbleCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
    textAlign: 'center',
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
    marginTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 14,
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
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
  wishRow: { paddingHorizontal: 16, paddingBottom: 8 },
});
