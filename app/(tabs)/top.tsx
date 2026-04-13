/**
 * Search + Explore Screen — dual-mode tab.
 *
 * BROWSE MODE (default): medium/vibe pills + fullscreen feed. Same as the old Explore tab.
 * SEARCH MODE (tap search bar): pills hidden, feed hidden, search results shown.
 *
 * The two modes are mutually exclusive — no dual-filter confusion.
 * Instagram Explore pattern: search bar at top, discovery grid below.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList as RNFlatList,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useExploreStore } from '@/store/explore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapRpcToDreamPost, castRows } from '@/lib/mapPost';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useSearchUsers, type SearchUser } from '@/hooks/useSearchUsers';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { useAlbumStore } from '@/store/album';
import { colors, ANIM } from '@/constants/theme';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import { PostTile } from '@/components/PostTile';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import type { DreamPostItem } from '@/components/DreamCard';

// ── Browse mode ──────────────────────────────────────────────────────────────

const FEED_PAGE_SIZE = 20;

interface ExploreCursor {
  score: number;
  id: string;
}

function useExploreDreams(mediums: string[], vibes: string[]) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const medium = mediums[0] ?? null;
  const vibe = vibes[0] ?? null;

  return useInfiniteQuery({
    queryKey: ['explore', medium ?? '', vibe ?? '', feedSeed],
    queryFn: async ({ pageParam }): Promise<(DreamPostItem & { feed_score?: number })[]> => {
      const { data, error } = await supabase.rpc('get_feed', {
        p_user_id: user!.id,
        p_limit: FEED_PAGE_SIZE,
        p_seed: feedSeed,
        p_tab: 'forYou',
        ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
        ...(medium ? { p_medium: medium } : {}),
        ...(vibe ? { p_vibe: vibe } : {}),
      });
      if (error) throw error;
      return castRows(data).map((row) => ({
        ...mapRpcToDreamPost(row),
        feed_score: row.feed_score as number,
      }));
    },
    initialPageParam: null as ExploreCursor | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) return undefined;
      const last = lastPage[lastPage.length - 1];
      if (last.feed_score == null) return undefined;
      return { score: last.feed_score, id: last.id } as ExploreCursor;
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

// ── Search mode components ───────────────────────────────────────────────────

const TILE_GAP = 2;
const TILE_WIDTH = (Dimensions.get('window').width - TILE_GAP) / 2;

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
      style={s.searchUserRow}
      onPress={() => nav.push(`/user/${user.id}`)}
      activeOpacity={0.7}
    >
      {user.avatarUrl ? (
        <Image
          source={{ uri: resizeAvatar(user.avatarUrl) }}
          style={s.searchAvatar}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={s.searchAvatarFallback}>
          <Text style={s.searchAvatarText}>{(user.username || '?')[0].toUpperCase()}</Text>
        </View>
      )}
      <View style={s.searchUserInfo}>
        <Text style={s.searchUsername}>{user.username}</Text>
      </View>
      <View style={s.searchActions}>
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

// ── Main screen ──────────────────────────────────────────────────────────────

export default function SearchExploreScreen() {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  // ── Search state ──
  const [searchActive, setSearchActiveLocal] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const setSearchActiveStore = useExploreStore((s) => s.setSearchActive);

  function activateSearch() {
    setSearchActiveLocal(true);
    setSearchActiveStore(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }

  function deactivateSearch() {
    Keyboard.dismiss();
    setQuery('');
    setSearchActiveLocal(false);
    setSearchActiveStore(false);
  }

  // Search hooks (only fire when search is active + query is long enough)
  const hasQuery = debouncedQuery.trim().length >= 2;
  const { data: userResults = [], isLoading: usersLoading } = useSearchUsers(
    searchActive ? debouncedQuery : ''
  );
  const {
    data: postPages,
    isLoading: postsLoading,
    fetchNextPage: fetchMorePosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: fetchingMorePosts,
  } = useSearchPosts(searchActive ? debouncedQuery : '');

  const searchPosts = useMemo(() => postPages?.pages.flatMap((p) => p.rows) ?? [], [postPages]);
  const searchAlbumIds = useMemo(() => searchPosts.map((p) => p.id), [searchPosts]);
  const searchLoading = usersLoading || postsLoading;
  const hasResults = userResults.length > 0 || searchPosts.length > 0;

  // Unified FlatList data for search mode
  const searchListData = useMemo(() => {
    if (!hasQuery || !searchActive) return [];
    const items: SearchItem[] = [];
    if (userResults.length > 0) {
      items.push({ type: 'userHeader' });
      for (const user of userResults.slice(0, 3)) {
        items.push({ type: 'user', user });
      }
      if (userResults.length > 3) {
        items.push({ type: 'seeAllUsers' });
      }
    }
    if (searchPosts.length > 0) {
      items.push({ type: 'postHeader' });
      for (let i = 0; i < searchPosts.length; i += 2) {
        items.push({ type: 'postPair', left: searchPosts[i], right: searchPosts[i + 1] });
      }
    }
    return items;
  }, [hasQuery, searchActive, userResults, searchPosts]);

  const renderSearchItem = useCallback(
    ({ item }: { item: SearchItem }) => {
      switch (item.type) {
        case 'userHeader':
          return <SectionHeader title="People" />;
        case 'user':
          return <SearchRow user={item.user} />;
        case 'seeAllUsers':
          return null;
        case 'postHeader':
          return <SectionHeader title="Dreams" />;
        case 'postPair':
          return <PostPairRow left={item.left} right={item.right} albumIds={searchAlbumIds} />;
        default:
          return null;
      }
    },
    [searchAlbumIds]
  );

  const searchKeyExtractor = useCallback((item: SearchItem, index: number) => {
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
  }, []);

  // ── Browse state (existing Explore logic) ──
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  const MEDIUM_PILLS = useMemo(
    () => [...dbMediums].sort((a, b) => a.label.localeCompare(b.label)),
    [dbMediums]
  );
  const VIBE_PILLS = useMemo(
    () => [...dbVibes].sort((a, b) => a.label.localeCompare(b.label)),
    [dbVibes]
  );
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const pendingMedium = useExploreStore((s) => s.pendingMedium);
  const pendingVibe = useExploreStore((s) => s.pendingVibe);
  const clearPending = useExploreStore((s) => s.clearPending);
  const listRef = useRef<FlatList>(null) as React.RefObject<FlatList>;
  const mediumScrollRef = useRef<ScrollView>(null);
  const vibeScrollRef = useRef<ScrollView>(null);
  const mediumLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});
  const vibeLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});

  useEffect(() => {
    if (pendingMedium !== null || pendingVibe !== null) {
      if (searchActive) deactivateSearch();
      setSelectedMedium(pendingMedium);
      if (pendingVibe) setSelectedVibe(pendingVibe);
      clearPending();
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      setTimeout(() => {
        scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, pendingMedium);
        scrollPillIntoView(vibeScrollRef, vibeLayoutsRef.current, pendingVibe);
      }, 100);
    }
  }, [pendingMedium, pendingVibe, clearPending]);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    setTimeout(() => {
      scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, selectedMedium);
    }, 100);
  }, [feedSeed]);

  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value < 0.5 ? 'none' : 'auto',
  }));
  const setHudVisible = useFeedStore((s) => s.setHudVisible);
  const handleHudToggle = useCallback(
    (visible: boolean) => {
      overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: ANIM.HUD_FADE_MS });
      setHudVisible(visible);
    },
    [overlayOpacity, setHudVisible]
  );

  const activeMediums = selectedMedium ? [selectedMedium] : [];
  const activeVibes = selectedVibe ? [selectedVibe] : [];

  const { data, isLoading, refetch, isRefetching, fetchNextPage, hasNextPage } = useExploreDreams(
    activeMediums,
    activeVibes
  );
  const posts = data?.pages.flat() ?? [];

  function scrollPillIntoView(
    scrollRef: React.RefObject<ScrollView | null>,
    layouts: Record<string, { x: number; width: number }>,
    key: string | null
  ) {
    if (!key || !layouts[key] || !scrollRef.current) return;
    const { x } = layouts[key];
    scrollRef.current.scrollTo({ x: Math.max(0, x - 8), animated: true });
  }

  function selectMedium(key: string) {
    const next = selectedMedium === key ? null : key;
    setSelectedMedium(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (next) scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, next);
  }

  function selectVibe(key: string) {
    const next = selectedVibe === key ? null : key;
    setSelectedVibe(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (next) scrollPillIntoView(vibeScrollRef, vibeLayoutsRef.current, next);
  }

  const filterLabel =
    [
      selectedMedium ? MEDIUM_PILLS.find((p) => p.key === selectedMedium)?.label : null,
      selectedVibe ? VIBE_PILLS.find((p) => p.key === selectedVibe)?.label : null,
    ]
      .filter(Boolean)
      .join(' + ') || 'all';

  // ── Render ──

  return (
    <View style={s.root}>
      {/* Browse mode: fullscreen feed (hidden when searching) */}
      {!searchActive && (
        <FullScreenFeed
          posts={posts}
          isLoading={isLoading}
          isRefreshing={isRefetching}
          onRefresh={() => refetch()}
          onEndReached={() => hasNextPage && fetchNextPage()}
          listRef={listRef}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="moon-outline" size={48} color={colors.textSecondary} />
              <Text style={s.emptyTitle}>No {filterLabel?.toLowerCase()} dreams yet</Text>
              <Text style={s.emptySubtitle}>Be the first to create one</Text>
            </View>
          }
          onHudToggle={handleHudToggle}
        />
      )}

      {/* Search mode: results list */}
      {searchActive && (
        <KeyboardAvoidingView
          style={s.searchContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={[s.searchSafeTop, { paddingTop: insets.top + 60 }]}>
            <RNFlatList
              data={searchListData}
              keyExtractor={searchKeyExtractor}
              renderItem={renderSearchItem}
              keyboardShouldPersistTaps="handled"
              onEndReached={() => {
                if (hasMorePosts && !fetchingMorePosts) fetchMorePosts();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                fetchingMorePosts ? (
                  <View style={s.searchFooter}>
                    <ActivityIndicator color={colors.textSecondary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={s.searchEmpty}>
                  {searchLoading && hasQuery ? (
                    <ActivityIndicator color={colors.textSecondary} />
                  ) : hasQuery && !hasResults ? (
                    <Text style={s.searchEmptyText}>No results found</Text>
                  ) : (
                    <>
                      <Ionicons
                        name="search"
                        size={40}
                        color={colors.border}
                        style={{ marginBottom: 12 }}
                      />
                      <Text style={s.searchEmptyText}>Search for dreamers and dreams</Text>
                    </>
                  )}
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Overlay: search bar + pills (pills hidden when searching) */}
      <Animated.View style={[s.topOverlayWrap, searchActive ? undefined : overlayStyle]}>
        <LinearGradient
          colors={
            searchActive
              ? [colors.background, colors.background, colors.background]
              : ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']
          }
          style={[s.topOverlay, { paddingTop: insets.top + 4 }]}
          pointerEvents="box-none"
        >
          {/* Search bar */}
          <View style={s.searchBarRow}>
            <View style={s.searchBarWrap}>
              <Ionicons name="search" size={16} color={colors.textSecondary} style={s.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={s.searchInput}
                placeholder="Search dreamers and dreams"
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                onFocus={activateSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {searchActive && (
              <TouchableOpacity onPress={deactivateSearch} hitSlop={8} style={s.cancelButton}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Medium + Vibe pills (hidden when searching) */}
          {!searchActive && (
            <>
              <View style={s.filterRow}>
                <View style={s.filterIcon}>
                  <Ionicons name="brush-outline" size={14} color="rgba(255,255,255,0.45)" />
                </View>
                <ScrollView
                  ref={mediumScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.pillRow}
                >
                  {MEDIUM_PILLS.map((m) => (
                    <View
                      key={m.key}
                      onLayout={(e) => {
                        mediumLayoutsRef.current[m.key] = {
                          x: e.nativeEvent.layout.x,
                          width: e.nativeEvent.layout.width,
                        };
                      }}
                    >
                      <OverlayPill
                        label={m.label}
                        active={selectedMedium === m.key}
                        onPress={() => selectMedium(m.key)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={s.filterRow}>
                <View style={s.filterIcon}>
                  <Ionicons name="sparkles-outline" size={14} color="rgba(255,255,255,0.45)" />
                </View>
                <ScrollView
                  ref={vibeScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.pillRow}
                >
                  {VIBE_PILLS.map((v) => (
                    <View
                      key={v.key}
                      onLayout={(e) => {
                        vibeLayoutsRef.current[v.key] = {
                          x: e.nativeEvent.layout.x,
                          width: e.nativeEvent.layout.width,
                        };
                      }}
                    >
                      <OverlayPill
                        label={v.label}
                        active={selectedVibe === v.key}
                        onPress={() => selectVibe(v.key)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  // Browse mode
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },

  // Overlay
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: { paddingBottom: 8, gap: 6 },

  // Search bar
  searchBarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15, height: 40 },
  cancelButton: { paddingVertical: 8 },
  cancelText: { color: colors.accent, fontSize: 15, fontWeight: '600' },

  // Pills
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterIcon: { width: 30, alignItems: 'center', justifyContent: 'center', paddingLeft: 10 },
  pillRow: { gap: 6, paddingRight: 16 },

  // Search mode
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchSafeTop: { flex: 1 },
  searchFooter: { paddingVertical: 20 },
  searchEmpty: { alignItems: 'center', paddingTop: 60 },
  searchEmptyText: { color: colors.textSecondary, fontSize: 14 },

  // Search results — users
  searchUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  searchAvatar: { width: 44, height: 44, borderRadius: 22 },
  searchAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAvatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  searchUserInfo: { flex: 1, gap: 2 },
  searchUsername: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  searchActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
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

  // Search results — posts
  postPairRow: { flexDirection: 'row', gap: TILE_GAP },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
