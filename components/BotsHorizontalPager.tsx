/**
 * BotsHorizontalPager
 *
 * Stories-style horizontal pager for the Home → Bots sub-tab. Each page is
 * a full vertical FullScreenFeed scoped to one bot (or the "All" mixed
 * feed at index 0). User swipes left/right to slide the next bot's feed
 * into view, then continues vertical swiping on that bot's posts.
 *
 * Pages:
 *   index 0      → "All" mixed feed (botUserId = null)
 *   index 1..N   → bots[0..N-1] (botUserId = bots[i-1].id)
 *
 * The first/last edge bounce-back is handled natively by FlatList's
 * snap-to-interval paging + iOS bounce. No custom edge logic needed.
 *
 * Page virtualization: windowSize=3 + maxToRenderPerBatch=1 means only the
 * visible page + one on each side is mounted, so memory is bounded
 * regardless of how many bots exist.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { useDreamFeed } from '@/hooks/useDreamFeed';
import type { BotUser } from '@/hooks/useBotUsers';
import type { DreamPostItem } from '@/components/DreamCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  bots: BotUser[];
  selectedBotId: string | null;
  onSelectedBotChange: (botId: string | null) => void;
  onHudToggle?: (visible: boolean) => void;
  emptyComponent?: React.ReactElement;
  /**
   * Session-scoped per-bot scroll memory. Owned by the parent screen so
   * the screen can clear it on tab blur via useFocusEffect — when the
   * user leaves the Bots tab and returns, every bot starts at index 0
   * again. Keyed by botId (or '__all__' for the mixed All-bots feed).
   */
  indexMapRef: React.RefObject<Map<string, number>>;
}

interface PageDescriptor {
  key: string;
  botId: string | null;
}

