/**
 * VerticalPager — TikTok-style vertical pager with a FAST, custom snap.
 *
 * Drop-in scroll container (FlatList-ish API) used by FullScreenFeed. The native
 * FlatList can only give you EITHER a fast non-interruptible snap (pagingEnabled)
 * OR a slow interruptible one (snapToInterval) — never both. This drives the page
 * position with a Reanimated value, so the snap is:
 *   - FAST: a short withTiming (no long native ease-out tail), and
 *   - INTERRUPTIBLE: a new touch cancels the in-flight snap and takes over.
 *
 * Gesture composition: only a clear vertical drag drives the pager. `horizontalFailOffset`
 * lets a horizontal drag (a card's swipe-to-profile) fall through; `simultaneousRef`
 * lets a screen swipe-back recognize alongside it without blocking activation.
 *
 * Features: paging + snap + virtualization + index tracking + onEndReached +
 * imperative scrollToIndex/scrollToOffset + pull-to-refresh.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector, type GestureType } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Snap feel — all tunable.
const SNAP_MS = 170; // duration of the page-settle animation
const SNAP_EASING = Easing.out(Easing.quad); // mild ease-out, no long tail
const FLICK_VELOCITY = 350; // px/s — above this a flick advances a page
const DISTANCE_FRACTION = 0.18; // drag past this fraction of a page advances it
const EDGE_RESISTANCE = 0.4; // rubber-band past first/last page
const PULL_TRIGGER = 70; // overscroll-down (px) at the top to fire refresh
const PULL_REST = 60; // where the strip holds while refreshing

export interface VerticalPagerHandle {
  scrollToIndex: (index: number, animated?: boolean) => void;
  scrollToOffset: (offset: number, animated?: boolean) => void;
}

interface VerticalPagerProps<T> {
  data: T[];
  pageHeight: number;
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
  initialIndex?: number;
  /** Render the active page ± this many. */
  windowSize?: number;
  /** Fires with the new page index after a snap settles. */
  onActiveIndexChange?: (index: number) => void;
  onEndReached?: () => void;
  /** Pages from the end at which onEndReached fires. */
  onEndReachedThreshold?: number;
  /** True while dragging/snapping, false when settled. */
  onScrollActiveChange?: (active: boolean) => void;
  /** Pull-down-at-top to refresh. Spinner shows until the promise resolves. */
  onRefresh?: () => void | Promise<unknown>;
  /** Spinner color. */
  refreshTint?: string;
  /**
   * Horizontal travel (px) at which a vertical drag FAILS so a horizontal
   * gesture under it (swipe-left-to-profile) can take over. `null` disables it
   * entirely — use that when nothing horizontal needs the touch (album views),
   * so a fast up-swipe's thumb-arc drift can never drop the scroll.
   */
  horizontalFailOffset?: number | null;
  /** Receives the pager's Pan gesture so a sibling (a screen swipe-back) can
   *  declare itself simultaneous with it. */
  panRef?: React.MutableRefObject<GestureType | undefined>;
  /** A sibling gesture (screen swipe-back) the Pan may recognize simultaneously
   *  with — so it can never block the pager from activating. */
  simultaneousRef?: React.RefObject<GestureType | undefined>;
  style?: StyleProp<ViewStyle>;
}

