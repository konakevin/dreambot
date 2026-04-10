import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// nav used for debounced navigation, router for back()
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useSearchUsers, type SearchUser } from '@/hooks/useSearchUsers';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { useAlbumStore } from '@/store/album';
import { PostTile } from '@/components/PostTile';
import * as nav from '@/lib/navigate';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import type { DreamPostItem } from '@/components/DreamCard';

const TILE_GAP = 2;
const TILE_WIDTH = (Dimensions.get('window').width - TILE_GAP) / 2;

// ── Mixed result types for the unified FlatList ──

type SearchItem =
  | { type: 'userHeader' }
  | { type: 'user'; user: SearchUser }
  | { type: 'seeAllUsers' }
  | { type: 'postHeader' }
  | { type: 'postPair'; left: DreamPostItem; right?: DreamPostItem };

function SearchRow({ user }: { user: SearchUser }) {
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { data: requestIds = new Set<string>() } = useOutgoingFollowRequestIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const isFollowing = followingIds.has(user.id);
  const hasRequest = requestIds.has(user.id);

  return (
    <TouchableOpacity
      style={s.row}
      onPress={() => nav.push(`/user/${user.id}`)}
      activeOpacity={0.7}
    >
      {user.avatarUrl ? (
        <Image
          source={{ uri: resizeAvatar(user.avatarUrl) }}
          style={s.avatar}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={s.avatarFallback}>
          <Text style={s.avatarText}>{(user.username || '?')[0].toUpperCase()}</Text>
        </View>
      )}

      <View style={s.userInfo}>
        <Text style={s.username}>{user.username}</Text>
      </View>

      <View style={s.actions}>
        {isFollowing ? (
          <TouchableOpacity
            style={s.followingPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: true });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followingPillText}>Following</Text>
          </TouchableOpacity>
        ) : hasRequest ? (
          <TouchableOpacity
            style={s.followingPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: false, hasRequest: true });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followingPillText}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.followButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: false, isPublic: user.isPublic });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

function PostPairRow({
  left,
  right,
  albumIds,
}: {
  left: DreamPostItem;
  right?: DreamPostItem;
  albumIds: string[];
}) {
  return (
    <View style={s.postPairRow}>
      <View style={{ width: TILE_WIDTH }}>
        <PostTile item={left} albumIds={albumIds} />
      </View>
      {right ? (
        <View style={{ width: TILE_WIDTH }}>
          <PostTile item={right} albumIds={albumIds} />
        </View>
      ) : (
        <View style={{ width: TILE_WIDTH }} />
      )}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: userResults = [], isLoading: usersLoading } = useSearchUsers(debouncedQuery);
  const {
    data: postPages,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPosts(debouncedQuery);

  const posts = useMemo(() => postPages?.pages.flatMap((p) => p.rows) ?? [], [postPages]);
  const postAlbumIds = useMemo(() => posts.map((p) => p.id), [posts]);

  const isLoading = usersLoading || postsLoading;
  const hasQuery = debouncedQuery.trim().length >= 2;
  const hasResults = userResults.length > 0 || posts.length > 0;

  // Build unified data for FlatList
  const listData = useMemo(() => {
    if (!hasQuery) return [];
    const items: SearchItem[] = [];

    // People section
    if (userResults.length > 0) {
      items.push({ type: 'userHeader' });
      const showUsers = userResults.slice(0, 3);
      for (const user of showUsers) {
        items.push({ type: 'user', user });
      }
      if (userResults.length > 3) {
        items.push({ type: 'seeAllUsers' });
      }
    }

    // Dreams section
    if (posts.length > 0) {
      items.push({ type: 'postHeader' });
      for (let i = 0; i < posts.length; i += 2) {
        items.push({ type: 'postPair', left: posts[i], right: posts[i + 1] });
      }
    }

    return items;
  }, [hasQuery, userResults, posts]);

  const renderItem = ({ item }: { item: SearchItem }) => {
    switch (item.type) {
      case 'userHeader':
        return <SectionHeader title="People" />;
      case 'user':
        return <SearchRow user={item.user} />;
      case 'seeAllUsers':
        return (
          <TouchableOpacity
            style={s.seeAll}
            onPress={() => {
              // Could navigate to a full user search, for now just show all inline
            }}
            activeOpacity={0.7}
          >
            <Text style={s.seeAllText}>See all users</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.accent} />
          </TouchableOpacity>
        );
      case 'postHeader':
        return <SectionHeader title="Dreams" />;
      case 'postPair':
        return <PostPairRow left={item.left} right={item.right} albumIds={postAlbumIds} />;
      default:
        return null;
    }
  };

  const keyExtractor = (item: SearchItem, index: number) => {
    switch (item.type) {
      case 'userHeader':
        return 'uh';
      case 'user':
        return `u-${item.user.id}`;
      case 'seeAllUsers':
        return 'sa';
      case 'postHeader':
        return 'ph';
      case 'postPair':
        return `pp-${item.left.id}`;
      default:
        return `i-${index}`;
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>
      {/* Header with close button */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Search</Text>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => router.back(), 50);
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={s.closeButton}
          activeOpacity={0.5}
        >
          <Ionicons name="close" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search input */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={colors.textSecondary} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Search dreamers and dreams"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={s.footer}>
              <ActivityIndicator color={colors.textSecondary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={s.empty}>
            {isLoading && hasQuery ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : hasQuery && !hasResults ? (
              <Text style={s.emptyText}>No results found</Text>
            ) : (
              <>
                <Ionicons
                  name="search"
                  size={40}
                  color={colors.border}
                  style={{ marginBottom: 12 }}
                />
                <Text style={s.emptyText}>Search for dreamers and dreams</Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15, height: 44 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  userInfo: { flex: 1, gap: 2 },
  username: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  followButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followButtonText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  followingPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followingPillText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  seeAllText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  postPairRow: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
  footer: { paddingVertical: 20 },
});
