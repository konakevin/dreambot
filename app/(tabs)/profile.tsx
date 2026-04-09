import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from '@/store/feed';
import { DreamWishBadge } from '@/components/DreamWishBadge';
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
import { PostGrid } from '@/components/PostGrid';
import { GradientUsername } from '@/components/GradientUsername';
import { colors } from '@/constants/theme';
import { ProfileStatsRow, type StatsTab } from '@/components/ProfileStatsRow';
import { FollowUserRow } from '@/components/FollowUserRow';
import { FriendRequestRow } from '@/components/FriendRequestRow';
import { useFriendsList, type FriendUser } from '@/hooks/useFriendsList';
import { usePendingRequests } from '@/hooks/usePendingRequests';
import { useRespondFriendRequest } from '@/hooks/useRespondFriendRequest';
import { useRemoveFriend } from '@/hooks/useRemoveFriend';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'saved' | 'dreams' | 'friends' | 'followers' | 'following';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const profileResetToken = useFeedStore((s) => s.profileResetToken);
  const queryClient = useQueryClient();

  // Reset to posts tab only when profile tab icon is re-tapped
  useEffect(() => {
    if (profileResetToken > 0) {
      setActiveTab('posts');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    }
  }, [profileResetToken]);

  // Only fetch what's needed for the active tab — avoids 6+ parallel queries on mount
  const isSocialTab =
    activeTab === 'friends' || activeTab === 'followers' || activeTab === 'following';
  const { data: profile, refetch: refetchProfile, isRefetching } = usePublicProfile(user?.id ?? '');
  const { data: followers = [], isLoading: loadingFollowers } = useFollowersList(
    isSocialTab ? (user?.id ?? '') : ''
  );
  const { data: following = [], isLoading: loadingFollowing } = useFollowingList(
    isSocialTab ? (user?.id ?? '') : ''
  );
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const { data: friends = [], isLoading: loadingFriends } = useFriendsList(
    isSocialTab ? (user?.id ?? '') : ''
  );
  const { data: pendingRequests = [] } = usePendingRequests();
  const { mutate: respondRequest } = useRespondFriendRequest();
  const { mutate: removeFriend } = useRemoveFriend();

  const handleRefresh = useCallback(() => {
    refetchProfile();
    queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
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
          <TouchableOpacity onPress={() => nav.push('/settings')} hitSlop={12}>
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ProfileStatsRow
          postCount={profile?.postCount ?? 0}
          friendCount={profile?.friendCount ?? 0}
          followerCount={profile?.followerCount ?? 0}
          followingCount={profile?.followingCount ?? 0}
          activeTab={statsActiveTab}
          onTabChange={handleStatsTabChange}
          pendingCount={pendingRequests.length}
          hiddenTabs={[]}
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
      posts: 'No posts yet',
      saved: 'Nothing saved yet',
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
        />
      </SafeAreaView>
    );
  }

  if (activeTab === 'friends') {
    // Combine pending requests + accepted friends
    type ListItem =
      | { type: 'request'; data: (typeof pendingRequests)[number] }
      | { type: 'friend'; data: FriendUser };

    const sections: ListItem[] = [
      ...pendingRequests.map((r) => ({ type: 'request' as const, data: r })),
      ...friends.map((f) => ({ type: 'friend' as const, data: f })),
    ];

    return (
      <SafeAreaView style={styles.root}>
        <FlatList
          key="friends"
          data={sections}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          keyExtractor={(item) => {
            if (item.type === 'request') return `req-${item.data.requesterId}`;
            if (item.type === 'friend') return `fr-${item.data.id}`;
            return `fr-unknown`;
          }}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <View style={styles.center}>
              {loadingFriends ? (
                <ActivityIndicator color={colors.textSecondary} />
              ) : (
                <Text style={styles.emptyText}>No friends yet</Text>
              )}
            </View>
          }
          renderItem={({ item }) => {
            if (item.type === 'request') {
              return (
                <FriendRequestRow
                  request={item.data}
                  onAccept={(id) => respondRequest({ requesterId: id, accept: true })}
                  onDecline={(id) => respondRequest({ requesterId: id, accept: false })}
                />
              );
            }
            return (
              <FollowUserRow
                item={item.data}
                isFollowing={followingIds.has(item.data.id)}
                onFollow={handleFollowUser}
              />
            );
          }}
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
            refreshing={isRefetching}
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