function VerticalPagerInner<T>(
  {
    data,
    pageHeight,
    keyExtractor,
    renderItem,
    initialIndex = 0,
    windowSize = 2,
    onActiveIndexChange,
    onEndReached,
    onEndReachedThreshold = 2,
    onScrollActiveChange,
    onRefresh,
    refreshTint = '#FFFFFF',
    horizontalFailOffset = 16,
    panRef,
    simultaneousRef,
    style,
  }: VerticalPagerProps<T>,
  ref: React.Ref<VerticalPagerHandle>
) {
  const count = data.length;

  const translateY = useSharedValue(-initialIndex * pageHeight);
  const startTranslateY = useSharedValue(0);
  const indexSV = useSharedValue(initialIndex);
  // Mirror count + pageHeight into shared values for the worklets (updated in
  // an effect, never during render).
  const countSV = useSharedValue(count);
  const pageHeightSV = useSharedValue(pageHeight);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    countSV.value = count;
  }, [count, countSV]);
  useEffect(() => {
    pageHeightSV.value = pageHeight;
    // Re-align to the current page if the page size changed (e.g. layout).
    translateY.value = -indexSV.value * pageHeight;
  }, [pageHeight, pageHeightSV, indexSV, translateY]);

  // Latest-callback refs so worklet→runOnJS hops never hit a stale closure,
  // without re-creating the gesture each render.
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;
  const onEndReachedRef = useRef(onEndReached);
  onEndReachedRef.current = onEndReached;
  const onScrollActiveRef = useRef(onScrollActiveChange);
  onScrollActiveRef.current = onScrollActiveChange;

  // Read count from the shared value (stable ref) — NOT the `count` closure —
  // so this callback stays identity-stable when posts grow on pagination.
  // Otherwise it changes on every data-grow, which rebuilds the Pan's useMemo
  // and makes GestureDetector needlessly re-attach the gesture mid-scroll.
  const onEndReachedThresholdRef = useRef(onEndReachedThreshold);
  onEndReachedThresholdRef.current = onEndReachedThreshold;
  const commitIndex = useCallback(
    (i: number) => {
      setActiveIndex(i);
      onActiveIndexChangeRef.current?.(i);
      if (onEndReachedRef.current && i >= countSV.value - 1 - onEndReachedThresholdRef.current) {
        onEndReachedRef.current();
      }
    },
    [countSV]
  );

  const setActive = useCallback((active: boolean) => {
    onScrollActiveRef.current?.(active);
  }, []);

  // ── Id-anchoring (2026-07-06) ──
  // The pager positions purely by index (translateY = -index × pageHeight), so
  // if `data`'s prefix ever shifts (a refetch reshuffles rows, an item above
  // the viewport is removed), the same index suddenly shows a DIFFERENT item —
  // the "different post pops into view mid-scroll" bug. Anchor by KEY instead:
  // remember which item the user is on; when `data` changes and that item
  // moved, re-align to its new index instantly (no animation — visually
  // nothing changes, which is the point).
  const keyExtractorRef = useRef(keyExtractor);
  keyExtractorRef.current = keyExtractor;
  const activeKeyRef = useRef<string | null>(null);

  // User navigation (swipe / scrollToIndex) adopts the new card as the anchor.
  // Runs on index changes only — declared BEFORE the data-shift effect so that
  // when both fire in one commit, intent wins.
  useEffect(() => {
    const it = data[activeIndex];
    activeKeyRef.current = it != null ? keyExtractorRef.current(it, activeIndex) : null;
    // data deliberately not a dep: a data-only change must not re-adopt here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Data change: if the anchored item now lives at a different index, follow it.
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  useEffect(() => {
    const key = activeKeyRef.current;
    if (key == null) return;
    const idx = activeIndexRef.current;
    const cur = data[idx];
    if (cur != null && keyExtractorRef.current(cur, idx) === key) return; // stable — nothing to do
    const newIdx = data.findIndex((it, i) => keyExtractorRef.current(it, i) === key);
    // Anchored item vanished (deleted/hidden): clamp into range and adopt
    // whatever sits at the clamped index.
    const target = newIdx >= 0 ? newIdx : Math.min(idx, Math.max(0, data.length - 1));
    if (target === idx) return;
    indexSV.value = target;
    setActiveIndex(target);
    cancelAnimation(translateY);
    translateY.value = -target * pageHeightSV.value;
    if (newIdx >= 0) activeKeyRef.current = key;
    // Keep the parent's index bookkeeping true (same item, new index) —
    // without firing onEndReached side effects.
    onActiveIndexChangeRef.current?.(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Pull-to-refresh ──
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;
  const hasRefreshSV = useSharedValue(!!onRefresh);
  useEffect(() => {
    hasRefreshSV.value = !!onRefresh;
  }, [onRefresh, hasRefreshSV]);
  const refreshingRef = useRef(false);
  const startRefresh = useCallback(() => {
    if (refreshingRef.current || !onRefreshRef.current) return;
    refreshingRef.current = true;
    Promise.resolve(onRefreshRef.current()).finally(() => {
      refreshingRef.current = false;
      translateY.value = withTiming(0, { duration: 200, easing: SNAP_EASING });
    });
  }, [translateY]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number, animated = true) => {
        const clamped = Math.max(0, Math.min(count - 1, index));
        indexSV.value = clamped;
        setActiveIndex(clamped);
        const targetY = -clamped * pageHeight;
        cancelAnimation(translateY);
        translateY.value = animated
          ? withTiming(targetY, { duration: SNAP_MS, easing: SNAP_EASING })
          : targetY;
      },
      scrollToOffset: (offset: number, animated = true) => {
        const clampedIndex = Math.max(0, Math.min(count - 1, Math.round(offset / pageHeight)));
        indexSV.value = clampedIndex;
        setActiveIndex(clampedIndex);
        const targetY = -offset;
        cancelAnimation(translateY);
        translateY.value = animated
          ? withTiming(targetY, { duration: SNAP_MS, easing: SNAP_EASING })
          : targetY;
      },
    }),
    [count, pageHeight, indexSV, translateY]
  );

  const pan = useMemo(() => {
    let g = Gesture.Pan()
      // Only a clear vertical drag drives the pager.
      .activeOffsetY([-12, 12]);
    if (panRef) g = g.withRef(panRef);
    // Let a sibling screen swipe-back recognize simultaneously, so it can never
    // hold the touch "undecided" and block the pager from activating.
    if (simultaneousRef) g = g.simultaneousWithExternalGesture(simultaneousRef);
    // Fail on horizontal travel ONLY when something horizontal needs the touch
    // (swipe-left-to-profile). On album views (null) we skip this, so a fast
    // up-swipe's sideways thumb-arc can never fail the scroll.
    if (horizontalFailOffset != null) {
      g = g.failOffsetX([-horizontalFailOffset, horizontalFailOffset]);
    }
    return g
      .onStart(() => {
        'worklet';
        // Cancel any in-flight snap and take over from where it is — this is
        // what makes the snap interruptible.
        cancelAnimation(translateY);
        startTranslateY.value = translateY.value;
        runOnJS(setActive)(true);
      })
      .onUpdate((e) => {
        'worklet';
        const ph = pageHeightSV.value;
        const minY = -(countSV.value - 1) * ph;
        let y = startTranslateY.value + e.translationY;
        if (y > 0)
          y = y * EDGE_RESISTANCE; // before first page
        else if (y < minY) y = minY + (y - minY) * EDGE_RESISTANCE; // past last
        translateY.value = y;
      })
      .onEnd((e) => {
        'worklet';
        const ph = pageHeightSV.value;
        const base = indexSV.value;
        // Pull-to-refresh: at the very top, pulled down past the trigger.
        if (base === 0 && hasRefreshSV.value && translateY.value > PULL_TRIGGER) {
          translateY.value = withTiming(PULL_REST, { duration: 140, easing: SNAP_EASING });
          runOnJS(startRefresh)();
          runOnJS(setActive)(false);
          return;
        }
        let target = base;
        if (e.velocityY < -FLICK_VELOCITY || e.translationY < -ph * DISTANCE_FRACTION) {
          target = base + 1;
        } else if (e.velocityY > FLICK_VELOCITY || e.translationY > ph * DISTANCE_FRACTION) {
          target = base - 1;
        }
        if (target < 0) target = 0;
        const maxI = countSV.value - 1;
        if (target > maxI) target = maxI;
        translateY.value = withTiming(-target * ph, { duration: SNAP_MS, easing: SNAP_EASING });
        if (target !== base) {
          indexSV.value = target;
          runOnJS(commitIndex)(target);
        }
        runOnJS(setActive)(false);
      });
  }, [
    commitIndex,
    countSV,
    hasRefreshSV,
    horizontalFailOffset,
    indexSV,
    pageHeightSV,
    panRef,
    setActive,
    simultaneousRef,
    startRefresh,
    startTranslateY,
    translateY,
  ]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Pull-to-refresh spinner — fades in with the top overscroll, stays while
  // refreshing (the strip is held at PULL_REST).
  const spinnerStyle = useAnimatedStyle(() => {
    const pull = translateY.value > 0 ? translateY.value : 0;
    return { opacity: Math.min(1, pull / PULL_TRIGGER) };
  });

  const windowItems = useMemo(() => {
    const lo = Math.max(0, activeIndex - windowSize);
    const hi = Math.min(count - 1, activeIndex + windowSize);
    const out: number[] = [];
    for (let i = lo; i <= hi; i++) out.push(i);
    return out;
  }, [activeIndex, windowSize, count]);

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.viewport, style]}>
        {onRefresh ? (
          <Animated.View pointerEvents="none" style={[styles.spinner, spinnerStyle]}>
            <ActivityIndicator color={refreshTint} />
          </Animated.View>
        ) : null}
        <Animated.View style={[StyleSheet.absoluteFill, stripStyle]}>
          {windowItems.map((i) => (
            <View
              key={keyExtractor(data[i], i)}
              style={[styles.page, { height: pageHeight, top: i * pageHeight }]}
            >
              {renderItem({ item: data[i], index: i })}
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

export const VerticalPager = forwardRef(VerticalPagerInner) as <T>(
  props: VerticalPagerProps<T> & { ref?: React.Ref<VerticalPagerHandle> }
) => React.ReactElement;

const styles = StyleSheet.create({
  viewport: { flex: 1, overflow: 'hidden' },
  page: { position: 'absolute', left: 0, right: 0 },
  spinner: { position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center', zIndex: 2 },
});
