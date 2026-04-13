import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
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
import { useState, useEffect } from 'react';
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useFollowersList } from '@/hooks/useFollowersList';
import { useFollowingList } from '@/hooks/useFollowingList';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { useAuthStore } from '@/store/auth';
import { PostGrid } from '@/components/PostGrid';
import { GradientUsername } from '@/components/GradientUsername';
import { colors } from '@/constants/theme';
import { ProfileStatsRow, type StatsTab } from '@/components/ProfileStatsRow';
import { FollowUserRow } from '@/components/FollowUserRow';
import { useReport } from '@/hooks/useReport';
import { useBlockedIds, useToggleBlock } from '@/hooks/useBlockUser';
import { showAlert } from '@/components/CustomAlert';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'followers' | 'following';

export default function PublicProfileScreen() {
  const { userId, viewedPost } = useLocalSearchParams<{ userId: string; viewedPost?: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === userId;
  const { translateX, panHandlers } = useSwipeBack();

  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
    isRefetching,
  } = usePublicProfile(userId);
  const { data: followers = [], isLoading: loadingFollowers } = useFollowersList(userId);
  const { data: following = [], isLoading: loadingFollowing } = useFollowingList(userId);
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { data: requestIds = new Set<string>() } = useOutgoingFollowRequestIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const { mutate: report } = useReport();
  const { data: blockedIds = new Set<string>() } = useBlockedIds();
  const { mutate: toggleBlock } = useToggleBlock();
  const isBlocked = blockedIds.has(userId);

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

  useEffect(() => {
    if (showAvatarPreview) {
      overlayOpacity.value = withTiming(1, { duration: 250 });
      avatarProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    }
  }, [showAvatarPreview]);

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

  const isFollowing = followingIds.has(userId);
  const hasRequest = requestIds.has(userId);
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

  const followLabel = isFollowing ? 'Following' : hasRequest ? 'Requested' : 'Follow';

  if (profileLoading || !profile) {
    return (
      <Animated.View {...panHandlers} style={[styles.root, { transform: [{ translateX }] }]}>
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
      </Animated.View>
    );
  }

  const backButton = (
    <View style={styles.backRow}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      {!isOwnProfile && (
        <TouchableOpacity onPress={handleMoreMenu} style={styles.backButton} hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const header = (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setShowAvatarPreview(true)} activeOpacity={0.8}>
          <GradientUsername
            username={profile.username}
            rank={null}
            hideRank
            style={styles.username}
            avatarUrl={profile.avatar_url}
            showAvatar
            avatarSize={32}
          />
        </TouchableOpacity>
        {!isOwnProfile && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.followButton, (isFollowing || hasRequest) && styles.followingButton]}
              onPress={handleFollow}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.followButtonText,
                  (isFollowing || hasRequest) && styles.followingButtonText,
                ]}
              >
                {followLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ProfileStatsRow
        postCount={profile.postCount}
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
      />
    </View>
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
        <ReAnimated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.9)' },
            animatedOverlayStyle,
          ]}
        />
        <ReAnimated.View style={animatedAvatarStyle}>
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
        </ReAnimated.View>
        <ReAnimated.View
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
        </ReAnimated.View>
        <TouchableOpacity style={styles.avatarClose} onPress={closeAvatarPreview}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  ) : null;

  const canSeePosts = profile.is_public || isFollowing || isOwnProfile;

  if (activeTab === 'posts') {
    return (
      <Animated.View {...panHandlers} style={[styles.root, { transform: [{ translateX }] }]}>
        <SafeAreaView style={styles.root}>
          {backButton}
          {avatarModal}
          {canSeePosts ? (
            <PostGrid
              source={{ type: 'user', userId }}
              emptyText="No posts yet"
              ListHeaderComponent={header}
              highlightPostId={viewedPost}
            />
          ) : (
            <ScrollView>
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
      </Animated.View>
    );
  }

  const listData = activeTab === 'followers' ? followers : following;
  const isLoadingList = activeTab === 'followers' ? loadingFollowers : loadingFollowing;
  const emptyLabel = activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet';

  return (
    <Animated.View {...panHandlers} style={[styles.root, { transform: [{ translateX }] }]}>
      <SafeAreaView style={styles.root}>
        {backButton}
        {avatarModal}
        <FlatList<FollowUser>
          key="users"
          data={listData}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetchProfile()}
              tintColor={colors.accent}
            />
          }
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginBottom: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  username: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  followButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  followingButton: { borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.08)' },
  followButtonText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '700' },
  followingButtonText: { color: colors.textSecondary },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
  avatarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  avatarUsername: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
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
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  lockedTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  lockedSub: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});
