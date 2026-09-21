/**
 * inboxFeed — THE FULLSCREEN INBOX (Kevin 2026-09-18): the inbox itself, fullscreen, one page per row, swipe up
 * and down. Post rows fill the screen with the post (the same card the feed uses); every other row is a card with
 * its text and its actions (components/InboxCardPage.tsx). A sender's batch of shares and a day's dreams expand
 * into one page per post. Page order = inbox order (lib/inboxPages.ts).
 *
 * Entry: tap any inbox row → /inboxFeed?start=<groupKey>. Back (top-left chevron / horizontal swipe) returns to the
 * list, which re-anchors on the row you were on (store/inboxFeed.ts). Each row is marked seen as its page becomes
 * visible. A one-time "Swipe up for the next one" hint teaches the gesture (first-run flag 'inboxStrip').
 */
import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, type GestureType } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Text } from '@/components/AppText';
import { safeBack } from '@/lib/navigate';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';
import { hasSeenFlag, markFlagSeen } from '@/lib/firstRunFlags';
import { useAxisLockSwipeBack } from '@/hooks/gestures/useAxisLockSwipeBack';
import { useInboxGrouped, type InboxGroup } from '@/hooks/useInboxGrouped';
import { iconForGroup } from '@/lib/inboxGroupText';
import { useAuthStore } from '@/store/auth';
import { useInboxFeedStore } from '@/store/inboxFeed';
import { useCommentDrafts } from '@/store/commentDrafts';
import { useFavoriteIds } from '@/hooks/useFavoriteIds';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { useLikeIds } from '@/hooks/useLikeIds';
import { useToggleLike } from '@/hooks/useToggleLike';
import { useDeletePost, useQuarantinePost } from '@/hooks/useDeletePost';
import { useAdminShowQuarantineButton } from '@/lib/adminPrefs';
import { VerticalPager, type VerticalPagerHandle } from '@/components/VerticalPager';
import { FeedCard } from '@/components/FullScreenFeed';
import { CommentOverlay } from '@/components/CommentOverlay';
import { LikesOverlay } from '@/components/LikesOverlay';
import { InboxCardPage } from '@/components/InboxCardPage';
import { FeedCardSkeleton } from '@/components/Skeleton';
import type { DreamPostItem } from '@/components/DreamCard';
import {
  buildInboxPages,
  positionLabel,
  startIndexFor,
  type InboxPage,
  type PageGroupInput,
} from '@/lib/inboxPages';

const FALLBACK_HEIGHT = 800;

/** Groups whose members must be fetched (a sender's share batch, a day's pooled dreams). */
function needsMembers(g: InboxGroup): boolean {
  return (
    !!g.uploadId && (g.type === 'post_share' || (g.type === 'dream_generated' && g.eventCount > 1))
  );
}

