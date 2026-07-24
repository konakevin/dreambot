import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Animated,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
import { useInFlightDreams } from '@/hooks/useInFlightDreams';
import { ProfileHeader } from '@/components/ProfileHeader';
import { PostActionSheet } from '@/components/PostActionSheet';
import { photoSourceRows } from '@/lib/photoSourceRows';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { minRefreshHold } from '@/lib/minRefresh';
import { useRefreshGap } from '@/hooks/useRefreshGap';
import { avatarUrl } from '@/lib/imageUrl';
import { useChangeAvatar } from '@/hooks/useChangeAvatar';
import type { DreamsFilter } from '@/hooks/useMyDreams';
import { Toast } from '@/components/Toast';
import { showAlert } from '@/components/CustomAlert';
import { useBulkDeletePosts, useBulkMakePrivate } from '@/hooks/useDeletePost';
import { useBulkUnsave, useBulkUnrepost } from '@/hooks/useBulkUnsaveUnrepost';
import { AvatarPreviewModal } from '@/components/AvatarPreviewModal';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useRenderDockHeight, useRenderDockStore } from '@/store/renderDock';
import { useFocusEffect } from '@react-navigation/native';
import { trackProfileViewed } from '@/lib/analytics';
import { type StatsTab } from '@/components/ProfileStatsRow';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { FollowUserRow } from '@/components/FollowUserRow';
import type { FollowUser } from '@/hooks/useFollowersList';