export function BotsHorizontalPager({
  bots,
  selectedBotId,
  onSelectedBotChange,
  onHudToggle,
  emptyComponent,
  indexMapRef,
}: Props) {
  // Page list: [All, bot0, bot1, ...]
  const pages = useMemo<PageDescriptor[]>(
    () => [{ key: '__all__', botId: null }, ...bots.map((b) => ({ key: b.id, botId: b.id }))],
    [bots]
  );

  const initialIndex = useMemo(() => {
    if (selectedBotId == null) return 0;
    const idx = pages.findIndex((p) => p.botId === selectedBotId);
    return idx >= 0 ? idx : 0;
    // intentional: only used at mount, ignore subsequent selectedBotId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listRef = useRef<FlatList<PageDescriptor>>(null);
  const currentIndexRef = useRef(initialIndex);

  // External-driven sync: when a pill is tapped (or selectedBotId changes
  // for any other reason), scroll the pager to that index.
  useEffect(() => {
    const targetIndex = pages.findIndex((p) => p.botId === selectedBotId);
    if (targetIndex < 0) return;
    if (targetIndex === currentIndexRef.current) return;
    listRef.current?.scrollToIndex({ index: targetIndex, animated: true });
    currentIndexRef.current = targetIndex;
  }, [selectedBotId, pages]);

  // Page-driven sync: when a horizontal swipe carries the user past the
  // halfway point of a new page, notify the parent so the pill row
  // highlights + scrolls to it. Using onScroll (not onViewableItemsChanged)
  // because onViewableItemsChanged's 60% visibility threshold made the
  // pill feel sluggish — it only fires once the swipe is nearly complete.
  // onScroll at scrollEventThrottle=16 gives 60fps updates during the
  // gesture, and Math.round on the offset means we flip at the 50% mark.
  const pagesRef = useRef(pages);
  const onSelectedBotChangeRef = useRef(onSelectedBotChange);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  useEffect(() => {
    onSelectedBotChangeRef.current = onSelectedBotChange;
  }, [onSelectedBotChange]);

  // Track last offset so we can flip only in the DIRECTION the user is
  // actively swiping. Without this, hovering at the 25% threshold zone
  // makes the pager flip back-and-forth between adjacent pages because
  // each "threshold" frame triggers a flip in the opposite direction.
  const lastOffsetRef = useRef(0);

  const handleScroll = useCallback((e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const lastOffset = lastOffsetRef.current;
    lastOffsetRef.current = offsetX;
    const fraction = offsetX / SCREEN_WIDTH;
    const current = currentIndexRef.current;
    // Forward swipe: flip once fraction has carried 25% past current.
    // Backward swipe: flip once fraction has carried 25% back from current.
    // No-motion frames (offsetX === lastOffset) never trigger a flip,
    // so hovering at the threshold is stable.
    let next = current;
    if (offsetX > lastOffset && fraction > current + 0.25) {
      next = Math.ceil(fraction);
    } else if (offsetX < lastOffset && fraction < current - 0.25) {
      next = Math.floor(fraction);
    }
    if (next === current) return;
    currentIndexRef.current = next;
    const targetBotId = pagesRef.current[next]?.botId ?? null;
    onSelectedBotChangeRef.current(targetBotId);
  }, []);

  // Per-bot scroll-position memory — keyed by botId (or '__all__' for
  // the mixed feed). The Map is owned by the parent screen so it can
  // be cleared on tab blur via useFocusEffect — leaving + returning to
  // the Bots tab resets every bot to index 0. Within a single tab visit,
  // swiping between bots preserves each bot's last visible CARD INDEX
  // (FullScreenFeed shows one card per screen).
  const keyForBot = (botId: string | null) => botId ?? '__all__';

  const renderItem = useCallback(
    ({ item }: { item: PageDescriptor }) => (
      <View style={styles.page}>
        <BotFeedPage
          botId={item.botId}
          initialIndex={indexMapRef.current?.get(keyForBot(item.botId)) ?? 0}
          onIndexChange={(idx) => indexMapRef.current?.set(keyForBot(item.botId), idx)}
          onHudToggle={onHudToggle}
          emptyComponent={emptyComponent}
        />
      </View>
    ),
    [onHudToggle, emptyComponent, indexMapRef]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <FlatList<PageDescriptor>
      ref={listRef}
      data={pages}
      keyExtractor={(item) => item.key}
      horizontal
      // snapToInterval instead of pagingEnabled: the iOS paging settle
      // ignores new touches until it completes, killing rapid swipes.
      // snapToInterval decelerates normally (catchable mid-snap);
      // disableIntervalMomentum preserves one page per fling. 2026-06-12.
      snapToInterval={SCREEN_WIDTH}
      snapToAlignment="start"
      disableIntervalMomentum
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={getItemLayout}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      renderItem={renderItem}
      // Virtualize aggressively — only the visible + adjacent pages mount
      windowSize={3}
      maxToRenderPerBatch={1}
      initialNumToRender={1}
      removeClippedSubviews
      directionalLockEnabled
      decelerationRate="fast"
    />
  );
}

/**
 * One bot's feed page. Owns its own useDreamFeed query so each page has
 * its own pagination state. Cache key matches HomeScreen's hook so
 * tapping back to a previously-loaded bot is instant.
 */
function BotFeedPage({
  botId,
  initialIndex,
  onIndexChange,
  onHudToggle,
  emptyComponent,
}: {
  botId: string | null;
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onHudToggle?: (visible: boolean) => void;
  emptyComponent?: React.ReactElement;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDreamFeed(
    'bots',
    botId
  );
  const queryClient = useQueryClient();

  // Dedup posts by id (same protection HomeScreen has against cursor-boundary repeats)
  const posts = useMemo<DreamPostItem[]>(() => {
    const rows = data?.pages.flatMap((p) => p.rows) ?? [];
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [data]);

  // Pulling down on ANY bot feed should refresh the WHOLE bot section
  // (Kevin's launch ask). Invalidate every 'bots' query: TanStack
  // refetches the currently-mounted pages (visible bot + the two
  // adjacent ones the pager keeps warm via windowSize=3) AND marks
  // unmounted ones stale so they fetch fresh on next swipe-in. The
  // awaited promise resolves once the active refetches land, so the
  // pull-to-refresh spinner accurately waits for fresh data on screen.
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['dreamFeed', 'bots'] });
  }, [queryClient]);

  return (
    <FullScreenFeed
      posts={posts}
      isLoading={isLoading}
      // Clamp initialIndex to the loaded post range so a stale
      // saved index can't out-of-bounds the FlatList. posts.length
      // can drop on refetch (e.g., feed dedup) or grow as pages
      // arrive; saved index from a prior visit might exceed both.
      initialIndex={Math.min(initialIndex, Math.max(0, posts.length - 1))}
      onIndexChange={onIndexChange}
      onRefresh={handleRefresh}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      ListEmptyComponent={emptyComponent}
      onHudToggle={onHudToggle}
      // CRITICAL: disable swipe-to-profile inside the bots pager. The
      // horizontal pan is owned by the outer FlatList here, and the card
      // gesture would otherwise compete and feel broken.
      disableSwipeToProfile
    />
  );
}

const styles = StyleSheet.create({
  page: { width: SCREEN_WIDTH },
});
