import { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
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
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { useMarkAllSeen } from '@/hooks/useMarkAllSeen';
import { PostGrid } from '@/components/PostGrid';
import { GradientUsername } from '@/components/GradientUsername';
import { colors } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { trackProfileViewed } from '@/lib/analytics';
import { ProfileStatsRow, type StatsTab } from '@/components/ProfileStatsRow';
import { FollowUserRow } from '@/components/FollowUserRow';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'saved' | 'dreams' | 'followers' | 'following';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const profileResetToken = useFeedStore((s) => s.profileResetToken);
  const currentPostId = useAlbumStore((s) => s.currentPostId);
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useUnreadCount();
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

  const statsActiveTab: StatsTab =
    activeTab === 'saved' || activeTab === 'dreams' ? 'posts' : (activeTab as StatsTab);

  const header = (
    <>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <GradientUsername
              username={user?.user_metadata?.username ?? 'you'}
              rank={null}
              style={styles.username}
              avatarUrl={profile?.avatar_url}
              showAvatar
              avatarSize={32}
            />
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleInboxPress} hitSlop={12}>
              <View style={styles.inboxBubbleWrap}>
                <Ionicons
                  name={unreadCount > 0 ? 'chatbubble' : 'chatbubble-outline'}
                  size={26}
                  color={unreadCount > 0 ? colors.accent : colors.textSecondary}
                />
                {unreadCount > 0 && (
                  <View style={styles.inboxBubbleCountWrap} pointerEvents="none">
                    <Text style={styles.inboxBubbleCount}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nav.push('/settings')} hitSlop={12}>
              <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ProfileStatsRow
          postCount={profile?.postCount ?? 0}
          followerCount={profile?.followerCount ?? 0}
          followingCount={profile?.followingCount ?? 0}
          activeTab={statsActiveTab}
          onTabChange={handleStatsTabChange}
        />
      </View>

      {/* TODO: revisit wish feature once we figure out how it will work
      {(activeTab === 'posts' || activeTab === 'saved' || activeTab === 'dreams') && (
        <View style={styles.wishRow}>
          <DreamWishBadge variant="card" />
        </View>
      )}
      */}

      {(activeTab === 'posts' || activeTab === 'saved' || activeTab === 'dreams') && (
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={activeTab === 'posts' ? colors.textPrimary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              My Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dreams' && styles.tabActive]}
            onPress={() => setActiveTab('dreams')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'dreams' ? 'moon' : 'moon-outline'}
              size={16}
              color={activeTab === 'dreams' ? colors.textPrimary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'dreams' && styles.tabTextActive]}>
              My Dreams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'saved' ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={activeTab === 'saved' ? colors.textPrimary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
              Saved
            </Text>
          </TouchableOpacity>
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
        <PostGrid
          source={sourceMap[activeTab]}
          isOwn={activeTab === 'posts' || activeTab === 'dreams'}
          emptyText={emptyMap[activeTab]}
          ListHeaderComponent={header}
          scrollToTopToken={profileResetToken}
          showPrivateBadge={activeTab === 'dreams'}
          highlightPostId={currentPostId ?? undefined}
        />
      </SafeAreaView>
    );
  }

  const listData = activeTab === 'followers' ? followers : following;
  const isLoadingList = activeTab === 'followers' ? loadingFollowers : loadingFollowing;
  const emptyLabel = activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet';

  return (
    <SafeAreaView style={styles.root}>
      <FlatList<FollowUser>
        key="users"
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginBottom: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  username: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  email: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {},
  tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: colors.textPrimary },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
  wishRow: { paddingHorizontal: 16, paddingBottom: 8 },
});
