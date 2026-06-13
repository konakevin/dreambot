/**
 * VerticalPager — TikTok-style vertical pager with a FAST, custom snap.
 *
 * Drop-in scroll container (FlatList-ish API) used by FullScreenFeed behind a
 * flag. The native FlatList can only give you EITHER a fast non-interruptible
 * snap (pagingEnabled) OR a slow interruptible one (snapToInterval) — never
 * both. This drives the page position with a Reanimated value, so the snap is:
 *   - FAST: a short withTiming (no long native ease-out tail), and
 *   - INTERRUPTIBLE: a new touch cancels the in-flight snap and takes over.
 *
 * Gesture composition: the vertical Pan uses failOffsetX so a horizontal drag
 * (a card's swipe-to-profile) and taps/pinch fall through to the card's own
 * gestures; only a clear vertical drag drives the pager.
 *
 * v1 scope: paging + snap + virtualization + index tracking + onEndReached +
 * imperative scrollToIndex. (No pull-to-refresh yet — added once the FEEL is
 * confirmed.) Isolated behind FullScreenFeed's `experimentalPager` flag.
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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

  const commitIndex = useCallback(
    (i: number) => {
      setActiveIndex(i);
      onActiveIndexChangeRef.current?.(i);
      if (onEndReachedRef.current && i >= count - 1 - onEndReachedThreshold) {
        onEndReachedRef.current();
      }
    },
    [count, onEndReachedThreshold]
  );

  const setActive = useCallback((active: boolean) => {
    onScrollActiveRef.current?.(active);
  }, []);

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

  const pan = useMemo(
    () =>
      Gesture.Pan()
        // Only a clear vertical drag drives the pager; horizontal drags + taps
        // fall through to the card's own gestures.
        .activeOffsetY([-12, 12])
        .failOffsetX([-16, 16])
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
        }),
    [
      commitIndex,
      countSV,
      hasRefreshSV,
      indexSV,
      pageHeightSV,
      setActive,
      startRefresh,
      startTranslateY,
      translateY,
    ]
  );

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
