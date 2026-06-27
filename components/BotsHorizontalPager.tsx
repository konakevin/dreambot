/**
 * BotsHorizontalPager
 *
 * Stories-style horizontal pager for the Bots tab. Each page is a full vertical
 * FullScreenFeed scoped to one bot (or the "All" mixed feed at index 0). User
 * swipes left/right to slide the next bot's feed into view, then continues
 * vertical swiping on that bot's posts.
 *
 * Pages:
 *   index 0      → "All" mixed feed (botUserId = null)
 *   index 1..N   → bots[0..N-1] (botUserId = bots[i-1].id)
 *
 * Gesture model (mirrors VerticalPager so left/right feels like up/down):
 *   A Reanimated `translateX` drives the strip; a gesture-handler Pan with
 *   PERPENDICULAR axis offsets handles the swipe. `activeOffsetX` means only a
 *   clear horizontal drag drives the pager; `failOffsetY` means a vertical drag
 *   FAILS this gesture immediately so the inner VerticalPager (up/down feed)
 *   takes over with no wait. The page-settle is a short, INTERRUPTIBLE
 *   `withTiming` — a new touch cancels the in-flight slide and takes over.
 *
 *   This replaced a native FlatList (snapToInterval + directionalLockEnabled):
 *   the native scrollview owned the touch system through its whole deceleration
 *   tail, so the slide felt slow, vertical swipes were blocked until it settled,
 *   and a still-decelerating list would re-lock the next touch horizontal
 *   ("stuck in left/right"). A Reanimated animation holds no gesture, so none of
 *   that happens. 2026-06-22.
 *
 * Page virtualization: only the active page ± WINDOW is mounted, so memory is
 * bounded regardless of how many bots exist.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { useDreamFeed } from '@/hooks/useDreamFeed';
import type { BotUser } from '@/hooks/useBotUsers';
import type { DreamPostItem } from '@/components/DreamCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Horizontal page-swipe feel — all tunable; mirrors VerticalPager.
const SNAP_MS = 200; // fast page-settle (no long native deceleration tail)
const SNAP_EASING = Easing.out(Easing.quad); // mild ease-out, no long tail
const FLICK_VELOCITY = 350; // px/s — above this a flick advances a page
const DISTANCE_FRACTION = 0.2; // drag past this fraction of a page advances it
const EDGE_RESISTANCE = 0.4; // rubber-band past the first/last page
const WINDOW = 1; // mount the active page ± this many (memory bound)

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

  const translateX = useSharedValue(-initialIndex * SCREEN_WIDTH);
  const startTranslateX = useSharedValue(0);
  const indexSV = useSharedValue(initialIndex);
  // Mirror count into a shared value for the worklets (updated in an effect,
  // never during render) so the gesture's useMemo stays identity-stable as bots
  // load — otherwise GestureDetector needlessly re-attaches mid-swipe.
  const countSV = useSharedValue(pages.length);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // Tracks the committed page so the external-sync effect below can tell a
  // pill-tap (animate to it) from the pager's own commit (already there).
  const currentIndexRef = useRef(initialIndex);

  useEffect(() => {
    countSV.value = pages.length;
  }, [pages.length, countSV]);

  // Latest-callback refs so the worklet→JS hop never hits a stale closure,
  // without re-creating the gesture each render.
  const onSelectedBotChangeRef = useRef(onSelectedBotChange);
  onSelectedBotChangeRef.current = onSelectedBotChange;
  const pagesRef = useRef(pages);
  pagesRef.current = pages;

  // Commit a settled page: update the window, the pill highlight, and the
  // external-sync guard. Stable identity so the gesture useMemo never rebuilds.
  const commitIndex = useCallback((i: number) => {
    currentIndexRef.current = i;
    setActiveIndex(i);
    const botId = pagesRef.current[i]?.botId ?? null;
    onSelectedBotChangeRef.current(botId);
  }, []);

  // External-driven sync: a pill tap (or any other selectedBotId change) slides
  // the pager to that page. Guarded against the swipe's own commit so it never
  // double-animates (the swipe sets currentIndexRef before this effect runs).
  useEffect(() => {
    const targetIndex = pages.findIndex((p) => p.botId === selectedBotId);
    if (targetIndex < 0 || targetIndex === currentIndexRef.current) return;
    currentIndexRef.current = targetIndex;
    indexSV.value = targetIndex;
    setActiveIndex(targetIndex);
    cancelAnimation(translateX);
    translateX.value = withTiming(-targetIndex * SCREEN_WIDTH, {
      duration: SNAP_MS,
      easing: SNAP_EASING,
    });
  }, [selectedBotId, pages, indexSV, translateX]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        // Only a clear horizontal drag drives the pager...
        .activeOffsetX([-12, 12])
        // ...and a vertical drag FAILS it immediately, so the inner VerticalPager
        // (the up/down feed) takes over with zero wait — no "stuck in left/right".
        .failOffsetY([-12, 12])
        .onStart(() => {
          'worklet';
          // Interruptible: a new touch cancels the in-flight slide and takes over.
          cancelAnimation(translateX);
          startTranslateX.value = translateX.value;
        })
        .onUpdate((e) => {
          'worklet';
          const minX = -(countSV.value - 1) * SCREEN_WIDTH;
          let x = startTranslateX.value + e.translationX;
          if (x > 0)
            x = x * EDGE_RESISTANCE; // before the first page
          else if (x < minX) x = minX + (x - minX) * EDGE_RESISTANCE; // past the last
          translateX.value = x;
        })
        .onEnd((e) => {
          'worklet';
          const base = indexSV.value;
          let target = base;
          if (e.velocityX < -FLICK_VELOCITY || e.translationX < -SCREEN_WIDTH * DISTANCE_FRACTION) {
            target = base + 1;
          } else if (
            e.velocityX > FLICK_VELOCITY ||
            e.translationX > SCREEN_WIDTH * DISTANCE_FRACTION
          ) {
            target = base - 1;
          }
          if (target < 0) target = 0;
          const maxI = countSV.value - 1;
          if (target > maxI) target = maxI;
          translateX.value = withTiming(-target * SCREEN_WIDTH, {
            duration: SNAP_MS,
            easing: SNAP_EASING,
          });
          if (target !== base) {
            indexSV.value = target;
            runOnJS(commitIndex)(target);
          }
        }),
    [commitIndex, countSV, indexSV, startTranslateX, translateX]
  );

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const windowItems = useMemo(() => {
    const lo = Math.max(0, activeIndex - WINDOW);
    const hi = Math.min(pages.length - 1, activeIndex + WINDOW);
    const out: number[] = [];
    for (let i = lo; i <= hi; i++) out.push(i);
    return out;
  }, [activeIndex, pages.length]);

  // Per-bot scroll-position memory key (or '__all__' for the mixed feed).
  const keyForBot = (botId: string | null) => botId ?? '__all__';

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.viewport}>
        <Animated.View style={[StyleSheet.absoluteFill, stripStyle]}>
          {windowItems.map((i) => {
            const item = pages[i];
            return (
              <View key={item.key} style={[styles.page, { left: i * SCREEN_WIDTH }]}>
                <BotFeedPage
                  botId={item.botId}
                  initialIndex={indexMapRef.current?.get(keyForBot(item.botId)) ?? 0}
                  onIndexChange={(idx) => indexMapRef.current?.set(keyForBot(item.botId), idx)}
                  onHudToggle={onHudToggle}
                  emptyComponent={emptyComponent}
                />
              </View>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
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
  // adjacent ones the pager keeps warm) AND marks unmounted ones stale
  // so they fetch fresh on next swipe-in. The awaited promise resolves
  // once the active refetches land, so the pull-to-refresh spinner
  // accurately waits for fresh data on screen.
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['dreamFeed', 'bots'] });
  }, [queryClient]);

  return (
    <FullScreenFeed
      posts={posts}
      isLoading={isLoading}
      // Clamp initialIndex to the loaded post range so a stale
      // saved index can't out-of-bounds the feed. posts.length
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
      // horizontal pan is owned by the outer pager here, and the card
      // gesture would otherwise compete and feel broken.
      disableSwipeToProfile
    />
  );
}

const styles = StyleSheet.create({
  viewport: { flex: 1, overflow: 'hidden', backgroundColor: '#000' },
  page: { position: 'absolute', top: 0, bottom: 0, width: SCREEN_WIDTH },
});
