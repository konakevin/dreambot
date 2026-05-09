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
 * pagingEnabled + iOS bounce. No custom edge logic needed.
 *
 * Page virtualization: windowSize=3 + maxToRenderPerBatch=1 means only the
 * visible page + one on each side is mounted, so memory is bounded
 * regardless of how many bots exist.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
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

  // Page-driven sync: when a horizontal swipe settles on a new page,
  // notify the parent so the pill row highlights it.
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const settled = viewableItems.find((v) => v.index != null);
      if (!settled || settled.index == null) return;
      const idx = settled.index;
      if (idx === currentIndexRef.current) return;
      currentIndexRef.current = idx;
      const targetBotId = pages[idx]?.botId ?? null;
      onSelectedBotChange(targetBotId);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: PageDescriptor }) => (
      <View style={styles.page}>
        <BotFeedPage botId={item.botId} onHudToggle={onHudToggle} emptyComponent={emptyComponent} />
      </View>
    ),
    [onHudToggle, emptyComponent]
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
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
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
  onHudToggle,
  emptyComponent,
}: {
  botId: string | null;
  onHudToggle?: (visible: boolean) => void;
  emptyComponent?: React.ReactElement;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useDreamFeed(
    'bots',
    botId
  );

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

  return (
    <FullScreenFeed
      posts={posts}
      isLoading={isLoading}
      onRefresh={() => refetch()}
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
