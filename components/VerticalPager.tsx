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
import { View, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
// Pull-to-refresh feel. The strip follows the finger nearly 1:1 so the pull
// reads as "the image comes down with me" (the old 0.4–0.75 resistance made
// it feel stuck and snap back). Refresh fires on distance OR a quick
// downward flick, Instagram-style.
const PULL_RESISTANCE = 0.85;
const PULL_TRIGGER = 110; // strip-px past the top to fire refresh (~130px finger)
const PULL_FLICK_VELOCITY = 900; // px/s downward release that fires from ≥ half-trigger
// While refreshing, the strip parks at insets.top + PULL_REST_BELOW_INSET so the
// revealed gap clears the floating top chrome (feed pills sit at insets.top..~+40)
// and the spinner is fully visible inside it with breathing room: the spinner
// rests around insets.top+48 and is ~26 tall → bottom ≈ +74, so 96 leaves ~22px
// between it and the parked image (76 left ~2px — Kevin 2026-07-09: "barely any
// margin").
const PULL_REST_BELOW_INSET = 96;

export interface VerticalPagerHandle {
  scrollToIndex: (index: number, animated?: boolean) => void;
  scrollToOffset: (offset: number, animated?: boolean) => void;
  /** Programmatic pull-to-refresh (tab re-tap): jump to the top, park the strip
   *  with the spinner, run onRefresh, settle on the NEW top post — identical to
   *  a finger pull. Falls back to a plain scroll-to-top when no onRefresh. */
  refresh: () => void;
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
  // True while a pull-to-refresh is in flight (declared here because the
  // anchor effects below consult it; owned by the pull-to-refresh block).
  const refreshingRef = useRef(false);

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
    // During a pull-to-refresh the data swap is INTENTIONAL — following the old
    // top post to its new index would visually undo the refresh (the user would
    // see the exact same post and conclude nothing happened). startRefresh
    // resets to the new top instead.
    if (refreshingRef.current) return;
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
  const insets = useSafeAreaInsets();
  const pullRestY = insets.top + PULL_REST_BELOW_INSET;
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;
  const hasRefreshSV = useSharedValue(!!onRefresh);
  useEffect(() => {
    hasRefreshSV.value = !!onRefresh;
  }, [onRefresh, hasRefreshSV]);
  // 1 while refreshing → the indicator holds at full opacity + the strip stays
  // parked at pullRestY until onRefresh resolves.
  const refreshingSV = useSharedValue(0);
  const startRefresh = useCallback(() => {
    if (refreshingRef.current || !onRefreshRef.current) return;
    refreshingRef.current = true;
    refreshingSV.value = 1;
    // onRefresh AWAITS its work (e.g. prefetch-then-swap), so the spinner stays
    // up exactly as long as the refresh takes — no arbitrary floor, no flash.
    Promise.resolve(onRefreshRef.current()).finally(() => {
      refreshingRef.current = false;
      refreshingSV.value = 0;
      // Refresh only fires from index 0; if the user is still there, drop the
      // key anchor so the data-change effect does NOT chase the old top post
      // into the reshuffled order — the strip settles onto the NEW top post.
      // (If they swiped away mid-refresh, leave their position alone.)
      if (indexSV.value === 0) {
        activeKeyRef.current = null;
        translateY.value = withTiming(0, { duration: 250, easing: SNAP_EASING });
      }
    });
  }, [translateY, refreshingSV, indexSV]);

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
      refresh: () => {
        if (refreshingRef.current) return;
        indexSV.value = 0;
        setActiveIndex(0);
        cancelAnimation(translateY);
        if (!onRefreshRef.current) {
          translateY.value = withTiming(0, { duration: SNAP_MS, easing: SNAP_EASING });
          return;
        }
        translateY.value = withTiming(pullRestY, { duration: 250, easing: SNAP_EASING });
        startRefresh();
      },
    }),
    [count, pageHeight, indexSV, translateY, pullRestY, startRefresh]
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
        if (y > 0) {
          // Top overscroll. Gentler resistance when pull-to-refresh is available
          // at the first page (so it reaches the trigger); firm rubber-band
          // otherwise.
          const r = hasRefreshSV.value && indexSV.value === 0 ? PULL_RESISTANCE : EDGE_RESISTANCE;
          y = y * r;
        } else if (y < minY) y = minY + (y - minY) * EDGE_RESISTANCE; // past last
        translateY.value = y;
      })
      .onEnd((e) => {
        'worklet';
        const ph = pageHeightSV.value;
        const base = indexSV.value;
        // Pull-to-refresh: at the very top, pulled past the trigger distance —
        // or released with a quick downward flick from at least half of it.
        if (
          base === 0 &&
          hasRefreshSV.value &&
          (translateY.value > PULL_TRIGGER ||
            (translateY.value > PULL_TRIGGER / 2 && e.velocityY > PULL_FLICK_VELOCITY))
        ) {
          translateY.value = withTiming(pullRestY, { duration: 180, easing: SNAP_EASING });
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
    pullRestY,
    setActive,
    simultaneousRef,
    startRefresh,
    startTranslateY,
    translateY,
  ]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Pull-to-refresh indicator: a plain (always-spinning) spinner that rides
  // down at half the pull speed into the revealed gap, settling BELOW the
  // floating top chrome (its base sits at insets.top + 12 and it shifts down up
  // to 36px → final resting spot ~insets.top + 48, clear of the feed pills
  // which end around insets.top + 40). HIDDEN until the pull crosses the
  // trigger — the spinner appearing = "release now and it WILL refresh"
  // (showing it earlier promised a refresh that a short pull never delivered).
  // A 12px ramp past the trigger softens the pop-in. Full opacity while
  // refreshing.
  const indicatorStyle = useAnimatedStyle(() => {
    const pull = translateY.value > 0 ? translateY.value : 0;
    return {
      opacity: refreshingSV.value === 1 ? 1 : Math.min(1, Math.max(0, (pull - PULL_TRIGGER) / 12)),
      transform: [{ translateY: Math.min(pull * 0.5, 36) }],
    };
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
          <Animated.View
            pointerEvents="none"
            style={[styles.spinnerWrap, { top: insets.top + 12 }, indicatorStyle]}
          >
            <ActivityIndicator size="small" color={refreshTint} />
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
  // top is set inline from the safe-area inset.
  spinnerWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 2 },
});