export default function InboxFeedScreen() {
  const { start } = useLocalSearchParams<{ start?: string }>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [showAdminQuarantine] = useAdminShowQuarantineButton();
  const queryClient = useQueryClient();
  const setCurrentGroupKey = useInboxFeedStore((s) => s.setCurrentGroupKey);

  // ── The rows: the same cached query the inbox list uses ─────────────────────────────────────────────────
  const { data } = useInboxGrouped();
  const groups = useMemo(() => data?.pages.flatMap((p) => p.groups) ?? [], [data]);
  const groupByKey = useMemo(() => new Map(groups.map((g) => [g.groupKey, g])), [groups]);

  const memberKeys = useMemo(() => groups.filter(needsMembers).map((g) => g.groupKey), [groups]);
  const membersQuery = useQuery({
    queryKey: ['inboxFeedMembers', user?.id, memberKeys.join(',')],
    enabled: !!user && memberKeys.length > 0,
    staleTime: 60_000,
    queryFn: async (): Promise<Record<string, string[]>> => {
      const { data: rows, error } = await supabase
        .from('notifications')
        .select('group_key, upload_id')
        .eq('recipient_id', user!.id)
        .in('group_key', memberKeys)
        .not('upload_id', 'is', null)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const out: Record<string, string[]> = {};
      for (const r of rows ?? []) {
        const key = r.group_key as string;
        const up = r.upload_id as string;
        if (!out[key]) out[key] = [];
        if (!out[key].includes(up)) out[key].push(up);
      }
      // A day's dreams walk newest first (the freshest opens first); shares stay oldest first (the order sent).
      for (const key of Object.keys(out)) if (key.startsWith('dream:')) out[key].reverse();
      return out;
    },
  });
  const membersReady = memberKeys.length === 0 || membersQuery.data !== undefined;

  // Renders the admin X removed on this screen: their pages leave the pager at once (the inbox list itself
  // refetches on the mutation's success invalidation).
  const [hiddenUploads, setHiddenUploads] = useState<ReadonlySet<string>>(new Set());
  const pages = useMemo<InboxPage[]>(() => {
    if (!membersReady) return [];
    const members = membersQuery.data ?? {};
    const inputs: PageGroupInput[] = groups.map((g) => ({
      groupKey: g.groupKey,
      type: g.type,
      subtype: g.subtype ?? null,
      uploadIds: g.uploadId ? (members[g.groupKey] ?? [g.uploadId]) : [],
      senderName: g.previewUsernames[0] ?? null,
      actorCount: g.actorCount,
      body: g.body ?? null,
    }));
    const commentIds: Record<string, string | null> = {};
    for (const g of groups) if (g.commentId) commentIds[g.groupKey] = g.commentId;
    return buildInboxPages(inputs, commentIds).filter(
      (p) => p.kind !== 'post' || !hiddenUploads.has(p.uploadId)
    );
  }, [groups, membersReady, membersQuery.data, hiddenUploads]);

  // ── The posts behind the post pages ─────────────────────────────────────────────────────────────────────
  const postIds = useMemo(() => {
    const ids: string[] = [];
    for (const p of pages) if (p.kind === 'post' && !ids.includes(p.uploadId)) ids.push(p.uploadId);
    return ids;
  }, [pages]);
  const postsQuery = useQuery({
    queryKey: ['inboxFeedPosts', postIds.join(',')],
    enabled: postIds.length > 0,
    staleTime: 60_000,
    queryFn: async (): Promise<DreamPostItem[]> => {
      const { data: rows, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .in('id', postIds)
        .is('quarantined_at', null);
      if (error) throw error;
      return castRows(rows).map((row) => ({
        ...mapToDreamPost(row),
        is_public: (row.is_public as boolean) ?? false,
        posted_at: (row.posted_at as string | null) ?? null,
        description: (row.description as string | null) ?? null,
      }));
    },
  });
  const postsById = useMemo(
    () => new Map((postsQuery.data ?? []).map((p) => [p.id, p])),
    [postsQuery.data]
  );
  const postsReady = postIds.length === 0 || postsQuery.data !== undefined;

  // ── Pager state ─────────────────────────────────────────────────────────────────────────────────────────
  const pagerRef = useRef<VerticalPagerHandle>(null);
  const initialIndex = useMemo(() => startIndexFor(pages, start ?? ''), [pages, start]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState(FALLBACK_HEIGHT);
  const pageHeight = containerHeight > 0 ? containerHeight : FALLBACK_HEIGHT;
  const bottomPadding = 16 + insets.bottom;

  // ── Seen marking: every row is marked seen as its page becomes visible ───────────────────────────────────
  const seenRef = useRef(new Set<string>());
  const markedAnyRef = useRef(false);
  const markSeen = useCallback(
    (groupKey: string) => {
      const uid = user?.id;
      if (!uid || seenRef.current.has(groupKey)) return;
      seenRef.current.add(groupKey);
      markedAnyRef.current = true;
      void supabase
        .rpc('mark_group_seen', { p_user_id: uid, p_group_key: groupKey })
        .then(({ error }) => {
          if (error && __DEV__) console.warn('[inboxFeed] mark_group_seen failed', error.message);
        });
    },
    [user?.id]
  );
  useEffect(() => {
    return () => {
      const uid = user?.id;
      if (!markedAnyRef.current || !uid) return;
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped', uid] });
      queryClient.invalidateQueries({ queryKey: ['newNotificationCount', uid] });
    };
  }, [queryClient, user?.id]);

  // ── HUD (tap-to-hide chrome), overlays, hint ────────────────────────────────────────────────────────────
  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value < 0.5 ? 'none' : 'auto',
  }));
  const handleHudToggle = useCallback(
    (visible: boolean) => {
      overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
    },
    [overlayOpacity]
  );
  const [commentPost, setCommentPost] = useState<DreamPostItem | null>(null);
  const [likesPost, setLikesPost] = useState<DreamPostItem | null>(null);
  const [hint, setHint] = useState(false);
  useEffect(() => {
    if (pages.length < 2) return;
    let live = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    void hasSeenFlag('inboxStrip').then((seen) => {
      if (!live || seen) return;
      setHint(true);
      void markFlagSeen('inboxStrip');
      timer = setTimeout(() => setHint(false), 3500);
    });
    return () => {
      live = false;
      if (timer) clearTimeout(timer);
    };
  }, [pages.length]);

  // A comment row opens its thread on arrival (one-shot, once its post is loaded).
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (autoOpenedRef.current || pages.length === 0) return;
    const first = pages[initialIndex];
    if (!first || first.kind !== 'post' || !first.commentId) return;
    const post = postsById.get(first.uploadId);
    if (!post) return;
    autoOpenedRef.current = true;
    setCommentPost(post);
    handleHudToggle(false);
  }, [pages, initialIndex, postsById, handleHudToggle]);

  const handleActiveIndex = useCallback(
    (idx: number) => {
      setActiveIndex(idx);
      handleHudToggle(true);
      setHint(false);
      const page = pages[idx];
      if (!page) return;
      markSeen(page.groupKey);
      setCurrentGroupKey(page.groupKey);
      useCommentDrafts.getState().clearExcept(page.kind === 'post' ? page.uploadId : null);
    },
    [pages, markSeen, setCurrentGroupKey, handleHudToggle]
  );
  // The pager only reports CHANGES; fire once for the landing page.
  const landedRef = useRef(false);
  useEffect(() => {
    if (landedRef.current || pages.length === 0) return;
    landedRef.current = true;
    handleActiveIndex(initialIndex);
  }, [pages, initialIndex, handleActiveIndex]);

  // ── Back: chevron + axis-locked horizontal swipe (the pager owns vertical) ──────────────────────────────
  const pagerPanRef = useRef<GestureType | undefined>(undefined);
  const goBack = useCallback(() => {
    safeBack('/inbox');
  }, []);
  const {
    gesture: backGesture,
    animatedStyle: backStyle,
    ref: backRef,
  } = useAxisLockSwipeBack({ simultaneousWith: pagerPanRef, onDismiss: goBack });

  // ── Post-page plumbing (the same hooks FullScreenFeed wires into FeedCard) ──────────────────────────────
  const { data: favoriteIds = new Set<string>() } = useFavoriteIds();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { data: likeIds = new Set<string>() } = useLikeIds();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: quarantinePost } = useQuarantinePost();
  const handleDelete = useCallback((uploadId: string) => deletePost(uploadId), [deletePost]);
  const handleAdminQuarantine = useCallback(
    (uploadId: string) => {
      setHiddenUploads((prev) => new Set([...prev, uploadId]));
      quarantinePost(uploadId);
    },
    [quarantinePost]
  );
  const onComment = useCallback(
    (p: DreamPostItem) => {
      setCommentPost(p);
      handleHudToggle(false);
    },
    [handleHudToggle]
  );
  const onLikesPress = useCallback(
    (p: DreamPostItem) => {
      setLikesPost(p);
      handleHudToggle(false);
    },
    [handleHudToggle]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: InboxPage; index: number }) => {
      const group = groupByKey.get(item.groupKey);
      if (!group) return <View style={{ height: pageHeight }} />;
      if (item.kind === 'card') {
        return (
          <InboxCardPage group={group} cardHeight={pageHeight} bottomPadding={bottomPadding} />
        );
      }
      const post = postsById.get(item.uploadId);
      if (!post) {
        return (
          <InboxCardPage
            group={group}
            cardHeight={pageHeight}
            bottomPadding={bottomPadding}
            postGone
          />
        );
      }
      return (
        <FeedCard
          item={post}
          isActive={index === activeIndex}
          isLiked={likeIds.has(post.id)}
          isSaved={favoriteIds.has(post.id)}
          bottomPadding={bottomPadding}
          cardHeight={pageHeight}
          disableSwipeToProfile
          userId={user?.id}
          isAdmin={isAdmin}
          showAdminQuarantine={showAdminQuarantine}
          toggleLike={toggleLike}
          toggleFavorite={toggleFavorite}
          onComment={onComment}
          onLikesPress={onLikesPress}
          onDelete={handleDelete}
          onAdminQuarantine={handleAdminQuarantine}
          onHudToggle={handleHudToggle}
          showBottomScrim
          // The row's context lives with the post's metadata (just above the username), not in the top pill.
          contextLine={{
            icon: iconForGroup(group).name,
            color: iconForGroup(group).color,
            text: item.context,
          }}
        />
      );
    },
    [
      groupByKey,
      postsById,
      pageHeight,
      bottomPadding,
      activeIndex,
      likeIds,
      favoriteIds,
      user?.id,
      isAdmin,
      showAdminQuarantine,
      toggleLike,
      toggleFavorite,
      onComment,
      onLikesPress,
      handleDelete,
      handleAdminQuarantine,
      handleHudToggle,
    ]
  );

  // Top pill = navigation state only ("Inbox · 8 of 46"): a fixed spot that never moves while you swipe. It
  // NAMES the inbox because these pages are the same cards the feed shows, so a bare count gave no clue which
  // stack you were walking (Kevin, 2026-09-21). The context line rides with the post's metadata at the
  // bottom-left (DreamCard contextLine); card pages ARE the context.
  const pill = activeIndex !== null ? positionLabel(activeIndex, pages.length) : null;
  const ready = membersReady && postsReady && pages.length > 0;

  return (
    <GestureDetector gesture={backGesture}>
      <Animated.View style={[s.root, backStyle]}>
        <StatusBar hidden />
        <Animated.View style={[s.backButton, overlayStyle]}>
          <TouchableOpacity onPress={goBack} hitSlop={12}>
            <View style={s.backCircle}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        {pill ? (
          // A plain box-none wrapper: the full-width centring strip must never catch a tap meant for the back
          // chevron beneath it (the animated style's pointerEvents would otherwise make it opaque to touches).
          <View style={s.pillWrap} pointerEvents="box-none">
            <Animated.View style={[s.pillColumn, overlayStyle]} pointerEvents="none">
              <View style={s.pill}>
                <Text style={s.pillPosition}>{pill}</Text>
              </View>
              {hint ? (
                <View style={s.hint}>
                  <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
                  <Text style={s.hintText}>Swipe up for the next one</Text>
                </View>
              ) : null}
            </Animated.View>
          </View>
        ) : null}
        <View
          style={s.pagerWrap}
          onLayout={(e) => {
            const h = Math.round(e.nativeEvent.layout.height);
            if (h > 0 && Math.abs(h - containerHeight) > 1) setContainerHeight(h);
          }}
        >
          {ready ? (
            <VerticalPager
              ref={pagerRef}
              data={pages}
              keyExtractor={(p) => p.key}
              pageHeight={pageHeight}
              initialIndex={initialIndex}
              renderItem={renderItem}
              onActiveIndexChange={handleActiveIndex}
              horizontalFailOffset={null}
              panRef={pagerPanRef}
              simultaneousRef={backRef}
            />
          ) : (
            <FeedCardSkeleton />
          )}
        </View>
        {commentPost && (
          <CommentOverlay
            post={commentPost}
            onClose={() => {
              setCommentPost(null);
              handleHudToggle(true);
            }}
            hideTabBar
          />
        )}
        {likesPost && (
          <LikesOverlay
            post={likesPost}
            onClose={() => {
              setLikesPost(null);
              handleHudToggle(true);
            }}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  pagerWrap: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: verticalScale(54),
    left: horizontalScale(16),
    zIndex: 20,
  },
  backCircle: {
    width: horizontalScale(36),
    height: horizontalScale(36),
    borderRadius: horizontalScale(18),
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillWrap: {
    position: 'absolute',
    top: verticalScale(60),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9,
  },
  pillColumn: { alignItems: 'center' },
  pill: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: verticalScale(14),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
  },
  pillPosition: { color: '#FFFFFF', fontSize: fontScale(12), fontWeight: '600', opacity: 0.9 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
    marginTop: verticalScale(8),
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: verticalScale(12),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
  },
  hintText: { color: '#FFFFFF', fontSize: fontScale(12), opacity: 0.9 },
});