type Tab = 'posts' | 'saved' | 'dreams' | 'reposts' | 'followers' | 'following';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  // Dreams album filter (segmented control on the right of the subheader):
  // All / Posted (live on feed) / Private (unposted). Persisted per migration 306.
  const [dreamsFilter, setDreamsFilter] = useState<DreamsFilter>('all');

  // ── Grid multi-select (bulk edit: Posts + Dreams albums, 2026-07-10) ──────
  // Entered via the tile long-press sheet's "Select" row; tap toggles tiles;
  // Done / tab switch / completing an action exit. Two verbs in one bottom
  // row: Make Private (reversible — no confirm) and Delete (confirm; batched;
  // one summary toast; partial failures resync from the server).
  const [gridSelecting, setGridSelecting] = useState(false);
  const [gridSelectedIds, setGridSelectedIds] = useState<Set<string>>(new Set());
  const { galleryMaxImages } = useEngineConfig();
  // Selection is uncapped (users over-select to bulk-DELETE), but an album
  // caps at galleryMaxImages — so Post disables past the cap and says why.
  const overGalleryCap = gridSelectedIds.size > galleryMaxImages;
  const bulkDelete = useBulkDeletePosts();
  const bulkPrivate = useBulkMakePrivate();
  const bulkUnsave = useBulkUnsave();
  const bulkUnrepost = useBulkUnrepost();
  const exitGridSelection = useCallback(() => {
    setGridSelecting(false);
    setGridSelectedIds(new Set());
  }, []);
  // Any tab change exits the mode (covers posts↔dreams too — a selection
  // must never silently carry across albums).
  useEffect(() => {
    exitGridSelection();
  }, [activeTab, exitGridSelection]);
  const enterGridSelection = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGridSelecting(true);
    setGridSelectedIds(new Set([id]));
  }, []);
  const toggleGridSelected = useCallback((id: string) => {
    setGridSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // Deselecting the last tile keeps you IN select mode at "0 selected" so you
      // can pick a different first image (Kevin 2026-07-11). Only the Cancel
      // button above the grid exits — the bottom action pills disable at 0.
      return next;
    });
  }, []);
  // Reference-stable selection object for PostGrid: only a NEW identity when the
  // active tab, mode, or selected set actually changes — NOT on every render.
  // A fresh object each render defeated PostTile's memo and janked select-mode
  // scrolling (Kevin 2026-07-18).
  const gridSelection = useMemo(
    () =>
      activeTab === 'dreams' ||
      activeTab === 'posts' ||
      activeTab === 'saved' ||
      activeTab === 'reposts'
        ? {
            active: gridSelecting,
            selectedIds: gridSelectedIds,
            onToggle: toggleGridSelected,
            onEnter: enterGridSelection,
          }
        : undefined,
    [activeTab, gridSelecting, gridSelectedIds, toggleGridSelected, enterGridSelection]
  );
  const handleBulkDelete = useCallback(async () => {
    const count = gridSelectedIds.size;
    if (count === 0 || bulkDelete.isPending) return;
    const ids = [...gridSelectedIds];

    // Album-aware warning: deleting an album deletes the images INSIDE it too
    // ("the album owns its images", Kevin 2026-07-11). Count how many of the
    // selected are albums + the total child images that go with them.
    let albumLine = '';
    try {
      const { data } = await supabase
        .from('uploads')
        .select('media_count')
        .in('id', ids)
        .gt('media_count', 1);
      const albums = data?.length ?? 0;
      const images = (data ?? []).reduce((sum, r) => sum + ((r.media_count as number) ?? 0), 0);
      if (albums > 0) {
        albumLine = ` That includes ${albums} album${albums === 1 ? '' : 's'}, so the ${images} image${images === 1 ? '' : 's'} inside go too.`;
      }
    } catch {
      // best-effort — a failed count never blocks the delete confirm.
    }

    showAlert(
      // No count in the title: a selection count conflates albums with singles
      // (2 selected can be 1 album + 1 dream = 5 images). The body spells out
      // any album impact instead (Kevin 2026-07-11).
      'Delete these dreams?',
      "They'll disappear everywhere, including the feed. Once they're gone, they're gone, with no dreaming them back." +
        albumLine,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Exit select mode IMMEDIATELY (the delete is optimistic — the tiles
            // are already gone) so the selection bar clears and the success toast
            // is visible right away, instead of the bar hanging with no toast
            // until the BATCHED delete resolves seconds later, forcing a manual
            // Cancel (Kevin 2026-07-12). Mirrors handleBulkPost.
            bulkDelete.mutate(ids);
            exitGridSelection();
          },
        },
      ]
    );
  }, [gridSelectedIds, bulkDelete, exitGridSelection]);
  const handleBulkMakePrivate = useCallback(() => {
    const count = gridSelectedIds.size;
    if (count === 0 || bulkPrivate.isPending) return;
    showAlert(
      `Make ${count} dream${count === 1 ? '' : 's'} private?`,
      "They'll come off the public feed. You can post them again anytime.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Make Private',
          onPress: () => {
            bulkPrivate.mutate([...gridSelectedIds]);
            exitGridSelection();
          },
        },
      ]
    );
  }, [gridSelectedIds, bulkPrivate, exitGridSelection]);
  // Compose a post from the selected dreams (order = tap order; Set preserves
  // insertion order). 1 → single post, 2+ → gallery, decided in the compose flow.
  const handleBulkPost = useCallback(() => {
    const ids = [...gridSelectedIds];
    if (ids.length === 0 || ids.length > galleryMaxImages) return;
    exitGridSelection();
    nav.push(`/post/new?ids=${ids.join(',')}`);
  }, [gridSelectedIds, galleryMaxImages, exitGridSelection]);
  // Unsave / unrepost are reversible, but confirm anyway (same ceremony as
  // delete / make-private) so a mis-tap on a big selection isn't instant.
  const handleBulkUnsave = useCallback(() => {
    const count = gridSelectedIds.size;
    if (count === 0 || bulkUnsave.isPending) return;
    showAlert(
      `Remove ${count} from saved?`,
      'They come off your saved album. You can save them again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsave',
          onPress: () => {
            bulkUnsave.mutate([...gridSelectedIds]);
            exitGridSelection();
          },
        },
      ]
    );
  }, [gridSelectedIds, bulkUnsave, exitGridSelection]);
  const handleBulkUnrepost = useCallback(() => {
    const count = gridSelectedIds.size;
    if (count === 0 || bulkUnrepost.isPending) return;
    showAlert(
      `Remove ${count} repost${count === 1 ? '' : 's'}?`,
      'They come off your profile. You can repost them again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unrepost',
          onPress: () => {
            bulkUnrepost.mutate([...gridSelectedIds]);
            exitGridSelection();
          },
        },
      ]
    );
  }, [gridSelectedIds, bulkUnrepost, exitGridSelection]);
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

  // Refetch the OWN-profile grids on every RE-focus (skipping the initial mount,
  // which already fetches). A mutation that changes grid membership — posting a
  // new dream/album, or setting a post/album to private — often fires while THIS
  // screen is DETACHED behind a pushed full-screen viewer (the album viewer), or
  // after we've navigated away to compose. The native stack detaches the screen
  // below the top one, so the grid isn't a live observer and the mutation's
  // invalidateProfileGrids refetch doesn't land — the change only showed after a
  // full app refresh (Kevin 2026-07-12). Refetching on return makes it live.
  // refetchType:'active' → only the mounted own-profile grids (they stay enabled
  // across the sub-tabs), never the feed/explore/other-user queries.
  const skipFirstGridRefocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (skipFirstGridRefocus.current) {
        skipFirstGridRefocus.current = false;
        return;
      }
      for (const key of ['userPosts', 'my-dreams', 'favoritePosts', 'userReposts']) {
        queryClient.invalidateQueries({ queryKey: [key], refetchType: 'active' });
      }
    }, [queryClient])
  );

  // Leaving the profile (tab-away, push into a detail screen) exits grid select
  // mode — returning shouldn't strand you mid-selection (Kevin 2026-07-11). The
  // cleanup fires on blur; exitGridSelection is idempotent so the paths that
  // already exit before navigating (bulk Post/Delete) are unaffected.
  useFocusEffect(
    useCallback(() => {
      return () => exitGridSelection();
    }, [exitGridSelection])
  );

  // Dreams-tab auto-acknowledge (migration 340): flag the store while the user
  // is focused on THIS (own) profile with the Dreams sub-tab active, so a dream
  // arriving via realtime is marked seen silently (no bell/badge/toast) — they
  // are watching it slide into the grid. Keyed on activeTab so switching sub-
  // tabs re-runs (cleanup clears it); blur clears it too.
  const setViewingOwnDreams = useFeedStore((s) => s.setViewingOwnDreams);
  useFocusEffect(
    useCallback(() => {
      setViewingOwnDreams(activeTab === 'dreams');
      return () => setViewingOwnDreams(false);
    }, [activeTab, setViewingOwnDreams])
  );

  // The render dock routes here on tap and asks for the Dreams sub-tab (where
  // the pending/finished tiles live). Read the request from the store at FOCUS
  // time (getState — robust to render/navigation ordering; the subscribed value
  // could still be stale on the focus tick) and select Dreams. The re-tap reset
  // below ALSO honors the flag, so whether or not router.navigate fires the tab's
  // tabPress (→ bumpProfileReset → the posts reset), Dreams wins. Clear on a
  // microtask so BOTH this effect and the reset observe it, while a later manual
  // re-tap still lands on Posts.
  useFocusEffect(
    useCallback(() => {
      if (useRenderDockStore.getState().wantsDreamsTab) {
        setActiveTab('dreams');
        setTimeout(() => useRenderDockStore.getState().clearDreamsTab(), 0);
      }
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

  // Load the persisted Dreams filter (users.dreams_filter, migration 306).
  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('dreams_filter')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const f = (data as { dreams_filter?: string } | null)?.dreams_filter;
        if (f === 'all' || f === 'posted' || f === 'private') setDreamsFilter(f);
      });
  }, [user]);

  // Switch the Dreams filter — optimistic, then persist.
  const applyDreamsFilter = useCallback(
    (next: DreamsFilter) => {
      if (next === dreamsFilter) return;
      Haptics.selectionAsync();
      setDreamsFilter(next);
      if (user) {
        supabase
          .from('users')
          .update({ dreams_filter: next })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error && __DEV__) console.warn('persist dreams_filter failed', error);
          });
      }
    },
    [dreamsFilter, user]
  );

  // Reset to posts tab only when profile tab icon is re-tapped — UNLESS the
  // render dock just requested Dreams (its router.navigate can fire this tab's
  // tabPress → bumpProfileReset). Honoring the flag here means Dreams wins
  // regardless of whether the tabPress fired.
  useEffect(() => {
    if (profileResetToken > 0) {
      setActiveTab(useRenderDockStore.getState().wantsDreamsTab ? 'dreams' : 'posts');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    }
  }, [profileResetToken, queryClient]);

  // Only fetch what's needed for the active tab — avoids 6+ parallel queries on mount
  const isSocialTab = activeTab === 'followers' || activeTab === 'following';
  const { data: profile, refetch: refetchProfile } = usePublicProfile(user?.id ?? '');
  // Change-avatar action sheet (under the avatar) — moved here from Settings.
  const {
    chooseFromLibrary,
    takePhoto,
    deletePhoto,
    hasAvatar,
    uploading: avatarUploading,
  } = useChangeAvatar(profile?.avatar_url);
  const tabBarHeight = useBottomTabBarHeight();
  // Render dock clearance — added to the grid / followers list / floating
  // selection bar so none sit under the dock. 0 at rest.
  const dockHeight = useRenderDockHeight();
  // In-flight ("cooking") dreams woven into the top of the Dreams grid.
  const { data: inFlightDreams = [] } = useInFlightDreams();
  const [showPicSheet, setShowPicSheet] = useState(false);
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
  // Self-held pull gap for the followers/following list (native RefreshControl
  // spinner is unreliable on Fabric — see useRefreshGap).
  const followersGap = useRefreshGap(isPulling);
  const handleRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      await Promise.all([
        refetchProfile(),
        queryClient.invalidateQueries({ queryKey: ['userPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['publicProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['my-dreams'] }),
        minRefreshHold(),
      ]);
    } finally {
      setIsPulling(false);
    }
  }, [refetchProfile, queryClient]);
  // Grid pulls refresh the WHOLE profile (header counts/bio/avatar), not just
  // the grid's posts — PostGrid awaits this alongside its own invalidation.
  const refreshHeaderData = useCallback(async () => {
    await Promise.all([
      refetchProfile(),
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] }),
    ]);
  }, [refetchProfile, queryClient]);

  function handleFollowUser(targetId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFollow({ userId: targetId, currentlyFollowing: followingIds.has(targetId) });
  }

  function handleStatsTabChange(tab: StatsTab) {
    setActiveTab(tab as Tab);
  }

  // [Share] copies the profile link straight to the clipboard (on-brand, one
  // tap) instead of the off-brand native share sheet — mirrors the card share's
  // Copy Link. The link is an AASA universal link: recipients WITH DreamBot open
  // it in-app; everyone else lands on the public web profile
  // (`dreambotapp.com/user/<id>`), which has an "Open in DreamBot" CTA. So the
  // not-installed case is handled by the OS + web fallback, not app-detection.
  const handleShareProfile = useCallback(async () => {
    if (!user) return;
    await Clipboard.setStringAsync(`https://dreambotapp.com/user/${user.id}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show('Profile link copied', 'checkmark-circle');
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
  // Profile-picture action menu — same slide-up sheet as the dream-card long-press.
  const picSheet = (
    <PostActionSheet
      visible={showPicSheet}
      onClose={() => setShowPicSheet(false)}
      title="Update Profile Photo"
      titleImageUrl={profile?.avatar_url ? avatarUrl(profile.avatar_url) : null}
      bottomInset={tabBarHeight}
      rows={photoSourceRows({
        onLibrary: chooseFromLibrary,
        onCamera: takePhoto,
        onDelete: hasAvatar ? deletePhoto : undefined,
      })}
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
      {/* While multi-selecting, the ALWAYS-VISIBLE top bar becomes the selection
          bar (count + Cancel) so you can always exit — the old count/Cancel lived
          in the grid's scrolling subheader and vanished once you scrolled the
          album (Kevin 2026-07-12: "can't see the cancel button"). */}
      {gridSelecting ? (
        <>
          <Text style={styles.selectionCountText}>{gridSelectedIds.size} selected</Text>
          <TouchableOpacity
            style={styles.selectionDoneButton}
            onPress={exitGridSelection}
            activeOpacity={0.8}
            hitSlop={8}
          >
            <Text style={styles.selectionDoneText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
            {/* Compose a new post (single or multi-image) from your dreams.
            duplicate-outline (a + on stacked squares) — deliberately NOT the
            nav bar's add-circle ⊕, which creates a DREAM; this adds a POST. */}
            <TouchableOpacity onPress={() => nav.push('/post/new')} hitSlop={12}>
              <Ionicons name="duplicate-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInboxPress} hitSlop={12}>
              <View style={styles.inboxBubbleWrap}>
                <Ionicons
                  name={unreadCount > 0 ? 'notifications' : 'notifications-outline'}
                  size={26}
                  color={unreadCount > 0 ? colors.accent : colors.textSecondary}
                />
                {unreadCount > 0 && (
                  <View style={styles.inboxBadge} pointerEvents="none">
                    <Text allowFontScaling={false} style={styles.inboxBadgeText}>
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
        </>
      )}
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
        avatarUploading={avatarUploading}
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
        onChangePhoto={() => setShowPicSheet(true)}
      >
        {/* Sparkle balance + a doorway to the store (own profile only) */}
        <TouchableOpacity
          onPress={() => nav.push('/sparkleStore')}
          activeOpacity={0.8}
          style={styles.sparkleChip}
        >
          <Ionicons name="sparkles" size={15} color={colors.accent} />
          <Text allowFontScaling={false} style={styles.sparkleChipText}>
            {formatCompact(sparkleBalance)}
          </Text>
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

      {/* Dreams album: a slim right-aligned All / Posted / Private segmented
          filter. The other albums show no subheader — the icons speak for
          themselves. While MULTI-SELECTING, this row (the grid's own chrome,
          sitting directly on the grid) BECOMES the selection bar — count on
          the left, Done on the right — so it reads as the grid's edit mode,
          not detached screen chrome (Kevin 2026-07-10: the top-left ✕ was
          hard to associate with the grid). */}
      {/* Dreams album filter — hidden while multi-selecting (the selection
          count + Cancel now live in the always-visible top bar, and you can't
          re-filter mid-selection anyway). */}
      {activeTab === 'dreams' && !gridSelecting && (
        <View style={styles.dreamsFilterRow}>
          <View style={styles.segmented}>
            {(['all', 'posted', 'private'] as const).map((f) => {
              const active = dreamsFilter === f;
              const label = f === 'all' ? 'All' : f === 'posted' ? 'Posted' : 'Private';
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => applyDreamsFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
      dreams: { type: 'dreams' as const, dreamsFilter },
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
          onRefreshExtra={refreshHeaderData}
          source={sourceMap[activeTab]}
          isOwn={activeTab === 'posts' || activeTab === 'dreams'}
          emptyText={emptyMap[activeTab]}
          ListHeaderComponent={header}
          scrollToTopToken={combinedScrollToTopToken}
          showPrivateBadge={activeTab === 'dreams'}
          highlightPostId={currentPostId ?? undefined}
          onScrollProgress={handleScrollProgress}
          extraBottomInset={dockHeight}
          pendingDreams={activeTab === 'dreams' && dreamsFilter !== 'posted' ? inFlightDreams : []}
          // Multi-select (bulk edit) — Posts + Dreams (delete/private/post) and
          // Saved + Reposts (bulk unsave / unrepost). Present-but-inactive adds
          // the "Select" row to tile long-press sheets.
          selection={gridSelection}
        />
        {/* Selection chrome — the count + Done live in the grid's own filter
            row (the subheader above the grid); the ACTION ROW floats at the
            bottom — the Gmail-toolbar shape (Kevin 2026-07-10). Posts album:
            [Make Private][Delete]; Dreams album: [Delete] only (its grid is
            mostly private already — the extra verb read as noise). */}
        {gridSelecting && (
          <View
            style={[
              styles.selectionActions,
              { bottom: tabBarHeight + verticalScale(12) + dockHeight },
            ]}
          >
            <View style={styles.selectionActionsRow}>
              {/* Post the selected dreams — 1 → single, 2+ → gallery. Only on
                  the PRIVATE sub-filter, where every tile is unposted so "Post"
                  is unambiguous; on All/Posted the tiles are already live, so
                  composing goes through the ＋ new-post entry instead. */}
              {activeTab === 'dreams' && dreamsFilter === 'private' && (
                <TouchableOpacity
                  style={[
                    styles.actionPill,
                    styles.postPill,
                    (gridSelectedIds.size === 0 || overGalleryCap) && styles.actionPillDisabled,
                  ]}
                  onPress={handleBulkPost}
                  disabled={gridSelectedIds.size === 0 || overGalleryCap}
                  activeOpacity={0.85}
                >
                  <Ionicons name="duplicate-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.actionPillText}>
                    {overGalleryCap
                      ? `${galleryMaxImages} max`
                      : `Post${gridSelectedIds.size > 0 ? ` (${gridSelectedIds.size})` : ''}`}
                  </Text>
                </TouchableOpacity>
              )}
              {activeTab === 'posts' && (
                <TouchableOpacity
                  style={[
                    styles.actionPill,
                    (gridSelectedIds.size === 0 || bulkPrivate.isPending) &&
                      styles.actionPillDisabled,
                  ]}
                  onPress={handleBulkMakePrivate}
                  disabled={gridSelectedIds.size === 0 || bulkPrivate.isPending}
                  activeOpacity={0.85}
                >
                  {bulkPrivate.isPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="eye-off-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionPillText}>Make Private</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              {/* Delete — own content only (Posts + Dreams). */}
              {(activeTab === 'dreams' || activeTab === 'posts') && (
                <TouchableOpacity
                  style={[
                    styles.actionPill,
                    styles.deletePill,
                    (gridSelectedIds.size === 0 || bulkDelete.isPending) &&
                      styles.actionPillDisabled,
                  ]}
                  onPress={handleBulkDelete}
                  disabled={gridSelectedIds.size === 0 || bulkDelete.isPending}
                  activeOpacity={0.85}
                >
                  {bulkDelete.isPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionPillText}>
                        Delete{gridSelectedIds.size > 0 ? ` (${gridSelectedIds.size})` : ''}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              {/* Saved album → bulk unsave (reversible). */}
              {activeTab === 'saved' && (
                <TouchableOpacity
                  style={[
                    styles.actionPill,
                    (gridSelectedIds.size === 0 || bulkUnsave.isPending) &&
                      styles.actionPillDisabled,
                  ]}
                  onPress={handleBulkUnsave}
                  disabled={gridSelectedIds.size === 0 || bulkUnsave.isPending}
                  activeOpacity={0.85}
                >
                  {bulkUnsave.isPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="bookmark-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionPillText}>
                        Unsave{gridSelectedIds.size > 0 ? ` (${gridSelectedIds.size})` : ''}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              {/* Reposts album → bulk unrepost (reversible). */}
              {activeTab === 'reposts' && (
                <TouchableOpacity
                  style={[
                    styles.actionPill,
                    (gridSelectedIds.size === 0 || bulkUnrepost.isPending) &&
                      styles.actionPillDisabled,
                  ]}
                  onPress={handleBulkUnrepost}
                  disabled={gridSelectedIds.size === 0 || bulkUnrepost.isPending}
                  activeOpacity={0.85}
                >
                  {bulkUnrepost.isPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="repeat-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionPillText}>
                        Unrepost{gridSelectedIds.size > 0 ? ` (${gridSelectedIds.size})` : ''}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {picSheet}
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
        // `refreshing` pinned FALSE — the native spinner is unreliable on Fabric
        // (react-native#56343); we render our own in the self-held gap below.
        // The control stays only for its pull gesture (onRefresh).
        refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Animated.View style={{ height: followersGap }} />
            {header}
          </>
        }
        // Clear the floating tab bar so the last row isn't trapped under it
        // (mirrors PostGrid's bottom padding). + dock clearance (0 at rest).
        contentContainerStyle={{ paddingBottom: verticalScale(90) + dockHeight }}
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
      {/* Our own gray spinner, resting in the self-held gap (native
          RefreshControl spinner unreliable on Fabric — see useRefreshGap). */}
      {isPulling && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: verticalScale(64),
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      )}
      {picSheet}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  // ── Multi-select chrome ────────────────────────────────────────────────────
  // The count + Cancel take over the always-visible top bar while selecting (so
  // they never scroll out of reach); the action pills float above the tab bar.
  selectionCountText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  selectionDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: verticalScale(6),
    borderRadius: 999,
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  selectionDoneText: {
    color: colors.accent,
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  selectionActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectionActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(30,30,44,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: verticalScale(12),
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  deletePill: {
    backgroundColor: colors.like,
    borderColor: colors.like,
  },
  postPill: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  actionPillDisabled: {
    opacity: 0.5,
  },
  actionPillText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  // Sparkle balance chip in the own-profile header — shows the balance and
  // taps through to the Sparkle Store (a passive IAP discovery point).
  sparkleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 8,
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
  // Segmented All | Posted | Private control — a pill-shaped track;
  // the active segment fills with the accent.
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
  // Wrap is just a positioning anchor for the corner badge — the bell
  // icon centers naturally inside it. (Was a chatbubble; swapped to the
  // notifications bell 2026-07-05 — a speech bubble implied messaging,
  // which the app doesn't have.)
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
